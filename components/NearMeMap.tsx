'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NearbyPlace } from '@/lib/near-me';
import { ExternalLink, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface NearMeMapProps {
  userCoords: [number, number];
  places: NearbyPlace[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (placeId: string) => void;
  heightClass?: string;
  zoom?: number;
}

export default function NearMeMap({
  userCoords,
  places = [],
  selectedPlaceId,
  onSelectPlace,
  heightClass = 'h-[400px] sm:h-[500px]',
  zoom = 14,
}: NearMeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        if (typeof window === 'undefined' || !mapContainerRef.current) return;

        const L = await import('leaflet');

        if (!mapInstanceRef.current && mapContainerRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: userCoords,
            zoom,
            scrollWheelZoom: false,
            attributionControl: true,
          });

          const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
          });

          tileLayer.on('tileerror', () => {
            console.warn('OpenStreetMap tile error');
          });

          tileLayer.addTo(map);
          mapInstanceRef.current = map;
        }

        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing markers
        Object.values(markersRef.current).forEach((m: any) => m.remove());
        markersRef.current = {};

        const boundsCoords: [number, number][] = [userCoords];

        // 1. Add User Location Marker (Pulsing Blue & Gold Pin)
        const userHtml = `
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: rgba(59, 130, 246, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #2563EB; border: 3px solid #F7F0E2; color: #FFFFFF; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 4px 14px rgba(0,0,0,0.6); z-index: 2;">
              📍
            </div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userHtml,
          className: 'custom-user-icon',
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const userMarker = L.marker(userCoords, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
        userMarker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; color: #120E0C; min-width: 140px; text-align: center;">
            <div style="font-size: 11px; font-weight: 800; color: #2563EB; text-transform: uppercase; letter-spacing: 0.05em;">
              YOUR LOCATION
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #120E0C; margin-top: 2px;">
              Current GPS Position
            </div>
          </div>
        `);
        markersRef.current['user'] = userMarker;

        // 2. Add Place Markers
        places.forEach((place, idx) => {
          if (!place.latitude || !place.longitude) return;

          const coords: [number, number] = [place.latitude, place.longitude];
          boundsCoords.push(coords);

          const isSelected = selectedPlaceId === place.id;
          const order = idx + 1;
          const orderFormatted = order < 10 ? `0${order}` : `${order}`;

          let markerBg = '#C9973E';
          let markerBorder = isSelected ? '#E1BE68' : '#FFFFFF';
          let markerText = '#120E0C';
          let iconContent = orderFormatted;

          if (place.type === 'bonedi') {
            markerBg = isSelected ? '#8F1D18' : '#241714';
            markerBorder = '#E1BE68';
            markerText = '#F7F0E2';
            iconContent = '🏛️';
          } else if (place.type === 'metro') {
            markerBg = isSelected ? '#8F1D18' : '#173023';
            markerBorder = '#7ce0b2';
            markerText = '#F7F0E2';
            iconContent = '🚇';
          } else if (isSelected) {
            markerBg = '#8F1D18';
            markerBorder = '#E1BE68';
            markerText = '#F7F0E2';
          }

          const markerHtml = `
            <div style="
              background-color: ${markerBg};
              border: 2.5px solid ${markerBorder};
              color: ${markerText};
              border-radius: 9999px;
              width: ${isSelected ? '38px' : '32px'};
              height: ${isSelected ? '38px' : '32px'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${place.type === 'pandal' ? '12px' : '14px'};
              font-weight: 900;
              font-family: system-ui, sans-serif;
              box-shadow: 0 4px 16px rgba(18,14,12,0.7);
              transition: all 0.2s ease;
              cursor: pointer;
            " title="${place.name}">
              ${iconContent}
            </div>
          `;

          const markerIcon = L.divIcon({
            html: markerHtml,
            className: 'near-me-place-icon',
            iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
            iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
          });

          const marker = L.marker(coords, { icon: markerIcon }).addTo(map);

          marker.bindPopup(`
            <div style="font-family: inherit; padding: 4px; min-width: 190px; color: #120E0C;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 2px;">
                <span style="font-size: 10px; font-weight: 800; color: #8F1D18; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${place.typeLabel.toUpperCase()}
                </span>
                <span style="font-size: 10px; font-weight: 800; background: #8F1D18; color: #F7F0E2; padding: 1px 6px; border-radius: 9999px;">
                  ${place.formattedDistance}
                </span>
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #120E0C; line-height: 1.25;">
                ${place.name}
              </div>
              ${place.bengaliName ? `<div style="font-size: 11px; color: #8F1D18; font-weight: 600; font-family: serif;">${place.bengaliName}</div>` : ''}
              <div style="font-size: 11px; color: #5A4E46; margin-top: 3px;">
                📍 ${place.address}
              </div>
              ${place.nearestMetro ? `<div style="font-size: 11px; color: #8F1D18; font-weight: 600; margin-top: 2px;">🚇 ${place.nearestMetro}</div>` : ''}
              <div style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E5D7C5; padding-top: 6px;">
                <a href="${place.detailUrl}" style="font-size: 11px; color: #8F1D18; font-weight: 800; text-decoration: underline;">
                  View Details →
                </a>
                <a href="${place.googleMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #8F1D18; font-weight: 800; text-decoration: underline;">
                  Get Directions ↗
                </a>
              </div>
            </div>
          `);

          marker.on('click', () => {
            if (onSelectPlace) onSelectPlace(place.id);
          });

          markersRef.current[place.id] = marker;
        });

        // Fit map bounds to show user and nearby places
        if (boundsCoords.length > 1) {
          map.fitBounds(boundsCoords, { padding: [40, 40], maxZoom: 16 });
        } else {
          map.setView(userCoords, 15);
        }
      } catch (err) {
        console.error('NearMeMap failed to initialize:', err);
        if (isMounted) setMapError(true);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [userCoords, places, selectedPlaceId, onSelectPlace, zoom]);

  // Handle focus when selectedPlaceId changes
  useEffect(() => {
    if (selectedPlaceId && markersRef.current[selectedPlaceId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedPlaceId];
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
      marker.openPopup();
    }
  }, [selectedPlaceId]);

  if (mapError) {
    return (
      <div className={`relative w-full rounded-3xl bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-2xl ${heightClass}`}>
        <div className="w-12 h-12 rounded-full bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E] flex items-center justify-center">
          <MapPin className="w-6 h-6 text-[#E1BE68]" />
        </div>
        <p className="font-editorial text-xl font-bold text-[#F7F0E2]">
          MAP VIEW TEMPORARILY UNAVAILABLE
        </p>
        <p className="text-xs text-[#F7F0E2]/80 max-w-sm leading-relaxed">
          The interactive map layer could not load, but your nearby pandals, Bonedi Bari, and Metro stations remain fully listed below.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border-2 border-[#C9973E]/40 shadow-2xl ${heightClass}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Legend / Quick Status */}
      <div className="absolute top-3 left-3 z-10 bg-[#120E0C]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9973E]/40 text-[11px] text-[#F7F0E2] font-semibold flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse" />
        <span>Your Location &amp; Nearby Spots</span>
      </div>

      <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2 bg-[#120E0C]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9973E]/40 text-[10px] text-[#F7F0E2] font-bold shadow-lg">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C9973E]"></span> Pandal</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#241714] border border-[#E1BE68]"></span> Bonedi</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#173023] border border-emerald-400"></span> Metro</span>
      </div>
    </div>
  );
}
