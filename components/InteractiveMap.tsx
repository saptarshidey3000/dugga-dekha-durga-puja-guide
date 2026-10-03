'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pandal, MetroStation, Route, BonediBari } from '@/data/types';
import { ExternalLink, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  pandals?: Pandal[];
  bonediBaris?: BonediBari[];
  metroStation?: MetroStation;
  metroPoint?: { name: string; coordinates: [number, number]; exit?: string };
  activeRoute?: Route;
  selectedPandalId?: string | null;
  onSelectPandal?: (id: string) => void;
  heightClass?: string;
  zoom?: number;
  center?: [number, number];
}

export default function InteractiveMap({
  pandals = [],
  bonediBaris = [],
  metroStation,
  metroPoint,
  activeRoute,
  selectedPandalId,
  onSelectPandal,
  heightClass = 'h-[360px] sm:h-[450px]',
  zoom = 14,
  center,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);

  // Generate external Google Maps query URL (Requires NO API key)
  const fallbackCoords: [number, number] | null = center
    ? center
    : metroPoint?.coordinates
    ? metroPoint.coordinates
    : metroStation?.coordinates
    ? metroStation.coordinates
    : pandals.length > 0 && pandals[0].latitude && pandals[0].longitude
    ? [pandals[0].latitude, pandals[0].longitude]
    : bonediBaris.length > 0 && bonediBaris[0].latitude && bonediBaris[0].longitude
    ? [bonediBaris[0].latitude, bonediBaris[0].longitude]
    : [22.5180, 88.3444];

  const externalGoogleMapsUrl = fallbackCoords
    ? `https://www.google.com/maps/search/?api=1&query=${fallbackCoords[0]},${fallbackCoords[1]}`
    : `https://www.google.com/maps/search/?api=1&query=Kolkata+Durga+Puja`;

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        const L = await import('leaflet');

        // Calculate initial center from verified coordinates only
        let initialLat = 22.5180;
        let initialLng = 88.3444;

        if (center) {
          initialLat = center[0];
          initialLng = center[1];
        } else if (metroPoint?.coordinates) {
          initialLat = metroPoint.coordinates[0];
          initialLng = metroPoint.coordinates[1];
        } else if (metroStation?.coordinates) {
          initialLat = metroStation.coordinates[0];
          initialLng = metroStation.coordinates[1];
        } else if (pandals.length > 0 && pandals[0].latitude && pandals[0].longitude) {
          initialLat = pandals[0].latitude;
          initialLng = pandals[0].longitude;
        } else if (bonediBaris.length > 0 && bonediBaris[0].latitude && bonediBaris[0].longitude) {
          initialLat = bonediBaris[0].latitude;
          initialLng = bonediBaris[0].longitude;
        }

        if (!mapInstanceRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [initialLat, initialLng],
            zoom,
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
        const routePoints: [number, number][] = [];

        // 1. Add Starting Metro Station Marker (Section 8: START METRO)
        const activeMetro =
          metroPoint ||
          (metroStation
            ? { name: metroStation.name, coordinates: metroStation.coordinates, exit: undefined }
            : null);

        if (activeMetro?.coordinates) {
          const metroCoords = activeMetro.coordinates;
          boundsCoords.push(metroCoords);
          routePoints.push(metroCoords);

          const metroHtml = `
            <div style="background-color: #8F1D18; border: 2.5px solid #C9973E; color: #F7F0E2; border-radius: 9999px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 16px rgba(18,14,12,0.6); cursor: pointer;">
              🚇
            </div>
          `;
          const metroIcon = L.divIcon({
            html: metroHtml,
            className: 'custom-metro-icon',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const metroMarker = L.marker(metroCoords, { icon: metroIcon }).addTo(map);
          metroMarker.bindPopup(`
            <div style="font-family: inherit; padding: 4px; color: #120E0C; min-width: 150px;">
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #8F1D18; letter-spacing: 0.05em;">START METRO</div>
              <div style="font-size: 14px; font-weight: 800; color: #120E0C;">${activeMetro.name} Metro</div>
              ${activeMetro.exit ? `<div style="font-size: 11px; color: #8F1D18; font-weight: 600; margin-top: 2px;">${activeMetro.exit}</div>` : ''}
              <a href="https://www.google.com/maps/search/?api=1&query=${metroCoords[0]},${metroCoords[1]}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 6px; font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
                Navigate on Google Maps ↗
              </a>
            </div>
          `);
          markersRef.current['metro'] = metroMarker;
        }

        // 2. Add Curated Pandal Markers in Curated Route Order (Section 16: Gold circles, active Red)
        pandals.forEach((pandal, idx) => {
          if (!pandal.latitude || !pandal.longitude) return;

          const coords: [number, number] = [pandal.latitude, pandal.longitude];
          boundsCoords.push(coords);
          routePoints.push(coords);

          const isSelected = selectedPandalId === pandal.id;
          const stopOrder = activeRoute
            ? activeRoute.stops.find((s) => s.pandalId === pandal.id)?.order || idx + 1
            : idx + 1;
          const orderFormatted = stopOrder < 10 ? `0${stopOrder}` : `${stopOrder}`;

          // Dugga colors: Gold circles with dark text, active marker Deep Red with gold border
          const pandalHtml = `
            <div style="
              background-color: ${isSelected ? '#8F1D18' : '#C9973E'};
              border: 2.5px solid ${isSelected ? '#E1BE68' : '#FFFFFF'};
              color: ${isSelected ? '#F7F0E2' : '#120E0C'};
              border-radius: 9999px;
              width: ${isSelected ? '38px' : '32px'};
              height: ${isSelected ? '38px' : '32px'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 900;
              font-family: system-ui, sans-serif;
              box-shadow: 0 4px 16px rgba(18,14,12,0.6);
              transition: all 0.2s ease;
              cursor: pointer;
            ">
              ${orderFormatted}
            </div>
          `;

          const pandalIcon = L.divIcon({
            html: pandalHtml,
            className: 'custom-pandal-icon',
            iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
            iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
          });

          const marker = L.marker(coords, { icon: pandalIcon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: inherit; padding: 4px; min-width: 175px; color: #120E0C;">
              <div style="font-size: 10px; font-weight: 800; color: #8F1D18; text-transform: uppercase;">
                STOP ${orderFormatted} • ${pandal.area}
              </div>
              <div style="font-size: 13px; font-weight: 800; margin-top: 2px; color: #120E0C;">
                ${pandal.name}
              </div>
              <div style="font-size: 11px; color: #5A4E46; margin-top: 3px;">
                🚶 ${pandal.walkingTime || 'Walk from stop'}
              </div>
              <div style="margin-top: 6px; display: flex; gap: 8px;">
                <a href="/pandal/${pandal.id}" style="font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
                  Details →
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
                  Google Maps ↗
                </a>
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectPandal) onSelectPandal(pandal.id);
          });

          markersRef.current[pandal.id] = marker;
        });

        // 3. Add Bonedi Bari Markers if present
        bonediBaris.forEach((bari, idx) => {
          if (!bari.latitude || !bari.longitude) return;

          const coords: [number, number] = [bari.latitude, bari.longitude];
          boundsCoords.push(coords);
          routePoints.push(coords);

          const isSelected = selectedPandalId === bari.id;
          const stopOrder = idx + 1;
          const orderFormatted = stopOrder < 10 ? `0${stopOrder}` : `${stopOrder}`;

          const bariHtml = `
            <div style="
              background-color: ${isSelected ? '#8F1D18' : '#C9973E'};
              border: 2.5px solid ${isSelected ? '#E1BE68' : '#FFFFFF'};
              color: ${isSelected ? '#F7F0E2' : '#120E0C'};
              border-radius: 9999px;
              width: ${isSelected ? '38px' : '32px'};
              height: ${isSelected ? '38px' : '32px'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 900;
              box-shadow: 0 4px 16px rgba(18,14,12,0.6);
              transition: all 0.2s ease;
              cursor: pointer;
            ">
              ${orderFormatted}
            </div>
          `;

          const bariIcon = L.divIcon({
            html: bariHtml,
            className: 'custom-bonedi-icon',
            iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
            iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
          });

          const marker = L.marker(coords, { icon: bariIcon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: inherit; padding: 4px; min-width: 175px; color: #120E0C;">
              <div style="font-size: 10px; font-weight: 800; color: #8F1D18; text-transform: uppercase;">
                COURTYARD ${orderFormatted} • ${bari.area}
              </div>
              <div style="font-size: 13px; font-weight: 800; margin-top: 2px; color: #120E0C;">
                ${bari.name}
              </div>
              <div style="font-size: 11px; color: #5A4E46; margin-top: 3px;">
                🚶 ${bari.walkingTime || 'Walk from station'}
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=${bari.latitude},${bari.longitude}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 6px; font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
                Google Maps ↗
              </a>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectPandal) onSelectPandal(bari.id);
          });

          markersRef.current[bari.id] = marker;
        });

        // 4. Draw Curated Route Line (Section 16: Deep Red route line)
        if (routePoints.length >= 2) {
          polylineRef.current = L.polyline(routePoints, {
            color: '#8F1D18',
            weight: 4,
            opacity: 0.95,
            dashArray: '6, 6',
          }).addTo(map);
        }

        // Auto fit bounds
        if (boundsCoords.length > 1) {
          map.fitBounds(boundsCoords, { padding: [35, 35], maxZoom: 16 });
        } else if (boundsCoords.length === 1) {
          map.setView(boundsCoords[0], 15);
        }
      } catch (err) {
        console.error('Map initialization error:', err);
        if (isMounted) setMapError(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [pandals, bonediBaris, metroStation, metroPoint, activeRoute, selectedPandalId, center, zoom, onSelectPandal]);

  // Handle focus when selectedPandalId changes
  useEffect(() => {
    if (selectedPandalId && markersRef.current[selectedPandalId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedPandalId];
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [selectedPandalId]);

  // Section 19: MAP FAILURE FALLBACK (MAP TEMPORARILY UNAVAILABLE)
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
          The interactive map layer could not be loaded, but your curated route, walking distances, and pandal stops remain fully active.
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
    <div className={`relative w-full rounded-3xl overflow-hidden border-2 border-[#C9973E]/40 shadow-2xl ${heightClass}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Toolbar with External Google Maps Link */}
      <div className="absolute top-3 right-3 z-10">
        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#120E0C]/90 hover:bg-[#241714] text-[#F7F0E2] text-[11px] font-bold border border-[#C9973E]/40 shadow-md backdrop-blur-md transition-all hover:scale-105"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3 text-[#E1BE68]" />
        </a>
      </div>

      {/* Section 21: Clean User-Friendly Label instead of Curated Route Coordinates */}
      <div className="absolute bottom-3 right-3 z-10 bg-[#120E0C]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9973E]/40 text-[11px] text-[#F7F0E2] font-semibold flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#E1BE68] animate-pulse" />
        <span>Curated Walking Route</span>
      </div>
    </div>
  );
}
