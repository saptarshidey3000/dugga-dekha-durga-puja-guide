'use client';

import React from 'react';
import Link from 'next/link';
import { Route } from '@/data/types';
import { PANDALS } from '@/data/pandals';
import { ArrowRight, Compass, MapPin, Footprints, Clock, Sparkles } from 'lucide-react';

interface NextRouteExtensionProps {
  currentRoute: Route;
  nextRoute: Route;
  lastPandalName: string;
}

export default function NextRouteExtension({
  currentRoute,
  nextRoute,
  lastPandalName,
}: NextRouteExtensionProps) {
  // Extract stop pandal names for the sequence preview
  const stopPandals = nextRoute.stops
    .map((s) => {
      const p = PANDALS.find((item) => item.id === s.pandalId);
      return {
        order: s.order,
        name: p?.name || s.pandalId,
        area: p?.area || '',
      };
    })
    .slice(0, 5);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#120E0C]/95 via-[#241714]/90 to-[#120E0C]/95 border-2 border-[#C9973E]/50 p-6 sm:p-8 shadow-2xl text-[#F7F0E2] space-y-6">
      {/* Header Badge & Title */}
      <div className="space-y-2 border-b border-[#C9973E]/30 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F1D18] text-[#E1BE68] text-[10px] font-black tracking-widest uppercase border border-[#C9973E]/40 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>ROUTE COMPLETED • WHAT TO FOLLOW NEXT</span>
          </span>
          <span className="text-xs text-[#E1BE68] font-semibold">
            {nextRoute.region}
          </span>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2] tracking-tight">
          Continue Hopping: Recommended Next Route
        </h3>

        <p className="text-xs sm:text-sm text-[#F7F0E2]/80 leading-relaxed max-w-2xl">
          You finished the curated trail at <strong className="text-[#E1BE68]">{lastPandalName}</strong>. There is no ancestral Bonedi Bari courtyard within 1km of this station. Hop straight onto the next logical walking route right nearby!
        </p>
      </div>

      {/* Next Route Highlight Card */}
      <div className="bg-[#120E0C]/80 rounded-2xl border-2 border-[#C9973E]/40 p-5 sm:p-6 space-y-4 hover:border-[#E1BE68] transition-all shadow-xl group">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E1BE68] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#E1BE68]" />
              <span>NEXT CURATED TRAIL</span>
            </span>
            <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors">
              {nextRoute.name}
            </h4>
            {nextRoute.bengaliName && (
              <p className="text-sm text-[#E1BE68] font-serif font-semibold">
                {nextRoute.bengaliName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E]/40 shadow-xs">
              🛕 {nextRoute.stopsCount} Pandals
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#241714] text-[#E1BE68] border border-[#C9973E]/30">
              🚶 {nextRoute.totalWalkingDistance}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#F7F0E2]/85 leading-relaxed">
          {nextRoute.tagline || nextRoute.description}
        </p>

        {/* Metro Starting Info */}
        <div className="bg-[#241714] p-3.5 rounded-xl border border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E1BE68] shrink-0" />
            <div>
              <span className="font-bold text-[#F7F0E2] block">
                🚇 Starts at {nextRoute.metroStationName}
              </span>
              <span className="text-[11px] text-[#E1BE68]">
                {nextRoute.startingExit || 'Exit Gate 1 / 2'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#F7F0E2]/70 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#E1BE68]" />
              <span>{nextRoute.estimatedDuration}</span>
            </span>
          </div>
        </div>

        {/* Sequence Preview */}
        <div className="space-y-2 pt-2 border-t border-[#C9973E]/20">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E1BE68] block">
            Curated Route Sequence:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {stopPandals.map((stop, idx) => (
              <React.Fragment key={stop.order}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#241714] border border-[#C9973E]/30 text-xs font-semibold text-[#F7F0E2]">
                  <span className="text-[10px] font-mono font-bold text-[#E1BE68]">
                    0{stop.order}
                  </span>
                  <span>{stop.name}</span>
                </span>
                {idx < stopPandals.length - 1 && (
                  <span className="text-[#E1BE68] text-xs font-bold">→</span>
                )}
              </React.Fragment>
            ))}
            {nextRoute.stops.length > 5 && (
              <span className="text-xs text-[#E1BE68] font-bold">
                + {nextRoute.stops.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-2">
          <Link
            href={`/route/${nextRoute.id}`}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg transition-all border border-[#C9973E]/60 hover:scale-[1.01]"
          >
            <span>START NEXT ROUTE: {nextRoute.name.toUpperCase()}</span>
            <ArrowRight className="w-4 h-4 text-[#E1BE68]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
