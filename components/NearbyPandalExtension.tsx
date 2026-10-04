'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NearbyPandalItem } from '@/lib/proximity';
import { Sparkles, Footprints, ArrowRight, Check, Plus, Navigation } from 'lucide-react';

interface NearbyPandalExtensionProps {
  nearbyPandals: NearbyPandalItem[];
  addedPandalIds?: string[];
  onTogglePandal?: (pandalId: string) => void;
  onSeeOnMap?: (pandalId: string) => void;
  fromBonediName: string;
}

export default function NearbyPandalExtension({
  nearbyPandals,
  addedPandalIds = [],
  onTogglePandal,
  onSeeOnMap,
  fromBonediName,
}: NearbyPandalExtensionProps) {
  if (!nearbyPandals || nearbyPandals.length === 0) return null;

  return (
    <div className="rounded-3xl bg-[#120E0C]/95 backdrop-blur-md border-2 border-[#C9973E]/50 p-6 sm:p-8 shadow-2xl space-y-6 text-[#F7F0E2]">
      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E1BE68] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-[#E1BE68] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXTEND YOUR WALK • NEARBY SARBOJANIN PANDALS</span>
          </span>
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
          Iconic Community Themes Within Walking Distance
        </h2>

        <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-2xl leading-relaxed">
          Done exploring the ancestral Thakurdalans around <strong className="text-[#E1BE68]">{fromBonediName}</strong>? Continue your pujo hopping trail with these legendary Sarbojanin theme pandals right around the corner!
        </p>
      </div>

      {/* Nearby Pandals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {nearbyPandals.map((item) => {
          const { pandal, distanceMeters, walkingMinutes, directionInstruction, routeId, routeName } = item;
          const isAdded = addedPandalIds.includes(pandal.id);

          return (
            <div
              key={pandal.id}
              className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between space-y-4 ${
                isAdded
                  ? 'bg-[#8F1D18]/20 border-[#E1BE68] shadow-xl ring-2 ring-[#C9973E]/40'
                  : 'bg-[#241714]/90 border-[#C9973E]/40 hover:border-[#E1BE68]'
              }`}
            >
              <div className="space-y-3">
                {/* Image & Header */}
                <div className="flex gap-4 items-start">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-[#120E0C] border border-[#C9973E]/30">
                    <Image
                      src={pandal.images?.[0] || '/pujo-mobile.png'}
                      alt={pandal.name}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                    {pandal.category?.[0] && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50">
                        {pandal.category[0]}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
                      {pandal.area} • Metro: {pandal.nearestMetro}
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl font-extrabold text-[#F7F0E2] leading-snug truncate">
                      {pandal.name}
                    </h3>
                    {pandal.bengaliName && (
                      <p className="text-xs text-[#E1BE68] font-serif truncate">
                        {pandal.bengaliName}
                      </p>
                    )}

                    {/* Proximity Pill */}
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#120E0C] border border-[#C9973E]/50 text-[11px] font-bold text-[#E1BE68]">
                      <Footprints className="w-3 h-3" />
                      <span>~{walkingMinutes} min walk ({distanceMeters}m)</span>
                    </div>
                  </div>
                </div>

                {/* Walking Instruction */}
                <div className="bg-[#120E0C]/90 p-3 rounded-xl border border-[#C9973E]/30 text-xs text-[#F7F0E2]/85 leading-relaxed">
                  <span className="font-extrabold text-[#E1BE68]">Connection: </span>
                  <span>{directionInstruction}</span>
                </div>
              </div>

              {/* Action Buttons: Add Toggle & Route Jump */}
              <div className="pt-3 border-t border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-2">
                {onTogglePandal && (
                  <button
                    type="button"
                    onClick={() => onTogglePandal(pandal.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isAdded
                        ? 'bg-[#E1BE68] text-[#8F1D18] border border-[#E1BE68] shadow-amber-900/40'
                        : 'bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#C9973E]/60'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Route (+{walkingMinutes}m)</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Route (+{walkingMinutes}m)</span>
                      </>
                    )}
                  </button>
                )}

                {/* Jump to Curated Route or Pandal Details */}
                <div className="flex items-center gap-1.5">
                  {routeId && (
                    <Link
                      href={`/route/${routeId}`}
                      className="px-3 py-2 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold transition-colors border border-[#C9973E]/40 flex items-center gap-1"
                      title={routeName ? `Hop on ${routeName}` : 'Open Metro Route'}
                    >
                      <span className="text-[11px] font-black uppercase">Hop Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {/* Direct Google Maps Navigation */}
                  <a
                    href={pandal.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(pandal.name + ' Kolkata')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#120E0C] hover:bg-[#8F1D18] text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/40 text-xs font-bold transition-colors"
                    title="See on Map (Google Maps)"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/pandal/${pandal.id}`}
                    className="p-2.5 rounded-xl bg-[#120E0C] hover:bg-[#35120F] text-[#F7F0E2] hover:text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold transition-colors flex items-center gap-1"
                    title="View Pandal Details"
                  >
                    <span className="text-[11px] hidden sm:inline">Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
