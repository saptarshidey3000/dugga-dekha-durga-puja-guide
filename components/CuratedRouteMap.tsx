'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface RouteMapStop {
  order: number;
  name: string;
  lat: number;
  lng: number;
  area?: string;
  walkingTime?: string;
  pandalId?: string;
}

export interface CuratedRouteMapProps {
  regionName?: string;
  distance?: string;
  walkingTime?: string;
  stops: RouteMapStop[];
  activeStopOrder?: number | null;
  onSelectStop?: (order: number, pandalId?: string) => void;
  heightClass?: string;
}

export default function CuratedRouteMap({
  regionName = 'Kolkata',
  distance,
  walkingTime,
  stops = [],
  activeStopOrder,
  onSelectStop,
  heightClass = 'h-[360px] sm:h-[420px]',
}: CuratedRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [order: number]: any }>({});
  const polylineRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);

  // Generate external Google Maps URL with no API key
  const externalGoogleMapsUrl = (() => {
    const valid = stops.filter((s) => s.lat && s.lng);
    if (valid.length === 0) {
      return 'https://www.google.com/maps/search/?api=1&query=Kolkata+Durga+Puja';
    }
    if (valid.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${valid[0].lat},${valid[0].lng}`;
    }
    const origin = `${valid[0].lat},${valid[0].lng}`;
    const destination = `${valid[valid.length - 1].lat},${valid[valid.length - 1].lng}`;
    const waypoints = valid
      .slice(1, -1)
      .map((s) => `${s.lat},${s.lng}`)
      .join('|');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }&travelmode=walking`;
  })();

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        const L = await import('leaflet');

        const validStops = stops.filter((s) => s.lat && s.lng);
        if (validStops.length === 0) {
          return;
        }

        const initialLat = validStops[0].lat;
        const initialLng = validStops[0].lng;

        if (!mapInstanceRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom: 15,
            scrollWheelZoom: false,
            attributionControl: true,
          });

          // Section 14: Leaflet + OpenStreetMap standard tile source
          const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          });

          tileLayer.on('tileerror', () => {
            console.warn('OpenStreetMap tile error');
          });

          tileLayer.addTo(map);
          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing markers & polylines
        Object.values(markersRef.current).forEach((marker: any) => marker.remove());
        markersRef.current = {};
        if (polylineRef.current) {
          polylineRef.current.remove();
          polylineRef.current = null;
        }

        const boundsCoords: [number, number][] = [];
        const polylineCoords: [number, number][] = [];

        // Add Numbered Markers in Curated Route Order (Section 16: Deep Red & Antique Gold)
        validStops.forEach((stop) => {
          const coords: [number, number] = [stop.lat, stop.lng];
          boundsCoords.push(coords);
          polylineCoords.push(coords);

          const isActive = activeStopOrder === stop.order;
          const orderFormatted = stop.order < 10 ? `0${stop.order}` : `${stop.order}`;

          const isHeritageStop = stop.name.includes('🏛️');

          const markerHtml = `
            <div style="
              background-color: ${isActive ? '#8F1D18' : isHeritageStop ? '#241714' : '#C9973E'};
              border: 2.5px solid ${isActive ? '#E1BE68' : isHeritageStop ? '#E1BE68' : '#FFFFFF'};
              color: ${isActive ? '#F7F0E2' : isHeritageStop ? '#E1BE68' : '#120E0C'};
              border-radius: 9999px;
              width: ${isActive ? '38px' : '32px'};
              height: ${isActive ? '38px' : '32px'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isHeritageStop ? '14px' : '13px'};
              font-weight: 900;
              font-family: system-ui, sans-serif;
              box-shadow: 0 4px 16px rgba(18,14,12,0.6);
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              ${isHeritageStop ? '🏛️' : orderFormatted}
            </div>
          `;

          const icon = L.divIcon({
            html: markerHtml,
            className: 'curated-stop-marker',
            iconSize: [isActive ? 38 : 32, isActive ? 38 : 32],
            iconAnchor: [isActive ? 19 : 16, isActive ? 19 : 16],
          });

          const marker = L.marker(coords, { icon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: inherit; padding: 4px; min-width: 180px; color: #120E0C;">
              <div style="font-size: 10px; font-weight: 800; color: #8F1D18; text-transform: uppercase;">
                ${isHeritageStop ? '🏛️ HERITAGE COURTYARD' : `STOP ${orderFormatted}`}
              </div>
              <div style="font-size: 13px; font-weight: 800; margin-top: 2px; color: #120E0C;">
                ${stop.name}
              </div>
              ${stop.walkingTime ? `<div style="font-size: 11px; color: #5A4E46; margin-top: 2px;">🚶 ${stop.walkingTime}</div>` : ''}
              <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                ${stop.pandalId ? `<a href="${isHeritageStop ? `/bonedi/${stop.pandalId}` : `/pandal/${stop.pandalId}`}" style="font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">Details →</a>` : ''}
                <a href="https://maps.google.com/?q=${stop.lat},${stop.lng}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
                  Google Maps ↗
                </a>
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectStop) onSelectStop(stop.order, stop.pandalId);
          });

          markersRef.current[stop.order] = marker;
        });

        // Curated Route Polyline (Deep Red #8F1D18)
        if (polylineCoords.length >= 2) {
          polylineRef.current = L.polyline(polylineCoords, {
            color: '#8F1D18',
            weight: 4,
            opacity: 0.95,
            dashArray: '6, 6',
          }).addTo(map);
        }

        // Fit map bounds
        if (boundsCoords.length > 1) {
          map.fitBounds(boundsCoords, { padding: [35, 35], maxZoom: 16 });
        } else if (boundsCoords.length === 1) {
          map.setView(boundsCoords[0], 15);
        }
      } catch (err) {
        console.error('CuratedRouteMap failed to load:', err);
        if (isMounted) setMapError(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [stops, activeStopOrder, onSelectStop]);

  // Center on active stop
  useEffect(() => {
    if (activeStopOrder && markersRef.current[activeStopOrder] && mapInstanceRef.current) {
      const marker = markersRef.current[activeStopOrder];
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [activeStopOrder]);

  // Fallback State (Section 19: MAP TEMPORARILY UNAVAILABLE)
  if (mapError) {
    return (
      <div className={`relative w-full rounded-3xl bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-2xl ${heightClass}`}>
        <div className="w-12 h-12 rounded-full bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E] flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[#E1BE68]" />
        </div>
        <p className="font-editorial text-xl font-bold text-[#F7F0E2]">
          MAP TEMPORARILY UNAVAILABLE
        </p>
        <p className="text-xs text-[#F7F0E2]/80 max-w-sm leading-relaxed">
          The interactive map layer could not be loaded, but your curated route itinerary and pandal steps remain active.
        </p>
        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md mt-2 border border-[#C9973E]/50"
        >
          <span>OPEN IN GOOGLE MAPS</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E1BE68]" />
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 shadow-2xl overflow-hidden flex flex-col">
      {/* Section 17: MAP UI HEADER */}
      <div className="p-4 sm:p-5 border-b border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-3 bg-[#241714]/80">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1BE68] block">
            {regionName.toUpperCase()}
          </span>
          <h3 className="font-editorial text-lg sm:text-xl font-extrabold text-[#F7F0E2]">
            THE WALKING ROUTE
          </h3>
          {(distance || walkingTime) && (
            <p className="text-xs font-bold text-[#E1BE68] mt-0.5">
              {distance && <span>{distance}</span>}
              {distance && walkingTime && <span> · </span>}
              {walkingTime && <span>~{walkingTime} WALK</span>}
            </p>
          )}
        </div>

        {/* Section 18: OPEN IN GOOGLE MAPS ↗ */}
        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold uppercase tracking-wider transition-all border border-[#C9973E]/50 shadow-md hover:scale-105"
        >
          <span>OPEN IN GOOGLE MAPS</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E1BE68]" />
        </a>
      </div>

      {/* Map Viewport Container */}
      <div className={`relative w-full ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Section 21: Clean User-Friendly Label instead of Curated Route Coordinates */}
        <div className="absolute bottom-3 right-3 z-10 bg-[#120E0C]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9973E]/40 text-[11px] text-[#F7F0E2] font-semibold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#E1BE68] animate-pulse" />
          <span>{distance && walkingTime ? `${distance} · ~${walkingTime} WALK` : 'Curated Walking Route'}</span>
        </div>
      </div>
    </div>
  );
}
