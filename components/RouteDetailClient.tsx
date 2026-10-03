'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Route, Pandal, MetroStation } from '@/data/types';
import RouteTimeline from '@/components/RouteTimeline';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-[#0B223D] flex items-center justify-center text-[#D99A3D] text-sm animate-pulse rounded-2xl border border-[#D99A3D]/20">
      Loading Route Map...
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/routes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D99A3D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Walking Routes</span>
        </Link>

        {/* Mobile quick map toggle */}
        <button
          onClick={() => setMobileMapOpen(!mobileMapOpen)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B223D] border border-[#D99A3D]/40 text-xs font-bold text-[#D99A3D]"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{mobileMapOpen ? 'Hide Map' : 'See on Map'}</span>
        </button>
      </div>

      {/* Mobile Map Drawer / Preview */}
      {mobileMapOpen && (
        <div className="lg:hidden bg-[#0B223D] border border-[#D99A3D]/30 p-4 rounded-2xl shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between mb-3 text-xs text-[#D99A3D] font-bold uppercase">
            <span>Route Map: {route.name}</span>
            <button onClick={() => setMobileMapOpen(false)} className="text-[#D8CEBE]">
              Close ×
            </button>
          </div>
          <InteractiveMap
            pandals={pandals}
            metroStation={metroStation}
            activeRoute={route}
            selectedPandalId={selectedPandalId}
            onSelectPandal={(id) => setSelectedPandalId(id)}
            heightClass="h-[360px]"
          />
        </div>
      )}

      {/* DESKTOP SPLIT LAYOUT (Section 41 & 42) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Route Timeline with Start Tour & Next Stop (7 cols) */}
        <div className="lg:col-span-7">
          <RouteTimeline
            route={route}
            onSeeOnMap={(pandalId) => {
              setSelectedPandalId(pandalId);
              setMobileMapOpen(true);
            }}
          />
        </div>

        {/* Right: Sticky Interactive Map (5 cols) */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <div className="bg-[#0B223D] border border-[#D99A3D]/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-[#D99A3D] uppercase tracking-wider">
                Live Route Navigation
              </span>
              <span className="text-[#D8CEBE]">{route.stops.length} Pandals</span>
            </div>

            <InteractiveMap
              pandals={pandals}
              metroStation={metroStation}
              activeRoute={route}
              selectedPandalId={selectedPandalId}
              onSelectPandal={(id) => setSelectedPandalId(id)}
              heightClass="h-[520px]"
            />

            <div className="mt-4 pt-3 border-t border-[#D99A3D]/15 space-y-2 text-xs text-[#D8CEBE]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FFF8EC]">Starting Point:</span>
                <span className="text-[#D99A3D]">{route.metroStationName}</span>
              </div>
              {route.startingExit && (
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FFF8EC]">Exit Gate:</span>
                  <span className="text-[#B93624] font-semibold">{route.startingExit}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FFF8EC]">Total Distance:</span>
                <span>{route.totalWalkingDistance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
