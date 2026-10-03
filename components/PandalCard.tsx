'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, MapPin, ArrowRight, Navigation, ExternalLink } from 'lucide-react';
import { Pandal } from '@/data/types';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';

interface PandalCardProps {
  pandal: Pandal;
  orderNumber?: number;
  onSeeOnMap?: (pandalId: string) => void;
}

export default function PandalCard({ pandal, orderNumber, onSeeOnMap }: PandalCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPandalSaved(pandal.id));
  }, [pandal.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeSavedPandal(pandal.id);
      setSaved(false);
    } else {
      savePandal(pandal.id);
      setSaved(true);
    }
  };

  const crowdBadgeStyles: Record<string, { bg: string; dot: string; text: string }> = {
    Low: { bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300', dot: 'bg-emerald-400', text: '● LOW' },
    Moderate: { bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300', dot: 'bg-amber-400', text: '● MODERATE' },
    Busy: { bg: 'bg-orange-950/80 border-orange-500/50 text-orange-300', dot: 'bg-orange-400', text: '● BUSY' },
    'Very Crowded': { bg: 'bg-red-950/80 border-red-500/50 text-red-300', dot: 'bg-red-400', text: '● VERY CROWDED' },
  };

  const crowdInfo = pandal.crowdLevel ? crowdBadgeStyles[pandal.crowdLevel] : null;

  const walkingDisplay = pandal.walkingTime
    ? pandal.walkingDistance
      ? `🚶 ${pandal.walkingTime.replace('~', '')} • ~${pandal.walkingDistance}`
      : `🚶 ${pandal.walkingTime}`
    : null;

  const orderFormatted =
    orderNumber !== undefined
      ? orderNumber < 10
        ? `0${orderNumber}`
        : `${orderNumber}`
      : null;

  return (
    <div className="group relative rounded-3xl bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 hover:border-[#E1BE68] p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Top Header: Order Number, Area, Save Button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {orderFormatted && (
              <span className="w-8 h-8 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E] font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                {orderFormatted}
              </span>
            )}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1BE68] block">
                {pandal.area} · {pandal.region}
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-extrabold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors leading-snug">
                {pandal.name}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleSave}
            aria-label={saved ? 'Remove from saved' : 'Save pandal'}
            className={`p-2 rounded-full border transition-all shrink-0 ${
              saved
                ? 'bg-[#8F1D18] text-[#E1BE68] border-[#C9973E]'
                : 'bg-[#241714]/80 text-[#F7F0E2]/70 border-[#C9973E]/40 hover:text-[#E1BE68]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bengali Name if available */}
        {pandal.bengaliName && (
          <p className="text-xs text-[#E1BE68] font-serif mb-2">{pandal.bengaliName}</p>
        )}

        {/* Short Description (Section 22) */}
        {pandal.description && (
          <p className="text-xs text-[#F7F0E2]/80 leading-relaxed mb-4 line-clamp-3">
            {pandal.description}
          </p>
        )}

        {/* Metro & Walking Information */}
        <div className="bg-[#241714]/80 px-3.5 py-2.5 rounded-2xl border border-[#C9973E]/30 mb-4 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-[#E1BE68]">
            <MapPin className="w-3.5 h-3.5 text-[#E1BE68]" />
            <span>🚇 {pandal.nearestMetro}</span>
          </span>
          {walkingDisplay && (
            <span className="text-[#F7F0E2]/70 font-semibold text-[11px]">
              {walkingDisplay}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: [ SEE ON MAP ] & [ DETAILS ] (Section 10 & 22) */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#C9973E]/30">
        {pandal.latitude && pandal.longitude && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#241714] hover:bg-[#8F1D18] text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/40 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>SEE ON MAP →</span>
          </a>
        )}

        <Link
          href={`/pandal/${pandal.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all border border-[#C9973E]/50"
        >
          <span>DETAILS</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
        </Link>
      </div>
    </div>
  );
}
