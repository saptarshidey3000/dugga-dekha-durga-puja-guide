'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BONEDI_BARIS } from '@/data/bonedi';
import BonediCard from '@/components/BonediCard';
import { Landmark, ArrowLeft, Search, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FAF0DC] rounded-2xl animate-pulse" />,
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
    <div className="section-cream min-h-screen py-10 sm:py-14 px-4 sm:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D99A3D]/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A2118] text-[#D99A3D] text-[10px] font-bold tracking-wider uppercase mb-2">
              <Landmark className="w-3.5 h-3.5" />
              <span>Aristocratic Lineage & Zamindari Legacy</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3A2118]">
              Bonedi Bari Heritage Guide
            </h1>
            <p className="text-xs sm:text-sm text-[#5C3A2E] mt-2 max-w-2xl leading-relaxed">
              Before the grand community Sarbojanin pandals, Kolkata’s festival lived inside ancestral courtyards. Experience authentic Thakurdalans, antique Belgian glass chandeliers, and family worship rituals spanning over three centuries.
            </p>
          </div>

          <Link
            href="/explore"
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#B93624] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch to Sarbojanin Pandals</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FAF0DC] p-5 rounded-2xl border border-[#D99A3D]/40 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#B93624]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bonedi Bari (e.g. Shobhabazar, Laha Bari, Rani Rashmoni)..."
              className="w-full bg-[#FFF8EC] border border-[#D99A3D]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#3A2118] placeholder-[#5C3A2E]/60 focus:outline-none focus:border-[#B93624]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#5C3A2E]"
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedArea === area
                    ? 'bg-[#3A2118] text-[#FFF8EC] border-[#3A2118]'
                    : 'bg-[#FFF8EC] text-[#3A2118] border-[#D99A3D]/40 hover:border-[#3A2118]'
                }`}
              >
                {area === 'all' ? 'All Heritage Enclaves' : area}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="text-xs text-[#5C3A2E]">
          Showing <strong>{filteredBonedi.length}</strong> aristocratic estates
        </div>

        {/* Grid of Bonedi Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBonedi.map((bonedi) => (
            <BonediCard key={bonedi.id} bonedi={bonedi} />
          ))}
        </div>
      </div>
    </div>
  );
}
