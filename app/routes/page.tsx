'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/data/routes';
import { Region } from '@/data/types';
import { Clock, Footprints, ArrowRight, MapPin, Compass } from 'lucide-react';

export default function RoutesDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions: Region[] = [
    'South Kolkata',
    'North Kolkata',
    'Central Kolkata',
    'East / West Metro',
  ];

  const filteredRoutes =
    selectedRegion === 'all' ? ROUTES : ROUTES.filter((r) => r.region === selectedRegion);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D99A3D]/20">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
          Curated Walking Sequences
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
          Kolkata Puja Walking Routes
        </h1>
        <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2 max-w-2xl leading-relaxed">
          &quot;Don&apos;t just find pandals. Know where to go next.&quot; Every route starts at a verified Metro exit gate and leads you through pandals in optimal physical walking order.
        </p>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRegion('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            selectedRegion === 'all'
              ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
              : 'bg-[#0B223D] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
          }`}
        >
          All Routes ({ROUTES.length})
        </button>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              selectedRegion === reg
                ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
                : 'bg-[#0B223D] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            className="bg-[#0B223D] border border-[#D99A3D]/25 hover:border-[#D99A3D] rounded-2xl p-6 shadow-lg flex flex-col justify-between transition-all group hover:shadow-2xl"
          >
            <div>
              {/* Region and Time Specs */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B93624] text-[#FFF8EC] px-2.5 py-0.5 rounded-full">
                  {route.region}
                </span>
                <span className="text-xs text-[#D99A3D] font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{route.estimatedDuration}</span>
                </span>
              </div>

              <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors">
                {route.name}
              </h3>
              {route.bengaliName && (
                <p className="text-xs text-[#D8CEBE]/80 font-serif mb-2">{route.bengaliName}</p>
              )}

              <p className="text-xs text-[#D8CEBE]/90 line-clamp-3 mb-4 leading-relaxed">
                {route.description}
              </p>

              {/* Metro & Distance Details */}
              <div className="bg-[#071A2F]/80 p-3 rounded-xl border border-[#D99A3D]/15 space-y-1.5 text-xs text-[#D8CEBE] mb-4">
                <div className="flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5 text-[#FFF8EC]">
                    <MapPin className="w-3.5 h-3.5 text-[#D99A3D]" />
                    <span>{route.metroStationName}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#D99A3D]">
                    <Footprints className="w-3.5 h-3.5" />
                    <span>{route.totalWalkingDistance}</span>
                  </span>
                </div>
                {route.startingExit && (
                  <p className="text-[11px] text-[#D8CEBE]/70 pl-5">
                    Start at: <strong className="text-[#FFF8EC]">{route.startingExit}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-[#D99A3D]/15 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#FFF8EC]">
                {route.stopsCount} stops in sequence
              </span>
              <Link
                href={`/route/${route.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#B93624] hover:bg-[#cf412e] text-[#FFF8EC] text-xs font-bold shadow-md transition-colors"
              >
                <span>Follow Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
