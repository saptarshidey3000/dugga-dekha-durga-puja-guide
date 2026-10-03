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
  loading: () => <div className="h-[300px] bg-[#0B223D] rounded-2xl animate-pulse" />,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D99A3D]/20">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
            Kolkata Pandal Directory
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
            Explore All Pandals
          </h1>
          <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2 max-w-xl">
            Verified Kolkata Durga Puja pandals with exact Metro stations, exit gates, walking times, and crowd levels.
          </p>
        </div>

        {/* View Toggle (List vs Map) */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B223D] hover:bg-[#0F2A4A] text-[#D99A3D] hover:text-[#FFF8EC] border border-[#D99A3D]/40 text-xs font-bold transition-all shadow-md"
        >
          <MapPin className="w-4 h-4 text-[#B93624]" />
          <span>{showMap ? 'Hide City Map' : 'Show Map Overview'}</span>
        </button>
      </div>

      {/* Map Preview (Expandable) */}
      {showMap && (
        <div className="bg-[#0B223D] border border-[#D99A3D]/30 p-4 rounded-2xl animate-fadeIn shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs text-[#D99A3D] font-bold uppercase">
            <span>Kolkata Puja Spatial Distribution ({filteredPandals.length} Pandals)</span>
            <button
              onClick={() => setShowMap(false)}
              className="text-[#D8CEBE] hover:text-[#FFF8EC]"
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
      <div className="space-y-4 bg-[#0B223D]/80 p-5 rounded-2xl border border-[#D99A3D]/20 shadow-md">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#D99A3D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, area, or Metro station..."
            className="w-full bg-[#071A2F] border border-[#D99A3D]/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#FFF8EC] placeholder-[#D8CEBE]/50 focus:outline-none focus:border-[#D99A3D]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[#D8CEBE] hover:text-[#FFF8EC]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Filter Buttons */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D99A3D] mb-2">
            Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-sm'
                    : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
                }`}
              >
                {reg === 'all' ? 'All Regions' : reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D99A3D] mb-2">
            Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#D99A3D] text-[#071A2F] border-[#D99A3D] font-bold'
                  : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#D99A3D] text-[#071A2F] border-[#D99A3D] font-bold'
                    : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
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
      <div className="flex items-center justify-between text-xs text-[#D8CEBE]">
        <span>
          Showing <strong className="text-[#FFF8EC]">{filteredPandals.length}</strong> of{' '}
          {PANDALS.length} pandals
        </span>
        {(selectedRegion !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-[#D99A3D] hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Pandals */}
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
        <div className="bg-[#0B223D] border border-[#D99A3D]/25 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Compass className="w-10 h-10 text-[#D99A3D]/50 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-[#FFF8EC] mb-1">
            No Pandals Match Your Filter
          </h3>
          <p className="text-xs text-[#D8CEBE]/80 mb-4">
            Try adjusting your region or category preferences to discover more pujas.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-[#B93624] text-[#FFF8EC] text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
