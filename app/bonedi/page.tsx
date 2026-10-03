'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BONEDI_BARIS } from '@/data/bonedi';
import BonediCard from '@/components/BonediCard';
import { Landmark, ArrowLeft, Search, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FFFFFF] rounded-2xl animate-pulse border border-[#D6A13A]/30" />,
});

export default function BonediDirectoryPage() {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const areas = [
    'all',
    'Shovabazar',
    'Girish Park',
    'College Street / Thanthania',
    'Central',
    'Bhowanipore',
    'Behala',
  ];

  const filteredBonedi = BONEDI_BARIS.filter((b) => {
    const matchArea = selectedArea === 'all' || b.area.includes(selectedArea) || b.nearestMetro.includes(selectedArea);
    const matchSearch =
      !searchQuery.trim() ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nearestMetro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchSearch;
  });

  return (
    <div className="bg-[#F8F0DF] min-h-screen py-10 sm:py-14 px-4 sm:px-8 text-[#171311]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6A13A]/30">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7E1815] text-[#E7C46A] text-[10px] font-bold tracking-wider uppercase mb-2 border border-[#D6A13A]/40">
              <Landmark className="w-3.5 h-3.5" />
              <span>Aristocratic Lineage & Zamindari Legacy</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815]">
              Bonedi Bari Heritage Guide
            </h1>
            <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-2xl leading-relaxed">
              Before the grand community Sarbojanin pandals, Kolkata’s festival lived inside ancestral courtyards. Experience authentic Thakurdalans, antique Belgian glass chandeliers, and family worship rituals spanning over three centuries.
            </p>
          </div>

          <Link
            href="/explore"
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#B52B20] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Sarbojanin Pandals</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#D6A13A]/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#7E1815]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bonedi Bari (e.g. Shobhabazar, Laha Bari, Rani Rashmoni)..."
              className="w-full bg-[#F8F0DF] border border-[#D6A13A]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#171311] placeholder-[#5A4E46]/60 focus:outline-none focus:border-[#7E1815]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#5A4E46]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedArea === area
                    ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-sm'
                    : 'bg-[#F8F0DF] text-[#5A4E46] border-[#D6A13A]/30 hover:border-[#7E1815]'
                }`}
              >
                {area === 'all' ? 'All Heritage Enclaves' : area}
              </button>
            ))}
          </div>
        </div>

        {/* Count Header */}
        <div className="flex items-center justify-between text-xs text-[#5A4E46]">
          <span>
            Showing <strong className="text-[#7E1815] font-bold">{filteredBonedi.length}</strong> of{' '}
            {BONEDI_BARIS.length} historic aristocratic households
          </span>
        </div>

        {/* Grid of Bonedi Baris (Section 93) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBonedi.map((bonedi) => (
            <BonediCard key={bonedi.id} bonedi={bonedi} />
          ))}
        </div>
      </div>
    </div>
  );
}
