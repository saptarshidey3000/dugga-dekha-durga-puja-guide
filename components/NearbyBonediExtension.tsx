'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NearbyBonediItem } from '@/lib/proximity';
import { Landmark, Footprints, Clock, ArrowRight, Check, Plus, Navigation } from 'lucide-react';

interface NearbyBonediExtensionProps {
  nearbyBaris: NearbyBonediItem[];
  addedBariIds: string[];
  onToggleBari: (bariId: string) => void;
  onSeeOnMap?: (bariId: string) => void;
  lastPandalName: string;
}

export default function NearbyBonediExtension({
  nearbyBaris,
  addedBariIds,
  onToggleBari,
  onSeeOnMap,
  lastPandalName,
}: NearbyBonediExtensionProps) {
  if (!nearbyBaris || nearbyBaris.length === 0) return null;

  return (
    <div className="rounded-3xl bg-[#120E0C]/95 backdrop-blur-md border-2 border-[#C9973E]/50 p-6 sm:p-8 shadow-2xl space-y-6 text-[#F7F0E2]">
      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E1BE68] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-[#E1BE68] flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />
            <span>EXTEND YOUR WALK • NEARBY HERITAGE / BONEDI BARI</span>
          </span>
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
          Adjacent Historic Ancestral Courtyards
        </h2>

        <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-2xl leading-relaxed">
          When finishing near <strong className="text-[#E1BE68]">{lastPandalName}</strong>, you are literally within a 5–10 minute stroll of centuries-old Thakurdalans. Missing them just because they were on another tab is a big missed opportunity!
        </p>
      </div>

      {/* Nearby Bonedi Baris Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {nearbyBaris.map((item) => {
          const { bonedi, distanceMeters, walkingMinutes, directionInstruction } = item;
          const isAdded = addedBariIds.includes(bonedi.id);

          return (
            <div
              key={bonedi.id}
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
                      src={bonedi.image || '/bonedi-mobile.png'}
                      alt={bonedi.name}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                    {bonedi.yearEstablished && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50">
                        Est. {bonedi.yearEstablished}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
                      {bonedi.area}
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl font-extrabold text-[#F7F0E2] leading-snug truncate">
                      {bonedi.name}
                    </h3>
                    {bonedi.bengaliName && (
                      <p className="text-xs text-[#E1BE68] font-serif truncate">
                        {bonedi.bengaliName}
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

              {/* Action Buttons: Add to Route Toggle & View History */}
              <div className="pt-3 border-t border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-2">
                {/* The Primary Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleBari(bonedi.id)}
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
                      <span>Add to this route (+{walkingMinutes}m)</span>
                    </>
                  )}
                </button>

                {/* Secondary: See on Map & View History */}
                <div className="flex items-center gap-1.5">
                  {onSeeOnMap && bonedi.latitude && (
                    <button
                      type="button"
                      onClick={() => onSeeOnMap(bonedi.id)}
                      className="p-2.5 rounded-xl bg-[#120E0C] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold transition-colors"
                      title="See on Map"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <Link
                    href={`/bonedi/${bonedi.id}`}
                    className="p-2.5 rounded-xl bg-[#120E0C] hover:bg-[#35120F] text-[#F7F0E2] hover:text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold transition-colors flex items-center gap-1"
                    title="View History Details"
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
