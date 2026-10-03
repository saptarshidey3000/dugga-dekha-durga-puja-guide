'use client';

import React, { useEffect, useRef } from 'react';
import { Pandal, MetroStation, Route, BonediBari } from '@/data/types';
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

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = await import('leaflet');

      // Calculate initial center
      let initialLat = 22.5800;
      let initialLng = 88.3600;

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
          attributionControl: false,
        });

        // CartoDB Voyager tiles for clear, warm, high-contrast map rendering
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
        }).addTo(map);

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

      // 1. Add Metro Station Marker if present
      const activeMetro = metroPoint || (metroStation ? { name: metroStation.name, coordinates: metroStation.coordinates, exit: undefined } : null);
      if (activeMetro?.coordinates) {
        const metroCoords = activeMetro.coordinates;
        boundsCoords.push(metroCoords);
        routePoints.push(metroCoords);

        const metroHtml = `
          <div style="background-color: #8F1D18; border: 2px solid #C9973E; color: #F7F0E2; border-radius: 9999px; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 4px 14px rgba(143,29,24,0.4); cursor: pointer;">
            🚇
          </div>
        `;
        const metroIcon = L.divIcon({
          html: metroHtml,
          className: 'custom-metro-icon',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const metroMarker = L.marker(metroCoords, { icon: metroIcon }).addTo(map);
        metroMarker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; color: #120E0C;">
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #B52A22;">STARTING POINT</div>
            <div style="font-size: 14px; font-weight: 700; color: #120E0C;">${activeMetro.name} Metro</div>
            ${activeMetro.exit ? `<div style="font-size: 11px; color: #8F1D18; font-weight: 600;">${activeMetro.exit}</div>` : ''}
          </div>
        `);
        markersRef.current['metro'] = metroMarker;
      }

      // 2. Add Pandal Markers (ordered if route stops available)
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

        const pandalHtml = `
          <div style="
            background-color: ${isSelected ? '#8F1D18' : '#C9973E'};
            border: 2px solid ${isSelected ? '#C9973E' : '#FFFFFF'};
            color: ${isSelected ? '#F7F0E2' : '#120E0C'};
            border-radius: 9999px;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            box-shadow: 0 4px 14px rgba(143,29,24,0.35);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${orderFormatted}
          </div>
        `;

        const pandalIcon = L.divIcon({
          html: pandalHtml,
          className: 'custom-pandal-icon',
          iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
          iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
        });

        const marker = L.marker(coords, { icon: pandalIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 170px; color: #120E0C;">
            <div style="font-size: 10px; font-weight: 700; color: #B52A22; text-transform: uppercase;">
              Stop ${orderFormatted} • ${pandal.area}
            </div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 2px; color: #120E0C;">
              ${pandal.name}
            </div>
            <div style="font-size: 11px; color: #241714; margin-top: 3px;">
              🚶 ${pandal.walkingTime || 'Walk from stop'}
            </div>
            <a href="/pandal/${pandal.id}" style="display: inline-block; margin-top: 6px; font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
              View Pandal Details →
            </a>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectPandal) onSelectPandal(pandal.id);
        });

        markersRef.current[pandal.id] = marker;
      });

      // 3. Add Bonedi Bari Markers
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
            border: 2px solid ${isSelected ? '#E1BE68' : '#FFFFFF'};
            color: ${isSelected ? '#F7F0E2' : '#120E0C'};
            border-radius: 9999px;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            box-shadow: 0 4px 14px rgba(143,29,24,0.35);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${orderFormatted}
          </div>
        `;

        const bariIcon = L.divIcon({
          html: bariHtml,
          className: 'custom-bonedi-icon',
          iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
          iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
        });

        const marker = L.marker(coords, { icon: bariIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px; min-width: 170px; color: #120E0C;">
            <div style="font-size: 10px; font-weight: 700; color: #8F1D18; text-transform: uppercase;">
              Stop ${orderFormatted} • ${bari.area}
            </div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 2px; color: #120E0C;">
              ${bari.name}
            </div>
            <div style="font-size: 11px; color: #241714; margin-top: 3px;">
              🚶 ${bari.walkingTime || 'Walk from station'}
            </div>
            <a href="/bonedi/${bari.id}" style="display: inline-block; margin-top: 6px; font-size: 11px; color: #8F1D18; font-weight: 700; text-decoration: underline;">
              View Household Details →
            </a>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectPandal) onSelectPandal(bari.id);
        });

        markersRef.current[bari.id] = marker;
      });

      // 4. Draw Route Polyline (Section 17: deep red route line)
      if (routePoints.length >= 2) {
        polylineRef.current = L.polyline(routePoints, {
          color: '#8F1D18',
          weight: 4,
          opacity: 0.9,
          dashArray: '8, 8',
        }).addTo(map);
      }

      // Auto fit bounds
      if (boundsCoords.length > 1) {
        map.fitBounds(boundsCoords, { padding: [40, 40], maxZoom: 16 });
      } else if (boundsCoords.length === 1) {
        map.setView(boundsCoords[0], 15);
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

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#C9973E]/30 shadow-xl ${heightClass}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-2.5 right-2.5 z-10 bg-[#241714]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9973E]/30 text-[10px] text-[#F7F0E2] flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#B52A22] animate-pulse" />
        <span>Kolkata Puja Route Coordinates</span>
      </div>
    </div>
  );
}

