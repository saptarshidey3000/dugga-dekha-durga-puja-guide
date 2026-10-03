'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { PANDALS } from '@/data/pandals';
import { CATEGORIES } from '@/data/categories';
import { Region, PandalCategory } from '@/data/types';
import PandalCard from '@/components/PandalCard';
import { Compass, Filter, Search, X, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FFFFFF] rounded-2xl animate-pulse border border-[#D6A13A]/30" />,
});

export default function ExplorePage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(null);

  const regions = ['all', 'South Kolkata', 'North Kolkata', 'Central Kolkata', 'East / West Metro'];

  const filteredPandals = useMemo(() => {
    return PANDALS.filter((p) => {
      const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-[#F8F0DF] text-[#171311]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D6A13A]/30">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
            Kolkata Pandal Directory
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815] mt-1">
            Explore All Pandals
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-xl">
            Verified Kolkata Durga Puja pandals with exact Metro stations, exit gates, walking times, and crowd levels.
          </p>
        </div>

        {/* View Toggle (List vs Map) */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFFFF] hover:bg-[#F8F0DF] text-[#7E1815] border border-[#D6A13A]/60 text-xs font-bold transition-all shadow-sm"
        >
          <MapPin className="w-4 h-4 text-[#B52B20]" />
          <span>{showMap ? 'Hide City Map' : 'Show Map Overview'}</span>
        </button>
      </div>

      {/* Map Preview (Expandable) */}
      {showMap && (
        <div className="bg-[#FFFFFF] border border-[#D6A13A]/40 p-4 rounded-2xl animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between mb-3 text-xs text-[#7E1815] font-bold uppercase">
            <span>Kolkata Puja Spatial Distribution ({filteredPandals.length} Pandals)</span>
            <button
              onClick={() => setShowMap(false)}
              className="text-[#5A4E46] hover:text-[#B52B20]"
            >
              Close Map ×
            </button>
          </div>
          <InteractiveMap
            pandals={filteredPandals}
            selectedPandalId={selectedPandalId}
            heightClass="h-[360px] sm:h-[440px]"
          />
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="space-y-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#D6A13A]/30 shadow-sm">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#7E1815]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by pandal name, area, or nearest Metro..."
            className="w-full bg-[#F8F0DF] border border-[#D6A13A]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#171311] placeholder-[#5A4E46]/60 focus:outline-none focus:border-[#7E1815]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[#5A4E46] hover:text-[#7E1815]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Filter Buttons */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7E1815] mb-2">
            Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-sm'
                    : 'bg-[#F8F0DF] text-[#5A4E46] border-[#D6A13A]/35 hover:border-[#D6A13A]'
                }`}
              >
                {reg === 'all' ? 'All Regions' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Buttons (Section 83) */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7E1815] mb-2">
            Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedCategory === 'all'
                  ? 'chip-category-selected'
                  : 'chip-category'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedCategory === cat.id
                    ? 'chip-category-selected'
                    : 'chip-category'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-[#5A4E46]">
        <span>
          Showing <strong className="text-[#7E1815] font-bold">{filteredPandals.length}</strong> of{' '}
          {PANDALS.length} pandals
        </span>
        {(selectedRegion !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-[#B52B20] font-bold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Pandals (Section 77 & 78) */}
      {filteredPandals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPandals.map((pandal) => (
            <PandalCard
              key={pandal.id}
              pandal={pandal}
              onSeeOnMap={(id) => {
                setSelectedPandalId(id);
                setShowMap(true);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <Compass className="w-10 h-10 text-[#D6A13A] mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-[#7E1815] mb-1">
            No Pandals Match Your Filter
          </h3>
          <p className="text-xs text-[#5A4E46] mb-4">
            Try adjusting your region or category preferences to discover more pujas.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-full bg-[#7E1815] text-[#F8F0DF] text-xs font-bold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
