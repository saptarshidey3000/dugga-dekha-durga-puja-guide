'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, Landmark, Compass, ArrowRight } from 'lucide-react';
import { PANDALS } from '@/data/pandals';
import { METRO_STATIONS } from '@/data/metros';
import { BONEDI_BARIS } from '@/data/bonedi';
import { Pandal, MetroStation, BonediBari } from '@/data/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  // Instant filtering
  const matchingPandals: Pandal[] = cleanQ
    ? PANDALS.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.area.toLowerCase().includes(cleanQ) ||
          p.region.toLowerCase().includes(cleanQ) ||
          (p.theme && p.theme.toLowerCase().includes(cleanQ)) ||
          p.nearestMetro.toLowerCase().includes(cleanQ)
      ).slice(0, 6)
    : [];

  const matchingMetros: MetroStation[] = cleanQ
    ? METRO_STATIONS.filter(
        (m) =>
          m.name.toLowerCase().includes(cleanQ) ||
          m.region.toLowerCase().includes(cleanQ) ||
          (m.popularFor && m.popularFor.some((pf) => pf.toLowerCase().includes(cleanQ)))
      ).slice(0, 4)
    : [];

  const matchingBonedi: BonediBari[] = cleanQ
    ? BONEDI_BARIS.filter(
        (b) =>
          b.name.toLowerCase().includes(cleanQ) ||
          b.area.toLowerCase().includes(cleanQ) ||
          b.nearestMetro.toLowerCase().includes(cleanQ)
      ).slice(0, 4)
    : [];

  const hasResults =
    matchingPandals.length > 0 || matchingMetros.length > 0 || matchingBonedi.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 px-3 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#E8DECE] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-[#1A1412]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8DECE] bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#8F1D18] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a pandal, Metro or Bonedi Bari..."
            className="w-full bg-transparent text-[#1A1412] placeholder-[#6B5E55]/60 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#6B5E55] hover:text-[#8F1D18]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#6B5E55] hover:text-[#8F1D18] px-2 py-1 rounded bg-[#FFFFFF] border border-[#E8DECE]"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {cleanQ ? (
            hasResults ? (
              <div className="space-y-6">
                {/* Pandals Results */}
                {matchingPandals.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-2 px-2">
                      PANDALS ({matchingPandals.length})
                    </span>
                    <div className="space-y-1">
                      {matchingPandals.map((pandal) => (
                        <Link
                          key={pandal.id}
                          href={`/pandal/${pandal.id}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E8DECE] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F3EBDD] flex items-center justify-center text-sm">
                              🛕
                            </div>
                            <div>
                              <h4 className="font-editorial font-bold text-sm text-[#1A1412] group-hover:text-[#8F1D18]">
                                {pandal.name}
                              </h4>
                              <p className="text-xs text-[#6B5E55]">
                                {pandal.area} • 🚇 {pandal.nearestMetro}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#8F1D18] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metro Stations Results */}
                {matchingMetros.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-2 px-2">
                      METRO STATIONS ({matchingMetros.length})
                    </span>
                    <div className="space-y-1">
                      {matchingMetros.map((metro) => (
                        <Link
                          key={metro.id}
                          href={`/metro/${metro.id}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E8DECE] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F3EBDD] flex items-center justify-center text-sm">
                              🚇
                            </div>
                            <div>
                              <h4 className="font-editorial font-bold text-sm text-[#1A1412] group-hover:text-[#8F1D18]">
                                {metro.name} Metro Station
                              </h4>
                              <p className="text-xs text-[#6B5E55]">
                                {metro.region} • {metro.line}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#8F1D18] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bonedi Bari Results */}
                {matchingBonedi.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-2 px-2">
                      BONEDI BARI HERITAGE ({matchingBonedi.length})
                    </span>
                    <div className="space-y-1">
                      {matchingBonedi.map((bonedi) => (
                        <Link
                          key={bonedi.id}
                          href={`/bonedi/${bonedi.id}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E8DECE] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F3EBDD] flex items-center justify-center text-sm">
                              🏛️
                            </div>
                            <div>
                              <h4 className="font-editorial font-bold text-sm text-[#1A1412] group-hover:text-[#8F1D18]">
                                {bonedi.name}
                              </h4>
                              <p className="text-xs text-[#6B5E55]">
                                {bonedi.area} • 🚇 {bonedi.nearestMetro}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#8F1D18] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="font-bold text-sm text-[#1A1412]">No results for &quot;{query}&quot;</p>
                <p className="text-xs text-[#6B5E55] mt-1">
                  Try searching &quot;Kalighat&quot;, &quot;Kumartuli&quot;, or &quot;Shobhabazar&quot;
                </p>
              </div>
            )
          ) : (
            /* Quick Suggestions */
            <div className="space-y-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block">
                Quick Suggestions:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Kalighat', 'Deshapriya Park', 'Shobhabazar', 'Kumartuli', 'Maddox Square', 'Laha Bari'].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setQuery(hint)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#E8DECE] hover:border-[#8F1D18] hover:text-[#8F1D18] transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
