'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pandal } from '@/data/types';
import { PANDALS } from '@/data/pandals';
import { getSavedPandals } from '@/lib/storage';
import PandalCard from '@/components/PandalCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

export default function SavedPandalsPage() {
  const [savedPandalsList, setSavedPandalsList] = useState<Pandal[]>([]);

  const loadData = () => {
    const savedPandalItems = getSavedPandals();
    const resolved = savedPandalItems
      .map((item) => PANDALS.find((p) => p.id === item.id))
      .filter(Boolean) as Pandal[];
    setSavedPandalsList(resolved);
  };

  useEffect(() => {
    loadData();
    const onPandalsUpdated = () => loadData();
    window.addEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    return () => {
      window.removeEventListener('dugga-saved-pandals-updated', onPandalsUpdated);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-transparent text-[#120E0C] min-h-screen">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#E8DECE]">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8F1D18]">
          Offline Bookmarks
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#1A1412] mt-1">
          Saved Pandals
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E55] mt-1 max-w-xl">
          Pandals you have bookmarked are stored right on your device for immediate offline reference while hopping.
        </p>
      </div>

      {/* Pandals Grid */}
      {savedPandalsList.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs text-[#6B5E55] font-semibold">
            Showing <strong className="text-[#8F1D18]">{savedPandalsList.length}</strong> saved pandals
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPandalsList.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E8DECE] rounded-2xl p-12 text-center max-w-md mx-auto shadow-xs">
          <Bookmark className="w-10 h-10 text-[#C9973E] mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-[#1A1412]">
            No Pandals Saved Yet
          </h3>
          <p className="text-xs text-[#6B5E55] mt-2 mb-6">
            Tap the bookmark icon on any pandal card to save it here for fast walking access.
          </p>
          <Link
            href="/metro"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Compass className="w-4 h-4 text-[#E1BE68]" />
            <span>Explore Metro Guide</span>
          </Link>
        </div>
      )}
    </div>
  );
}
