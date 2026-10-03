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

  // Associated pandal names
  const pandalNames = route
    ? route.stops
        .map((s) => PANDALS.find((p) => p.id === s.pandalId)?.name)
        .filter(Boolean) as string[]
    : metro.popularFor || [];

  const count = pandalNames.length || 4;
  const targetHref = route ? `/route/${route.id}` : `/metro/${metro.id}`;

  return (
    <div className="relative rounded-2xl bg-[#FFFFFF] border border-[#E8DECE] hover:border-[#8F1D18] p-5 sm:p-6 shadow-xs hover:shadow-lg flex flex-col justify-between transition-all group">
      <div>
        {/* Metro Icon & Region Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3EBDD] border border-[#C9973E]/40 flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
            🚇
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F1D18] bg-[#F3EBDD] px-3 py-1 rounded-full border border-[#C9973E]/30">
            {count} PANDALS
          </span>
        </div>

        {/* Station Name (Section 11 & 12) */}
        <h3 className="font-editorial text-2xl font-extrabold text-[#1A1412] group-hover:text-[#8F1D18] transition-colors">
          {metro.name}
        </h3>
        {metro.bengaliName && (
          <p className="text-xs text-[#8F1D18] font-serif mb-1">{metro.bengaliName}</p>
        )}

        <p className="text-xs text-[#6B5E55] mb-3">{metro.region}</p>

        {/* Pandal List (Section 11) */}
        {pandalNames.length > 0 && (
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DECE] my-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-1">
              Curated Route Stops:
            </span>
            <ul className="text-xs text-[#1A1412] space-y-0.5">
              {pandalNames.slice(0, 4).map((name, idx) => (
                <li key={idx} className="truncate flex items-center gap-1.5">
                  <span className="text-[10px] text-[#C9973E] font-bold">0{idx + 1}</span>
                  <span>{name}</span>
                </li>
              ))}
              {pandalNames.length > 4 && (
                <li className="text-[10px] text-[#8F1D18] font-semibold pt-0.5">
                  +{pandalNames.length - 4} more pandals...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* CTA Button: START PANDAL HOPPING (Section 11, 12, 13) */}
      <Link
        href={targetHref}
        className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#FAF8F5] font-bold text-xs tracking-wider uppercase shadow-sm transition-all group-hover:shadow-md"
      >
        <span>START PANDAL HOPPING</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68] group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
