'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PANDALS } from '@/data/pandals';
import { BONEDI_BARIS } from '@/data/bonedi';
import { CATEGORIES } from '@/data/categories';
import { Region, PandalCategory } from '@/data/types';
import PandalCard from '@/components/PandalCard';
import { Search, X, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-[#120E0C]/90 rounded-3xl animate-pulse border border-[#C9973E]/40 flex items-center justify-center text-xs text-[#E1BE68]" />
  ),
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get('region') || 'all';

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [includeBonedi, setIncludeBonedi] = useState(false);
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(null);

  const regions = [
    'all',
    'South Kolkata',
    'North Kolkata',
    'Dum Dum',
    'Salt Lake + New Town',
    'Central Kolkata',
  ];

  const filteredPandals = useMemo(() => {
    return PANDALS.filter((p) => {
      const matchRegion =
        selectedRegion === 'all' ||
        p.region === selectedRegion ||
        (selectedRegion === 'Dum Dum' && (p.region as string) === 'Dum Dum Area') ||
        (selectedRegion === 'Salt Lake + New Town' && (p.region as string) === 'East / West Metro');

      const matchCategory =
        selectedCategory === 'all' || p.category.includes(selectedCategory as PandalCategory);

      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nearestMetro.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.theme && p.theme.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchRegion && matchCategory && matchSearch;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-transparent text-[#F7F0E2] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#C9973E]/40">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#E1BE68]">
            Kolkata Pandal Directory
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F7F0E2] mt-1">
            Explore All Pandals
          </h1>
          <p className="text-xs sm:text-sm text-[#F7F0E2]/80 mt-1 max-w-xl leading-relaxed">
            Verified Kolkata Durga Puja pandals with exact Metro stations, exit gates, and walking times across all 5 regions.
          </p>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#120E0C]/90 border border-[#C9973E]/50 text-xs font-bold text-[#E1BE68] hover:bg-[#8F1D18] hover:text-[#F7F0E2] transition-colors shadow-md"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{showMap ? 'Hide Spatial Map' : 'View on Spatial Map'}</span>
        </button>
      </div>

      {/* Interactive Map Drawer (if toggled) */}
      {showMap && (
        <div className="bg-[#120E0C]/95 border-2 border-[#C9973E]/40 p-4 rounded-3xl shadow-2xl animate-fadeIn space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#E1BE68] font-bold uppercase">
            <span>
              Showing {filteredPandals.length} Pandals{includeBonedi ? ` + ${BONEDI_BARIS.length} Bonedi Baris` : ''} on OpenStreetMap
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIncludeBonedi(!includeBonedi)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  includeBonedi
                    ? 'bg-[#8F1D18] text-[#F7F0E2] border-[#E1BE68]'
                    : 'bg-[#241714] text-[#E1BE68] border-[#C9973E]/40 hover:bg-[#35120F]'
                }`}
              >
                🏛️ {includeBonedi ? 'Hide Bonedi Baris' : `Show Bonedi Baris (${BONEDI_BARIS.length})`}
              </button>
              <button
                onClick={() => setShowMap(false)}
                className="text-[#F7F0E2]/70 hover:text-[#F7F0E2] font-bold px-2 py-0.5 rounded bg-[#241714] border border-[#C9973E]/40"
              >
                Close Map ✕
              </button>
            </div>
          </div>
          <InteractiveMap
            pandals={filteredPandals}
            bonediBaris={includeBonedi ? BONEDI_BARIS : []}
            selectedPandalId={selectedPandalId}
            onSelectPandal={(id) => setSelectedPandalId(id)}
            heightClass="h-[440px]"
          />
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-[#120E0C]/90 backdrop-blur-md p-5 rounded-3xl border-2 border-[#C9973E]/40 shadow-xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#E1BE68]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pandal name, area, Metro hub, or theme..."
            className="w-full bg-[#241714] border border-[#C9973E]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F7F0E2] placeholder-[#F7F0E2]/50 focus:outline-none focus:border-[#E1BE68]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[#F7F0E2]/60 hover:text-[#F7F0E2]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E1BE68] block">
            Filter by Kolkata Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedRegion === region
                    ? 'bg-[#8F1D18] text-[#E1BE68] border-[#E1BE68] shadow-md'
                    : 'bg-[#241714]/80 text-[#F7F0E2]/80 border-[#C9973E]/30 hover:border-[#E1BE68]'
                }`}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5 pt-2 border-t border-[#C9973E]/30">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E1BE68] block">
            Filter by Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#8F1D18] text-[#E1BE68] border-[#E1BE68] shadow-md'
                  : 'bg-[#241714]/80 text-[#F7F0E2]/80 border-[#C9973E]/30 hover:border-[#E1BE68]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#8F1D18] text-[#E1BE68] border-[#E1BE68] shadow-md'
                    : 'bg-[#241714]/80 text-[#F7F0E2]/80 border-[#C9973E]/30 hover:border-[#E1BE68]'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#E1BE68] font-bold">
        <span>
          Showing <strong className="text-[#F7F0E2]">{filteredPandals.length}</strong> of{' '}
          {PANDALS.length} pandals
        </span>
        {(selectedRegion !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#E1BE68] hover:text-[#F7F0E2] underline font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Pandals Grid (Text & Location focused, NO image as requested) */}
      {filteredPandals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPandals.map((pandal, idx) => (
            <PandalCard
              key={pandal.id}
              pandal={pandal}
              orderNumber={idx + 1}
              onSeeOnMap={(id) => {
                setSelectedPandalId(id);
                setShowMap(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#120E0C]/90 border-2 border-[#C9973E]/40 rounded-3xl p-12 text-center max-w-md mx-auto shadow-xl">
          <p className="text-base font-bold text-[#F7F0E2]">No Pandals Match Your Filter</p>
          <p className="text-xs text-[#F7F0E2]/70 mt-1 mb-4">
            Try choosing another region, clearing the search query, or selecting &quot;All Categories&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-full bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold hover:bg-[#B52A22] border border-[#C9973E]/50"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#E1BE68] font-bold">Loading Pandals...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
