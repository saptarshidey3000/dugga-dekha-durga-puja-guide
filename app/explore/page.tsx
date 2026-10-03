'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PANDALS } from '@/data/pandals';
import { CATEGORIES } from '@/data/categories';
import { Region, PandalCategory } from '@/data/types';
import PandalCard from '@/components/PandalCard';
import { Compass, Filter, Search, X, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#FFFFFF] rounded-2xl animate-pulse border border-[#E8DECE]" />,
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialRegion = searchParams.get('region') || 'all';

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF8F5] text-[#1A1412] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8DECE]">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F1D18]">
            Kolkata Pandal Directory
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#1A1412] mt-1">
            Explore All Pandals
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1 max-w-xl">
            Verified Kolkata Durga Puja pandals with exact Metro stations, exit gates, and walking times.
          </p>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E8DECE] text-xs font-bold text-[#8F1D18] hover:bg-[#F3EBDD] transition-colors shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5 text-[#8F1D18]" />
          <span>{showMap ? 'Hide Spatial Map' : 'View on Spatial Map'}</span>
        </button>
      </div>

      {/* Interactive Map Drawer (if toggled) */}
      {showMap && (
        <div className="bg-[#FFFFFF] border border-[#E8DECE] p-4 rounded-3xl shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between mb-3 text-xs text-[#8F1D18] font-bold uppercase">
            <span>Showing {filteredPandals.length} Pandals on Kolkata Map</span>
            <button
              onClick={() => setShowMap(false)}
              className="text-[#6B5E55] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8DECE]"
            >
              Close Map ✕
            </button>
          </div>
          <InteractiveMap
            pandals={filteredPandals}
            selectedPandalId={selectedPandalId}
            onSelectPandal={(id) => setSelectedPandalId(id)}
            heightClass="h-[420px]"
          />
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DECE] shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8F1D18]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pandal name, area, Metro hub, or theme..."
            className="w-full bg-[#FAF8F5] border border-[#E8DECE] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A1412] placeholder-[#6B5E55]/60 focus:outline-none focus:border-[#8F1D18]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-[#6B5E55]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block">
            Filter by Kolkata Region:
          </span>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedRegion === region
                    ? 'bg-[#8F1D18] text-[#FAF8F5] border-[#8F1D18]'
                    : 'bg-[#FAF8F5] text-[#1A1412] border-[#E8DECE] hover:border-[#8F1D18]/50'
                }`}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5 pt-2 border-t border-[#E8DECE]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block">
            Filter by Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#8F1D18] text-[#FAF8F5] border-[#8F1D18]'
                  : 'bg-[#FAF8F5] text-[#1A1412] border-[#E8DECE] hover:border-[#8F1D18]/50'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#8F1D18] text-[#FAF8F5] border-[#8F1D18]'
                    : 'bg-[#FAF8F5] text-[#1A1412] border-[#E8DECE] hover:border-[#8F1D18]/50'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#6B5E55]">
        <span>
          Showing <strong className="text-[#8F1D18] font-bold">{filteredPandals.length}</strong> of{' '}
          {PANDALS.length} pandals
        </span>
        {(selectedRegion !== 'all' || selectedCategory !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-[#8F1D18] font-bold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Pandals Grid */}
      {filteredPandals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPandals.map((pandal) => (
            <PandalCard
              key={pandal.id}
              pandal={pandal}
              onSeeOnMap={(id) => {
                setSelectedPandalId(id);
                setShowMap(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E8DECE] rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
          <p className="text-base font-bold text-[#1A1412]">No Pandals Match Your Filter</p>
          <p className="text-xs text-[#6B5E55] mt-1 mb-4">
            Try choosing another region, clearing the search query, or selecting &quot;All Categories&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#8F1D18] text-[#FAF8F5] text-xs font-bold hover:bg-[#B52A22]"
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#8F1D18]">Loading Pandals...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
