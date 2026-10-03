'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { Region } from '@/data/types';
import MetroStationCard from '@/components/MetroStationCard';
import { MapPin, ArrowRight, Train, ChevronRight } from 'lucide-react';

function MetroGuideContent() {
  const searchParams = useSearchParams();
  const initialRegion = (searchParams.get('region') as Region) || 'South Kolkata';
  const [selectedRegion, setSelectedRegion] = useState<Region>(initialRegion);

  useEffect(() => {
    const r = searchParams.get('region') as Region;
    if (r) setSelectedRegion(r);
  }, [searchParams]);

  const regionConfigs: { id: Region; label: string; count: number; metroHub: string }[] = [
    {
      id: 'South Kolkata',
      label: 'SOUTH KOLKATA',
      count: 18,
      metroHub: 'Kalighat · Deshapriya',
    },
    {
      id: 'North Kolkata',
      label: 'NORTH KOLKATA',
      count: 18,
      metroHub: 'Sovabazar · Shyambazar',
    },
    {
      id: 'Central Kolkata',
      label: 'CENTRAL KOLKATA',
      count: 7,
      metroHub: 'MG Road · Central',
    },
    {
      id: 'East / West Metro',
      label: 'EAST / WEST METRO',
      count: 4,
      metroHub: 'Salt Lake · Karunamoyee',
    },
  ];

  const stationsInRegion = METRO_STATIONS.filter((m) => m.region === selectedRegion);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 bg-[#F7F0E2] text-[#120E0C]">
      {/* Screen Title & Subtitle (Section 09) */}
      <div className="text-center max-w-2xl mx-auto pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8F1D18]">
          Primary Transit Experience
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-extrabold text-[#8F1D18] mt-1">
          METRO GUIDE
        </h1>
        <p className="font-editorial text-xl text-[#120E0C] mt-2 font-bold">
          Choose Your Kolkata Region
        </p>
        <p className="text-xs sm:text-sm text-[#5A4E46] mt-1 max-w-xl mx-auto leading-relaxed">
          &quot;Organized around primary Metro arteries for effortless travel across North, South, Central, and Salt Lake.&quot;
        </p>
      </div>

      {/* 4 Region Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regionConfigs.map((reg) => {
          const isSelected = selectedRegion === reg.id;
          return (
            <div
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#8F1D18] text-[#F7F0E2] border-[#C9973E] shadow-xl scale-[1.02]'
                  : 'bg-[#FFFFFF] text-[#120E0C] border-[#C9973E]/30 hover:border-[#8F1D18] shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#241714] text-[#E1BE68] border border-[#C9973E]/40'
                        : 'bg-[#F7F0E2] text-[#8F1D18]'
                    }`}
                  >
                    {reg.count} Pandals
                  </span>
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#E1BE68]' : 'text-[#8F1D18]'}`} />
                </div>

                <h3
                  className={`font-editorial text-xl font-bold tracking-tight mb-2 ${
                    isSelected ? 'text-[#F7F0E2]' : 'text-[#120E0C]'
                  }`}
                >
                  {reg.label}
                </h3>

                <p className={`text-xs mb-4 ${isSelected ? 'text-[#F7F0E2]/85' : 'text-[#5A4E46]'}`}>
                  Metro Hubs: <strong className={isSelected ? 'text-[#E1BE68]' : 'text-[#120E0C]'}>{reg.metroHub}</strong>
                </p>
              </div>

              <div
                className={`flex items-center justify-between pt-3 border-t text-xs font-bold ${
                  isSelected
                    ? 'border-[#C9973E]/30 text-[#E1BE68]'
                    : 'border-[#C9973E]/20 text-[#8F1D18]'
                }`}
              >
                <span>{isSelected ? 'Viewing Hubs' : 'VIEW REGIONAL PANDALS'}</span>
                <ChevronRight className={`w-4 h-4 ${isSelected ? 'rotate-90 text-[#E1BE68]' : ''} transition-transform`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Metro Hubs (Section 11) */}
      <div className="space-y-6 pt-4 border-t border-[#C9973E]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8F1D18]" />
            <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#7E1815]">
              {selectedRegion.toUpperCase()}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5A4E46] italic">
            &quot;Explore pandals through the Metro stations that connect them.&quot;
          </p>
        </div>

        {/* Metro Stations Grid (Section 11 & 12) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stationsInRegion.map((metro) => (
            <MetroStationCard key={metro.id} metro={metro} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MetroGuidePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8F1D18]">Loading Metro Guide...</div>}>
      <MetroGuideContent />
    </Suspense>
  );
}
