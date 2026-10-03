'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Pandal } from '@/data/types';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';

interface PandalCardProps {
  pandal: Pandal;
  orderNumber?: number;
  onSeeOnMap?: (pandalId: string) => void;
}

export default function PandalCard({ pandal, orderNumber, onSeeOnMap }: PandalCardProps) {
  const [saved, setSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState(pandal.images[0] || '/pujo-mobile.png');

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

  // Crowd badges specification: only show where verified data exists
  const crowdBadgeStyles: Record<string, { bg: string; dot: string; text: string }> = {
    Low: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-600', text: '● LOW' },
    Moderate: { bg: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-600', text: '● MODERATE' },
    Busy: { bg: 'bg-orange-50 border-orange-200 text-orange-800', dot: 'bg-orange-600', text: '● BUSY' },
    'Very Crowded': { bg: 'bg-red-50 border-red-200 text-red-800', dot: 'bg-red-600', text: '● VERY CROWDED' },
  };

  const crowdInfo = pandal.crowdLevel ? crowdBadgeStyles[pandal.crowdLevel] : null;

  // Format walking information cleanly: 🚶 6 min • ~450 m or ~6 min
  const walkingDisplay = pandal.walkingTime
    ? pandal.walkingDistance
      ? `🚶 ${pandal.walkingTime.replace('~', '')} • ~${pandal.walkingDistance}`
      : `🚶 ${pandal.walkingTime}`
    : 'Walking info coming soon';

  return (
    <div className="group relative bg-[#FFFFFF] border border-[#D6A13A]/30 hover:border-[#D6A13A] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Visual Image - Dominates on mobile (~16:10 ratio) */}
      <div className="relative aspect-[16/10] w-full bg-[#EFE2C7] overflow-hidden">
        <Image
          src={imgSrc}
          alt={pandal.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc('/pujo-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Order badge if in route */}
        {orderNumber !== undefined && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#7E1815] text-[#F8F0DF] font-bold text-xs flex items-center justify-center border-2 border-[#D6A13A] shadow-md">
            {orderNumber < 10 ? `0${orderNumber}` : orderNumber}
          </div>
        )}

        {/* Save Pandal Button */}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save pandal'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
            saved
              ? 'bg-[#B52B20] text-[#F8F0DF] border-[#D6A13A] shadow-md'
              : 'bg-[#35120F]/70 text-[#F8F0DF] border-[#D6A13A]/40 hover:text-[#E7C46A]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Verified Crowd Badge (Section 82) */}
        {crowdInfo && (
          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm shadow-sm ${crowdInfo.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${crowdInfo.dot}`} />
              <span>{pandal.crowdLevel}</span>
            </span>
          </div>
        )}

        {/* Category Pill (Section 83) */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {pandal.category.slice(0, 1).map((cat) => {
            const label =
              cat === 'must-visit'
                ? '🔥 MUST VISIT'
                : cat === 'best-theme'
                ? '🎨 BEST THEME'
                : cat === 'traditional'
                ? '🛕 TRADITIONAL'
                : '🏛️ HERITAGE';
            return (
              <span
                key={cat}
                className="chip-category shadow-sm"
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Editorial Content Section - Concise, Scannable (Section 77) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors line-clamp-1">
              {pandal.name}
            </h3>
            {pandal.yearEstablished && (
              <span className="text-[11px] text-[#7E1815] shrink-0 font-semibold">
                Est. {pandal.yearEstablished}
              </span>
            )}
          </div>

          <p className="text-xs text-[#5A4E46] mb-3 font-medium">
            {pandal.area}, {pandal.region}
          </p>

          {/* Metro & Walking Information (Section 81) */}
          <div className="flex items-center justify-between text-xs text-[#171311] bg-[#F8F0DF] px-3 py-2 rounded-xl border border-[#D6A13A]/25 mb-4">
            <span className="flex items-center gap-1.5 font-semibold text-[#7E1815]">
              <MapPin className="w-3.5 h-3.5 text-[#B52B20]" />
              <span>🚇 {pandal.nearestMetro}</span>
            </span>
            <span className="text-[#5A4E46] font-medium text-[11px]">
              {walkingDisplay}
            </span>
          </div>
        </div>

        {/* Card CTA Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#D6A13A]/20">
          {onSeeOnMap && pandal.latitude && pandal.longitude && (
            <button
              onClick={() => onSeeOnMap(pandal.id)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#F8F0DF] hover:bg-[#EFE2C7] text-[#7E1815] border border-[#D6A13A]/40 text-xs font-bold transition-colors text-center"
            >
              See on Map
            </button>
          )}

          <Link
            href={`/pandal/${pandal.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF] text-xs font-bold shadow-md shadow-[#7E1815]/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E7C46A]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
