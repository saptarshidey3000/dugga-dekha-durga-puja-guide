'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Footprints } from 'lucide-react';
import { Route } from '@/data/types';
import { PANDALS } from '@/data/pandals';

interface CircuitCardProps {
  route: Route;
  onSelect?: () => void;
  selected?: boolean;
}

export default function CircuitCard({ route, onSelect, selected }: CircuitCardProps) {
  // Grab preview image from the first pandal in the circuit
  const firstPandal = PANDALS.find((p) => p.id === route.stops[0]?.pandalId);
  const bgImage = firstPandal?.images[0] || '/pujo-mobile.png';

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 card-poster flex flex-col justify-between p-6 min-h-[300px] sm:min-h-[340px] ${
        selected ? 'ring-2 ring-[#D6A13A] shadow-2xl scale-[1.01]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Background Artwork / Image with Dark Red Poster Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={bgImage}
          alt={route.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#35120F] via-[#7E1815]/90 to-[#35120F]/80" />
        {/* Subtle Ornamental Gold Border Line */}
        <div className="absolute inset-2 border border-[#D6A13A]/25 rounded-xl pointer-events-none" />
      </div>

      {/* Content Header (Section 76) */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E7C46A] border-b border-[#D6A13A]/50 pb-0.5">
            {route.region}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#35120F]/80 text-[#E7C46A] border border-[#D6A13A]/40 shadow-sm">
            {route.stopsCount} PANDALS
          </span>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F8F0DF] tracking-tight group-hover:text-[#E7C46A] transition-colors mt-2">
          {route.name}
        </h3>

        {route.bengaliName && (
          <p className="text-xs text-[#E7C46A]/90 font-serif mt-0.5 mb-2">
            {route.bengaliName}
          </p>
        )}

        <p className="text-xs text-[#F8F0DF]/85 line-clamp-2 mt-2 leading-relaxed">
          {route.tagline || route.description}
        </p>
      </div>

      {/* Specs & Call to Action */}
      <div className="relative z-10 pt-4 mt-4 border-t border-[#D6A13A]/25">
        <div className="flex items-center justify-between text-xs text-[#F8F0DF]/90 mb-4">
          <span className="flex items-center gap-1.5 font-semibold text-[#E7C46A]">
            <span>🚇 {route.metroStationName}</span>
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Footprints className="w-3.5 h-3.5 text-[#E7C46A]" />
            <span>~{route.totalWalkingDistance} WALKING</span>
          </span>
        </div>

        <Link
          href={`/routes?id=${route.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#F8F0DF] hover:bg-[#FFFFFF] text-[#7E1815] font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#35120F]/40 transition-all group-hover:shadow-[#D6A13A]/20"
        >
          <span>EXPLORE CIRCUIT</span>
          <ArrowRight className="w-4 h-4 text-[#B52B20] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
