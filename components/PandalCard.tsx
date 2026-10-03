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

  const crowdBadgeStyles: Record<string, { bg: string; dot: string; text: string }> = {
    Low: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', dot: 'bg-emerald-600', text: '● LOW' },
    Moderate: { bg: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-600', text: '● MODERATE' },
    Busy: { bg: 'bg-orange-50 border-orange-200 text-orange-800', dot: 'bg-orange-600', text: '● BUSY' },
    'Very Crowded': { bg: 'bg-red-50 border-red-200 text-red-800', dot: 'bg-red-600', text: '● VERY CROWDED' },
  };

  const crowdInfo = pandal.crowdLevel ? crowdBadgeStyles[pandal.crowdLevel] : null;

  const walkingDisplay = pandal.walkingTime
    ? pandal.walkingDistance
      ? `🚶 ${pandal.walkingTime.replace('~', '')} • ~${pandal.walkingDistance}`
      : `🚶 ${pandal.walkingTime}`
    : 'Walking info coming soon';

  return (
    <div className="group relative bg-[#FFFFFF] border border-[#E8DECE] hover:border-[#8F1D18] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Visual Image */}
      <div className="relative aspect-[16/10] w-full bg-[#FAF8F5] overflow-hidden">
        <Image
          src={imgSrc}
          alt={pandal.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc('/pujo-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Order badge if in route */}
        {orderNumber !== undefined && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#8F1D18] text-[#FAF8F5] font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm">
            {orderNumber < 10 ? `0${orderNumber}` : orderNumber}
          </div>
        )}

        {/* Save Pandal Button */}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save pandal'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
            saved
              ? 'bg-[#8F1D18] text-[#FAF8F5] border-[#8F1D18] shadow-sm'
              : 'bg-white/90 text-[#1A1412] border-[#E8DECE] hover:text-[#8F1D18]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Crowd Badge */}
        {crowdInfo && (
          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm shadow-xs ${crowdInfo.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${crowdInfo.dot}`} />
              <span>{pandal.crowdLevel}</span>
            </span>
          </div>
        )}

        {/* Category Pill */}
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
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#8F1D18] border border-[#E8DECE] shadow-xs"
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1412] group-hover:text-[#8F1D18] transition-colors line-clamp-1">
              {pandal.name}
            </h3>
            {pandal.yearEstablished && (
              <span className="text-[11px] text-[#8F1D18] shrink-0 font-semibold">
                Est. {pandal.yearEstablished}
              </span>
            )}
          </div>

          <p className="text-xs text-[#6B5E55] mb-3 font-medium">
            {pandal.area}, {pandal.region}
          </p>

          {/* Metro & Walking Information */}
          <div className="flex items-center justify-between text-xs text-[#1A1412] bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#E8DECE] mb-4">
            <span className="flex items-center gap-1.5 font-semibold text-[#8F1D18]">
              <MapPin className="w-3.5 h-3.5 text-[#8F1D18]" />
              <span>🚇 {pandal.nearestMetro}</span>
            </span>
            <span className="text-[#6B5E55] font-medium text-[11px]">
              {walkingDisplay}
            </span>
          </div>
        </div>

        {/* Card CTA Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8DECE]">
          {onSeeOnMap && pandal.latitude && pandal.longitude && (
            <button
              onClick={() => onSeeOnMap(pandal.id)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EBDD] text-[#8F1D18] border border-[#E8DECE] text-xs font-bold transition-colors text-center"
            >
              See on Map
            </button>
          )}

          <Link
            href={`/pandal/${pandal.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#FAF8F5] text-xs font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
