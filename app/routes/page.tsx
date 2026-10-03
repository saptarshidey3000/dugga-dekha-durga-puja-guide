'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/data/routes';
import { Region } from '@/data/types';
import CircuitCard from '@/components/CircuitCard';
import { Clock, Footprints, ArrowRight, MapPin, Compass } from 'lucide-react';

function RoutesContent() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get('region') || 'all';
  const highlightedId = searchParams.get('id');

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);

  const regions: Region[] = [
    'South Kolkata',
    'North Kolkata',
    'Central Kolkata',
    'Salt Lake + New Town',
    'Dum Dum',
  ];

  const filteredRoutes =
    selectedRegion === 'all' ? ROUTES : ROUTES.filter((r) => r.region === selectedRegion);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-[#F8F0DF] text-[#171311]">
      {/* Header */}
      <div className="pb-6 border-b border-[#D6A13A]/30">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
          Curated Walking Sequences
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815] mt-1">
          Puja Circuits & Walking Routes
        </h1>
        <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-2xl leading-relaxed">
          &quot;Don&apos;t just find pandals. Know where to go next.&quot; Every circuit starts at a verified Metro exit gate and leads you through pandals in optimal physical walking order with zero backtracking.
        </p>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRegion('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            selectedRegion === 'all'
              ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-md'
              : 'bg-[#FFFFFF] text-[#5A4E46] border-[#D6A13A]/40 hover:border-[#D6A13A]'
          }`}
        >
          All Circuits ({ROUTES.length})
        </button>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              selectedRegion === reg
                ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-md'
                : 'bg-[#FFFFFF] text-[#5A4E46] border-[#D6A13A]/40 hover:border-[#D6A13A]'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Circuit Cards Grid (Section 76 Poster style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="relative">
            <CircuitCard route={route} selected={highlightedId === route.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoutesDirectoryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7E1815]">Loading Puja Circuits...</div>}>
      <RoutesContent />
    </Suspense>
  );
}
