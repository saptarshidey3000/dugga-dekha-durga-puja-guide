'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Train, MapPin } from 'lucide-react';
import { MetroStation } from '@/data/types';
import { ROUTES } from '@/data/routes';

interface MetroStationCardProps {
  metro: MetroStation;
}

export default function MetroStationCard({ metro }: MetroStationCardProps) {
  // Find associated route for this metro station
  const route = ROUTES.find((r) => r.metroStationId === metro.id);
  const pandalCount = metro.popularFor?.length || 4;

  // Curate "Best for" tags based on station characteristics
  const bestFor =
    metro.id === 'kalighat'
      ? 'Traditional + Must Visit'
      : metro.id === 'deshapriya-park'
      ? 'Mega Themes + Classical Sabeki'
      : metro.id === 'sovabazar-sutanuti'
      ? 'Kumartuli Artisans + Heritage Themes'
      : metro.id === 'shyambazar'
      ? 'Century-Old Heritage + Daaker Saaj'
      : metro.id === 'mg-road'
      ? 'Illuminated Water Palaces'
      : metro.id === 'karunamoyee'
      ? 'Wide Boulevards & Modern Art'
      : 'Curated Heritage & Themes';

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#7E1815] to-[#35120F] border border-[#D6A13A]/40 p-5 sm:p-6 shadow-xl flex flex-col justify-between hover:border-[#D6A13A] transition-all group">
      {/* Decorative Gold Corner Accent */}
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D6A13A]/50 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D6A13A]/50 rounded-bl-lg pointer-events-none" />

      <div>
        {/* Metro Icon & Line Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#35120F] border border-[#D6A13A]/40 flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
            🚇
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E7C46A] bg-[#35120F]/60 px-2.5 py-1 rounded-full border border-[#D6A13A]/30">
            {metro.line.split('(')[0].trim()}
          </span>
        </div>

        {/* Station Name (Section 80) */}
        <h3 className="font-editorial text-2xl font-extrabold text-[#F8F0DF] tracking-tight group-hover:text-[#E7C46A] transition-colors">
          {metro.name}
        </h3>
        {metro.bengaliName && (
          <p className="text-xs text-[#E7C46A]/90 font-serif mb-1">{metro.bengaliName}</p>
        )}

        <p className="text-xs text-[#F8F0DF]/70 mb-3">{metro.region}</p>

        {/* Gold Line Divider */}
        <div className="gold-divider my-3 opacity-40" />

        {/* Info Rows */}
        <div className="space-y-1.5 text-xs text-[#F8F0DF]/90 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[#E7C46A] font-semibold">Curated Stops:</span>
            <span className="font-bold text-[#F8F0DF]">{pandalCount} Pandals</span>
          </div>

          <div className="pt-1">
            <span className="text-[11px] text-[#E7C46A] font-semibold block">Best for:</span>
            <span className="text-xs font-medium text-[#F8F0DF]/95">{bestFor}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href={route ? `/routes?id=${route.id}` : `/metro/${metro.id}`}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F8F0DF] hover:bg-[#FFFFFF] text-[#7E1815] font-bold text-xs tracking-wider uppercase shadow-md transition-all group-hover:shadow-lg"
      >
        <span>VIEW ROUTE</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#B52B20] group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
