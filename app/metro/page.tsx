'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { METRO_STATIONS } from '@/data/metros';
import { ROUTES } from '@/data/routes';
import { Region } from '@/data/types';
import MetroStationCard from '@/components/MetroStationCard';
import { MapPin, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';

const REGION_CONFIGS: { id: Region; label: string; count: number; metroHub: string; description: string }[] = [
  {
    id: 'South Kolkata',
    label: 'SOUTH KOLKATA',
    count: 23,
    metroHub: 'Kalighat · Deshapriya Park · Netaji Bhavan · Jatin Das Park · Rabindra Sarobar · Mahanayak Uttam Kumar · Gitanjali',
    description: 'Premier mega pandals, artistic experimental themes, and classical lighting corridors along Rashbehari Avenue.',
  },
  {
    id: 'North Kolkata',
    label: 'NORTH KOLKATA',
    count: 12,
    metroHub: 'Sovabazar Sutanuti · Girish Park · Belgachia · Shyambazar',
    description: 'Traditional heritage, clay artisans of Kumartuli, Bagbazar Sarbojanin, and historic narrow Rajbari lanes.',
  },
  {
    id: 'Dum Dum',
    label: 'DUM DUM',
    count: 5,
    metroHub: 'Dum Dum Park',
    description: 'A compact, walkable cluster centered inside Dum Dum Park where five renowned, award-winning theme pujas are situated within easy strolls of each other around the numbered local tanks.',
  },
  {
    id: 'Salt Lake + New Town',
    label: 'SALT LAKE + NEW TOWN',
    count: 4,
    metroHub: 'Salt Lake · Karunamoyee · City Centre',
    description: 'Spacious modern suburban themes, landmark architecture, and easy access via the Green Line Metro.',
  },
  {
    id: 'Central Kolkata',
    label: 'CENTRAL KOLKATA',
    count: 7,
    metroHub: 'MG Road · Central · Sealdah',
    description: 'Collegiate heritage around College Square water reservoir, Mohammad Ali Park, and Santosh Mitra Square.',
  },
];

function MetroGuideContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get('region');

  // Verify if valid region
  const matchedRegion = REGION_CONFIGS.find(
    (r) =>
      r.id.toLowerCase() === regionParam?.toLowerCase() ||
      r.label.toLowerCase() === regionParam?.toLowerCase() ||
      (regionParam?.toLowerCase() === 'dum dum area' && r.id === 'Dum Dum') ||
      (regionParam?.toLowerCase() === 'dumdum area' && r.id === 'Dum Dum') ||
      (regionParam?.toLowerCase() === 'dumdum' && r.id === 'Dum Dum') ||
      (regionParam?.toLowerCase() === 'dum dum' && r.id === 'Dum Dum') ||
      (regionParam?.toLowerCase() === 'east / west metro' && r.id === 'Salt Lake + New Town')
  );

  // If a region is specified, display the DEDICATED REGION VIEW (Sections 3, 4, 5, 6)
  if (matchedRegion) {
    const selectedRegion = matchedRegion.id;
    const stationsInRegion = METRO_STATIONS.filter(
      (m) =>
        m.region === selectedRegion ||
        (selectedRegion === 'Dum Dum' && (m.region as string) === 'Dum Dum Area') ||
        (selectedRegion === 'Dum Dum Area' && (m.region as string) === 'Dum Dum') ||
        (selectedRegion === 'Salt Lake + New Town' && (m.region as string) === 'East / West Metro')
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 bg-transparent text-[#F7F0E2]">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#C9973E]/30">
          <Link
            href="/metro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#120E0C]/90 hover:bg-[#8F1D18] text-xs font-bold text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/50 shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← BACK TO ALL REGIONS</span>
          </Link>

          {/* Quick Region Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {REGION_CONFIGS.map((r) => (
              <Link
                key={r.id}
                href={`/metro?region=${encodeURIComponent(r.id)}`}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                  r.id === selectedRegion
                    ? 'bg-[#8F1D18] text-[#E1BE68] border border-[#E1BE68] shadow-md'
                    : 'bg-[#120E0C]/80 text-[#F7F0E2]/80 border border-[#C9973E]/30 hover:border-[#E1BE68]'
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Dedicated Region Page Header */}
        <div className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E1BE68] animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E1BE68]">
              METRO GUIDE
            </span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F7F0E2] tracking-tight">
            {matchedRegion.label}
          </h1>

          <p className="font-editorial text-xl sm:text-2xl text-[#E1BE68] font-bold">
            Choose a Metro hub to start your route.
          </p>

          <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-2xl leading-relaxed">
            &quot;Explore pandals through Kolkata&apos;s Metro network. Pick a station, step out the right exit gate, and follow an ordered walking trail.&quot;
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-[#E1BE68]">
            <span className="bg-[#241714] px-3.5 py-1.5 rounded-full border border-[#C9973E]/40">
              🚇 {stationsInRegion.length} Metro Hub{stationsInRegion.length > 1 ? 's' : ''} Available
            </span>
            <span className="bg-[#241714] px-3.5 py-1.5 rounded-full border border-[#C9973E]/40">
              🛕 {matchedRegion.count} Curated Pandals
            </span>
          </div>
        </div>

        {/* Metro Hubs Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-red-500">
              Available Metro Hubs in {selectedRegion}:
            </h2>
            <span className="text-xs text-[#F7F0E2]/70">
              Select a station to open the walking route
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stationsInRegion.map((metro) => (
              <MetroStationCard key={metro.id} metro={metro} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: CHOOSE REGION (5 Regions)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10 bg-transparent text-[#F7F0E2]">
      {/* Screen Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto pb-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#E1BE68] inline-block px-3.5 py-1 rounded-full bg-[#120E0C]/90 border border-[#C9973E]/50 mb-3 shadow-md">
          Primary Transit Experience
        </span>
        <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#F7F0E2] tracking-tight drop-shadow-md">
          METRO GUIDE
        </h1>
        <p className="font-editorial text-xl sm:text-2xl text-[#E1BE68] mt-2 font-bold">
          Choose Your Kolkata Region
        </p>
        <p className="text-xs sm:text-sm text-[#F7F0E2]/85 mt-2 max-w-xl mx-auto leading-relaxed">
          &quot;Organized around primary Metro arteries for effortless travel across North, South, Central, Salt Lake + New Town, and Dum Dum.&quot;
        </p>
      </div>

      {/* 5 Region Cards — Entire card is clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {REGION_CONFIGS.map((reg) => (
          <Link
            key={reg.id}
            href={`/metro?region=${encodeURIComponent(reg.id)}`}
            className="group rounded-3xl p-6 sm:p-7 bg-[#120E0C]/90 backdrop-blur-md hover:bg-[#120E0C] border-2 border-[#C9973E]/40 hover:border-[#E1BE68] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              {/* Pandal Count & Map Pin */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black px-3.5 py-1 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/60 shadow-sm">
                  {reg.count} PANDALS
                </span>
                <div className="w-8 h-8 rounded-full bg-[#241714] border border-[#C9973E]/40 flex items-center justify-center text-[#E1BE68] group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-[#E1BE68]" />
                </div>
              </div>

              {/* Region Heading */}
              <h3 className="font-editorial text-2xl font-bold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors mb-2">
                {reg.label}
              </h3>

              {/* Metro Hub Summary */}
              <p className="text-xs text-[#E1BE68] font-bold mb-3">
                {reg.metroHub}
              </p>

              <p className="text-xs text-[#F7F0E2]/80 leading-relaxed mb-6">
                {reg.description}
              </p>
            </div>

            {/* Action Button: EXPLORE REGION → */}
            <div className="pt-4 border-t border-[#C9973E]/30 flex items-center justify-between text-xs font-bold text-[#E1BE68] group-hover:text-[#F7F0E2]">
              <span className="tracking-wider uppercase">EXPLORE REGION</span>
              <div className="w-7 h-7 rounded-full bg-[#8F1D18] text-[#F7F0E2] flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs">
                <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Helpful Transit Advice Note */}
      <div className="bg-[#120E0C]/90 backdrop-blur-md rounded-2xl p-5 border border-[#C9973E]/40 text-center max-w-xl mx-auto shadow-lg">
        <p className="text-xs text-[#F7F0E2]/85">
          🚇 <strong className="text-[#E1BE68]">Pro-Tip for Puja 2026:</strong> Kolkata Metro runs special late-night Puja services during Saptami, Ashtami, and Nabami across Blue Line and Green Line corridors.
        </p>
      </div>
    </div>
  );
}

export default function MetroGuidePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#E1BE68] font-bold">Loading Metro Guide...</div>}>
      <MetroGuideContent />
    </Suspense>
  );
}
