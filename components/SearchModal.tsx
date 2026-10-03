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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 px-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] border-2 border-[#D6A13A]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-[#171311]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D6A13A]/30 bg-[#F8F0DF]">
          <Search className="w-5 h-5 text-[#7E1815] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a pandal, Metro or Bonedi Bari..."
            className="w-full bg-transparent text-[#171311] placeholder-[#5A4E46]/60 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#5A4E46] hover:text-[#7E1815]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs bg-[#7E1815] text-[#F8F0DF] hover:bg-[#B52B20] transition-colors font-bold"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 bg-[#FFFFFF]">
          {!cleanQ && (
            <div className="py-6 text-center">
              <p className="text-xs uppercase tracking-widest text-[#B52B20] font-bold mb-3">
                Quick Suggestions
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {['Kalighat', 'Kumartuli', 'Ekdalia Evergreen', 'Shovabazar Rajbari', 'Maddox Square', 'Tala Pratay', 'Santosh Mitra Square'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full text-xs bg-[#F8F0DF] text-[#7E1815] border border-[#D6A13A]/40 hover:border-[#7E1815] hover:bg-[#EFE2C7] transition-all font-semibold"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {cleanQ && !hasResults && (
            <div className="py-12 text-center">
              <Compass className="w-10 h-10 text-[#D6A13A] mx-auto mb-3" />
              <h3 className="font-editorial text-lg text-[#7E1815] font-bold mb-1">
                No verified Puja results found
              </h3>
              <p className="text-xs text-[#5A4E46] max-w-sm mx-auto">
                We couldn&apos;t find matching records for &quot;{query}&quot;. Try searching by major Metro station like Kalighat, Sovabazar, or landmark pandals.
              </p>
            </div>
          )}

          {/* Group 1: Pandals */}
          {matchingPandals.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7E1815]">
                  Pandals ({matchingPandals.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {matchingPandals.map((pandal) => (
                  <Link
                    key={pandal.id}
                    href={`/pandal/${pandal.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F0DF] border border-[#D6A13A]/25 hover:border-[#7E1815] hover:bg-[#EFE2C7] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7E1815] text-[#F8F0DF] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Compass className="w-4 h-4 text-[#E7C46A]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors">
                          {pandal.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#5A4E46] mt-0.5">
                          <span>{pandal.area}</span>
                          <span>•</span>
                          <span className="text-[#7E1815] font-semibold">🚇 {pandal.nearestMetro}</span>
                          {pandal.walkingTime && (
                            <>
                              <span>•</span>
                              <span>🚶 {pandal.walkingTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7E1815] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group 2: Metro Stations */}
          {matchingMetros.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7E1815]">
                  Metro Stations ({matchingMetros.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {matchingMetros.map((metro) => (
                  <Link
                    key={metro.id}
                    href={`/metro/${metro.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F0DF] border border-[#D6A13A]/25 hover:border-[#7E1815] hover:bg-[#EFE2C7] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7E1815] border border-[#D6A13A]/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <MapPin className="w-4 h-4 text-[#E7C46A]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors">
                          {metro.name} Metro Hub
                        </h4>
                        <p className="text-[11px] text-[#5A4E46] mt-0.5">
                          {metro.region} • {metro.line} • {metro.exits.length} Exits
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7E1815] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Group 3: Bonedi Bari */}
          {matchingBonedi.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#7E1815]">
                  Bonedi Bari Heritage ({matchingBonedi.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {matchingBonedi.map((bonedi) => (
                  <Link
                    key={bonedi.id}
                    href={`/bonedi/${bonedi.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F0DF] border border-[#D6A13A]/25 hover:border-[#7E1815] hover:bg-[#EFE2C7] transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7E1815] text-[#F8F0DF] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Landmark className="w-4 h-4 text-[#E7C46A]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors">
                          {bonedi.name}
                        </h4>
                        <p className="text-[11px] text-[#5A4E46] mt-0.5">
                          {bonedi.area} • Metro: {bonedi.nearestMetro}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7E1815] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
