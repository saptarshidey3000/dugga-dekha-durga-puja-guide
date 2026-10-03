'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BONEDI_AREAS, BONEDI_BARIS } from '@/data/bonedi';
import BonediCard from '@/components/BonediCard';
import { Landmark, ArrowRight, Search, X, MapPin, Footprints, ShieldCheck } from 'lucide-react';

export default function BonediLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBonedi = searchQuery.trim()
    ? BONEDI_BARIS.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.nearestMetro.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="bg-[#F7F0E2] min-h-screen py-10 sm:py-14 px-4 sm:px-8 text-[#120E0C]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-[#C9973E]/30 pb-8 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F1D18] text-[#E1BE68] text-[11px] font-bold tracking-widest uppercase border border-[#C9973E]/40">
            <Landmark className="w-3.5 h-3.5" />
            <span>Kolkata Heritage Courtyard Guide</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#8F1D18] tracking-tight">
            BONEDI BARI GUIDE
          </h1>

          <p className="font-editorial text-xl sm:text-2xl text-[#C9973E] font-medium">
            Choose Your Heritage Area
          </p>

          <p className="text-sm sm:text-base text-[#241714]/80 max-w-2xl leading-relaxed">
            Before the grand community Sarbojanin pandals, Kolkata’s festival lived inside ancestral courtyards. Experience authentic Thakurdalans, antique Belgian glass chandeliers, and family worship rituals spanning over three centuries.
          </p>
        </div>

        {/* 6 Area Cards Grid (Section 25 & 26) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B52A22]">
              6 Heritage Enclaves
            </span>
            <span className="text-xs text-[#241714]/70">
              Total {BONEDI_BARIS.length} Historic Aristocratic Households
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BONEDI_AREAS.map((area) => {
              const housesInArea = BONEDI_BARIS.filter((b) => area.bariIds.includes(b.id));

              return (
                <div
                  key={area.id}
                  className="bg-[#EEE1C8]/60 border border-[#C9973E]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C9973E] hover:shadow-lg transition-all"
                >
                  <div className="space-y-4">
                    {/* Header: Area & Count */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F1D18] block">
                          Heritage Enclave
                        </span>
                        <h2 className="font-editorial text-2xl font-bold text-[#120E0C]">
                          {area.name}
                        </h2>
                        <span className="text-xs text-[#C9973E] font-serif block">
                          {area.bengaliName}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8F1D18] text-[#F7F0E2]">
                        {area.bariIds.length} Bonedi Baris
                      </span>
                    </div>

                    {/* Metro Hub Connection */}
                    <div className="bg-[#F7F0E2] p-3 rounded-xl border border-[#C9973E]/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#8F1D18]">
                        <MapPin className="w-3.5 h-3.5 text-[#B52A22]" />
                        <span>🚇 {area.nearestMetro}</span>
                      </div>
                      {area.metroExit && (
                        <p className="text-[11px] text-[#241714]/70 pl-5">
                          {area.metroExit}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#241714]/80 leading-relaxed">
                      {area.description}
                    </p>

                    {/* Prominent Households list */}
                    <div className="pt-2 border-t border-[#C9973E]/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-2">
                        Prominent Courtyards:
                      </span>
                      <ul className="space-y-1 text-xs text-[#241714]">
                        {housesInArea.slice(0, 4).map((house) => (
                          <li key={house.id} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9973E]" />
                            <span className="font-medium line-clamp-1">{house.name}</span>
                          </li>
                        ))}
                        {housesInArea.length > 4 && (
                          <li className="text-[11px] text-[#C9973E] font-semibold pl-3">
                            + {housesInArea.length - 4} more heritage estates
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <Link
                    href={`/bonedi/${area.id}`}
                    className="mt-6 w-full py-3 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md transition-all group"
                  >
                    <span>EXPLORE {area.name.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Search for Specific House */}
        <div className="bg-[#EEE1C8]/40 border border-[#C9973E]/30 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#8F1D18]">
                Looking for a Specific Ancestral House?
              </h3>
              <p className="text-xs text-[#241714]/70">
                Search across all 22 verified Bonedi Baris by household name, area, or nearest Metro.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#C9973E]">
              {BONEDI_BARIS.length} verified historic estates
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8F1D18]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bonedi Bari (e.g. Shobhabazar Boro Rajbari, Laha Bari, Rani Rashmoni)..."
              className="w-full bg-[#F7F0E2] border border-[#C9973E]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#120E0C] placeholder-[#241714]/50 focus:outline-none focus:border-[#8F1D18]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#241714]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="pt-2">
              <span className="text-xs font-bold text-[#8F1D18] block mb-3">
                Found {filteredBonedi.length} results:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredBonedi.map((bonedi) => (
                  <BonediCard key={bonedi.id} bonedi={bonedi} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
