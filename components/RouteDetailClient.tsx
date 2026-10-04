'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Route, Pandal, MetroStation } from '@/data/types';
import RouteTimeline from '@/components/RouteTimeline';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { RouteMapStop } from '@/components/CuratedRouteMap';
import { getNearbyBonediForRoute } from '@/lib/proximity';

const CuratedRouteMap = dynamic(() => import('@/components/CuratedRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#120E0C]/90 flex items-center justify-center text-[#E1BE68] text-sm animate-pulse rounded-3xl border-2 border-[#C9973E]/40">
      Loading OpenStreetMap Walking Route...
    </div>
  ),
});

interface RouteDetailClientProps {
  route: Route;
  pandals: Pandal[];
  metroStation?: MetroStation;
}

export default function RouteDetailClient({
  route,
  pandals,
  metroStation,
}: RouteDetailClientProps) {
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [addedBariIds, setAddedBariIds] = useState<string[]>([]);

  const nearbyBaris = getNearbyBonediForRoute(route);

  const handleToggleBari = (bariId: string) => {
    setAddedBariIds((prev) =>
      prev.includes(bariId) ? prev.filter((id) => id !== bariId) : [...prev, bariId]
    );
  };

  const addedBarisList = nearbyBaris.filter((item) => addedBariIds.includes(item.bonedi.id));

  // Base stops + added Bonedi Bari stops plotted on map
  const baseMapStops: RouteMapStop[] = route.stops.map((s) => {
    const p = pandals.find((pandal) => pandal.id === s.pandalId);
    return {
      order: s.order,
      name: p?.name || 'Pandal Stop',
      lat: p?.latitude || 0,
      lng: p?.longitude || 0,
      area: p?.area,
      walkingTime: s.walkingTime,
      pandalId: s.pandalId,
    };
  });

  const mapStops: RouteMapStop[] = [
    ...baseMapStops,
    ...addedBarisList.map((item, idx) => ({
      order: baseMapStops.length + idx + 1,
      name: `🏛️ ${item.bonedi.name}`,
      lat: item.bonedi.latitude || 0,
      lng: item.bonedi.longitude || 0,
      area: `${item.bonedi.area} (Bonedi Bari)`,
      walkingTime: `~${item.walkingMinutes} min`,
      pandalId: item.bonedi.id,
    })),
  ];

  const activeOrder = selectedPandalId
    ? mapStops.find((s) => s.pandalId === selectedPandalId)?.order || null
    : null;

  const extraMinutes = addedBarisList.reduce((acc, curr) => acc + curr.walkingMinutes, 0);
  const displayDuration = extraMinutes > 0
    ? `${route.estimatedDuration} (+${extraMinutes}m heritage)`
    : route.estimatedDuration;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 bg-transparent text-[#F7F0E2]">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#C9973E]/30">
        <Link
          href={`/metro?region=${encodeURIComponent(route.region)}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#120E0C]/90 hover:bg-[#8F1D18] text-xs font-bold text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/50 shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to {route.region} Metro Hubs</span>
        </Link>

        {/* Mobile quick map toggle */}
        <button
          onClick={() => setMobileMapOpen(!mobileMapOpen)}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#C9973E]/50 text-xs font-bold shadow-md"
        >
          <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
          <span>{mobileMapOpen ? 'Hide Map' : 'See on Map'}</span>
        </button>
      </div>

      {/* Mobile Map Drawer / Preview */}
      {mobileMapOpen && (
        <div className="lg:hidden animate-fadeIn space-y-2">
          <div className="flex items-center justify-between px-2 text-xs text-[#E1BE68] font-bold uppercase">
            <span>Route Map: {route.name}</span>
            <button
              onClick={() => setMobileMapOpen(false)}
              className="text-[#F7F0E2]/70 hover:text-[#F7F0E2] font-extrabold px-2 py-0.5 rounded bg-[#120E0C]"
            >
              Close ×
            </button>
          </div>
          <CuratedRouteMap
            regionName={route.region}
            distance={route.totalWalkingDistance}
            walkingTime={displayDuration}
            stops={mapStops}
            activeStopOrder={activeOrder}
            onSelectStop={(_, id) => id && setSelectedPandalId(id)}
            heightClass="h-[360px]"
          />
        </div>
      )}

      {/* DESKTOP SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Route Timeline with Start Tour & Next Stop (7 cols) */}
        <div className="lg:col-span-7">
          <RouteTimeline
            route={route}
            onSeeOnMap={(pandalId) => {
              setSelectedPandalId(pandalId);
              setMobileMapOpen(true);
            }}
            nearbyBaris={nearbyBaris}
            addedBariIds={addedBariIds}
            onToggleBari={handleToggleBari}
          />
        </div>

        {/* Right: Sticky CuratedRouteMap (5 cols) */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <CuratedRouteMap
            regionName={route.region}
            distance={route.totalWalkingDistance}
            walkingTime={displayDuration}
            stops={mapStops}
            activeStopOrder={activeOrder}
            onSelectStop={(_, id) => id && setSelectedPandalId(id)}
            heightClass="h-[460px]"
          />

          <div className="rounded-2xl bg-[#120E0C]/90 backdrop-blur-md border border-[#C9973E]/40 p-4 space-y-2 text-xs text-[#F7F0E2]/90 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E1BE68]">Starting Point:</span>
              <span className="font-semibold text-[#F7F0E2]">{route.metroStationName}</span>
            </div>
            {route.startingExit && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#E1BE68]">Exit Gate:</span>
                <span className="font-semibold text-[#F7F0E2]">{route.startingExit}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E1BE68]">Curated Trail:</span>
              <span className="font-semibold text-[#F7F0E2]">
                {route.totalWalkingDistance} · {mapStops.length} Stops {addedBariIds.length > 0 && `(${addedBariIds.length} Extended)`}
              </span>
            </div>
            {addedBariIds.length > 0 && (
              <div className="pt-2 border-t border-[#C9973E]/30 flex items-center justify-between text-[#E1BE68]">
                <span className="font-bold">Heritage Extension:</span>
                <span className="font-semibold">+{extraMinutes} min walk</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
