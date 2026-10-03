'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { ROUTES } from '@/data/routes';
import { Region } from '@/data/types';
import MetroStationCard from '@/components/MetroStationCard';
import { MapPin, ArrowRight, Footprints, Train } from 'lucide-react';

export default function MetroDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions: Region[] = [
    'South Kolkata',
    'North Kolkata',
    'Central Kolkata',
    'East / West Metro',
  ];

  const filteredStations =
    selectedRegion === 'all'
      ? METRO_STATIONS
      : METRO_STATIONS.filter((m) => m.region === selectedRegion);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-[#F8F0DF] text-[#171311]">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#D6A13A]/30">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
          Transit Navigation
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815] mt-1">
          Kolkata Metro Puja Hubs
        </h1>
        <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-2xl leading-relaxed">
          The secret to effortless Puja hopping is choosing the right Metro station and taking the designated exit gate. Select your station to view verified walking routes and direct pandals.
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
          All Metro Lines ({METRO_STATIONS.length})
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

      {/* Metro Stations Grid (Section 80 Metro Station Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map((station) => (
          <MetroStationCard key={station.id} metro={station} />
        ))}
      </div>
    </div>
  );
}
