'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BonediBari } from '@/data/types';
import { Landmark, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface BonediCardProps {
  bonedi: BonediBari;
  onSeeOnMap?: (bonediId: string) => void;
}

export default function BonediCard({ bonedi, onSeeOnMap }: BonediCardProps) {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState(bonedi.image || '/bonedi-mobile.png');

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    router.push(`/bonedi/${bonedi.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-3xl bg-[#120E0C]/90 backdrop-blur-md text-[#F7F0E2] border-2 border-[#C9973E]/40 hover:border-[#E1BE68] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 cursor-pointer"
    >
      {/* 1. IMAGE (Section 23: Visual emphasis for Bonedi Bari) */}
      <div className="relative aspect-[16/10] w-full bg-[#241714] overflow-hidden border-b border-[#C9973E]/30">
        <Image
          src={imgSrc}
          alt={bonedi.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc('/bonedi-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E0C] via-transparent to-black/30" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120E0C]/90 text-[#E1BE68] text-[10px] font-black tracking-wider uppercase backdrop-blur-sm border border-[#C9973E]/50">
          <Landmark className="w-3 h-3" />
          <span>BONEDI BARI</span>
        </div>

        {bonedi.yearEstablished && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50 text-[10px] font-black tracking-wider uppercase shadow-md">
            Est. {bonedi.yearEstablished}
          </div>
        )}
      </div>

      {/* 2. Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* BONEDI BARI NAME */}
          <div className="mb-2">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors leading-snug">
              {bonedi.name}
            </h3>
            {bonedi.bengaliName && (
              <p className="text-xs text-[#E1BE68] font-serif font-medium mt-0.5">{bonedi.bengaliName}</p>
            )}
          </div>

          {/* AREA */}
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E1BE68] block mb-2">
            {bonedi.area}
          </span>

          {/* SHORT DESCRIPTION */}
          <p className="text-xs text-[#F7F0E2]/80 leading-relaxed line-clamp-3 mb-4 font-normal">
            {bonedi.description}
          </p>

          {/* NEAREST METRO */}
          <div className="bg-[#241714]/80 p-3 rounded-2xl border border-[#C9973E]/30 space-y-1 text-xs mb-3">
            <div className="flex items-center gap-1.5 font-bold text-[#E1BE68]">
              <MapPin className="w-3.5 h-3.5 text-[#E1BE68]" />
              <span>🚇 Nearest Metro: {bonedi.nearestMetro}</span>
              {bonedi.walkingTime && (
                <span className="text-[#F7F0E2]/70 font-normal text-[11px]">({bonedi.walkingTime})</span>
              )}
            </div>
            <p className="text-[11px] text-[#F7F0E2]/70 pl-5">{bonedi.address}</p>
          </div>

          {/* COMMUTE / TRANSIT INFO */}
          {bonedi.commute && (
            <div className="bg-[#241714]/90 p-3 rounded-2xl border border-[#C9973E]/30 text-xs mb-4 space-y-1">
              <div className="flex items-center justify-between font-bold text-[#E1BE68] text-[11px]">
                <span>
                  {bonedi.commute.mode === 'WALK' ? '🚶 Walk' : bonedi.commute.mode === 'BOOK_AUTO' ? '🛺 Book Auto' : '🚶/🛺 Transit'} • {bonedi.commute.durationMinutes} min
                </span>
                <span className="text-[#F7F0E2]/70 font-normal">
                  {bonedi.commute.distanceMeters}m · ~{bonedi.commute.estimatedSteps} steps
                </span>
              </div>
              <p className="text-[11px] text-[#F7F0E2]/80 leading-snug line-clamp-2">
                {bonedi.commute.transitRecommendation}
              </p>
            </div>
          )}
        </div>

        {/* 3. Action Buttons: VIEW DETAILS */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#C9973E]/30">
          {onSeeOnMap && bonedi.latitude && (
            <button
              onClick={() => onSeeOnMap(bonedi.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
              <span>See on Map</span>
            </button>
          )}

          <Link
            href={`/bonedi/${bonedi.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-black uppercase tracking-wider transition-all shadow-md border border-[#C9973E]/50"
          >
            <span>VIEW DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
