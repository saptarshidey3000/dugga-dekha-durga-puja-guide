'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BonediBari } from '@/data/types';
import { Landmark, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface BonediCardProps {
  bonedi: BonediBari;
  onSeeOnMap?: (bonediId: string) => void;
}

export default function BonediCard({ bonedi, onSeeOnMap }: BonediCardProps) {
  const [imgSrc, setImgSrc] = useState(bonedi.image || '/pujo-mobile.png');

  return (
    <div className="group bg-[#FFFFFF] text-[#1A1412] border border-[#E8DECE] hover:border-[#8F1D18] rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Heritage Header Banner / Large Architectural Image */}
      <div className="relative aspect-[16/10] w-full bg-[#FAF8F5] overflow-hidden">
        <Image
          src={imgSrc}
          alt={bonedi.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc('/pujo-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#8F1D18] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm border border-[#E8DECE]">
          <Landmark className="w-3 h-3" />
          <span>BONEDI BARI</span>
        </div>

        {bonedi.yearEstablished && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#F3EBDD] text-[#8F1D18] border border-[#C9973E]/30 text-[10px] font-bold tracking-wider uppercase shadow-xs">
            Est. {bonedi.yearEstablished}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <div className="mb-2">
            <h3 className="font-editorial text-xl font-bold text-[#1A1412] group-hover:text-[#8F1D18] transition-colors leading-snug">
              {bonedi.name}
            </h3>
            {bonedi.bengaliName && (
              <p className="text-xs text-[#8F1D18] font-serif font-medium mt-0.5">{bonedi.bengaliName}</p>
            )}
          </div>

          <p className="text-xs text-[#6B5E55] leading-relaxed line-clamp-2 mb-4 font-normal">
            {bonedi.description}
          </p>

          {/* Heritage detail specs */}
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DECE] space-y-1.5 text-xs text-[#1A1412] mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-[#8F1D18]">
              <MapPin className="w-3.5 h-3.5 text-[#8F1D18]" />
              <span>🚇 Nearest Metro: {bonedi.nearestMetro}</span>
              {bonedi.walkingTime && (
                <span className="text-[#6B5E55] font-normal text-[11px]">({bonedi.walkingTime})</span>
              )}
            </div>
            <p className="text-[11px] text-[#6B5E55] pl-5">{bonedi.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E8DECE]">
          {onSeeOnMap && bonedi.latitude && (
            <button
              onClick={() => onSeeOnMap(bonedi.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EBDD] text-[#8F1D18] border border-[#E8DECE] text-xs font-bold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#8F1D18]" />
              <span>See on Map</span>
            </button>
          )}

          <Link
            href={`/bonedi/${bonedi.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#FAF8F5] text-xs font-bold transition-colors shadow-xs"
          >
            <span>GET DIRECTIONS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
