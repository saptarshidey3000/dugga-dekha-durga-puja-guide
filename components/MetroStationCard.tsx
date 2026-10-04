'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MetroStation } from '@/data/types';
import { ROUTES } from '@/data/routes';
import { PANDALS } from '@/data/pandals';

interface MetroStationCardProps {
  metro: MetroStation;
}

export default function MetroStationCard({ metro }: MetroStationCardProps) {
  // Find associated route for this metro station
  const route = ROUTES.find((r) => r.metroStationId === metro.id);

  // Associated pandal names from curated route or popularFor
  const pandalNames = route
    ? route.stops
        .map((s) => PANDALS.find((p) => p.id === s.pandalId)?.name)
        .filter(Boolean) as string[]
    : metro.popularFor || [];

  const count = pandalNames.length || (metro.popularFor ? metro.popularFor.length : 4);
  const targetHref = route ? `/route/${route.id}` : `/metro/${metro.id}`;

  return (
    <Link
      href={targetHref}
      className="relative rounded-3xl bg-[#120E0C]/90 backdrop-blur-md hover:bg-[#120E0C] border-2 border-[#C9973E]/40 hover:border-[#E1BE68] p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 cursor-pointer block text-left"
    >
      <div>
        {/* Top Header: Metro Icon & Pandal Count */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-11 h-11 rounded-2xl bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E] flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
            🚇
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-[#E1BE68] bg-[#241714] px-3.5 py-1 rounded-full border border-[#C9973E]/40 shadow-xs">
            {count} PANDALS
          </span>
        </div>

        {/* Station Name */}
        <h3 className="font-editorial text-2xl font-extrabold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors leading-tight">
          {metro.name.toUpperCase()}
        </h3>
        {metro.bengaliName && (
          <p className="text-xs text-[#E1BE68] font-serif mb-1">{metro.bengaliName}</p>
        )}

        <p className="text-xs font-bold text-[#E1BE68]/80 mb-3">{metro.region}</p>

        {/* Curated Route Preview */}
        {pandalNames.length > 0 && (
          <div className="bg-[#241714]/80 p-3.5 rounded-2xl border border-[#C9973E]/30 my-3 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
              Curated Route Sequence:
            </span>
            <ul className="text-xs text-[#F7F0E2]/90 space-y-1">
              {pandalNames.slice(0, 5).map((name, idx) => (
                <li key={idx} className="truncate flex items-center gap-1.5">
                  <span className="text-[10px] text-[#E1BE68] font-black">0{idx + 1}</span>
                  <span className="font-medium">{name}</span>
                </li>
              ))}
              {pandalNames.length > 5 && (
                <li className="text-[10px] text-[#E1BE68] font-bold pt-0.5">
                  +{pandalNames.length - 5} more pandals...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Primary CTA Visual Indicator: START PANDAL HOPPING → */}
      <div
        className="w-full mt-4 py-3.5 px-5 rounded-2xl bg-[#8F1D18] group-hover:bg-[#B52A22] text-[#F7F0E2] font-black text-xs tracking-wider uppercase shadow-lg group-hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01] border border-[#C9973E]/50"
      >
        <span>START PANDAL HOPPING</span>
        <ArrowRight className="w-4 h-4 text-[#E1BE68] group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
