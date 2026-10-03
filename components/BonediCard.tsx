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
    <div className="group bg-[#FFFFFF] text-[#171311] border border-[#D6A13A]/30 hover:border-[#D6A13A] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Heritage Header Banner / Large Architectural Image */}
      <div className="relative aspect-[16/10] w-full bg-[#EFE2C7] overflow-hidden">
        <Image
          src={imgSrc}
          alt={bonedi.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc('/pujo-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7E1815]/90 text-[#E7C46A] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm border border-[#D6A13A]/50">
          <Landmark className="w-3 h-3" />
          <span>BONEDI BARI</span>
        </div>

        {bonedi.yearEstablished && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#D6A13A] text-[#35120F] text-[10px] font-bold tracking-wider uppercase shadow-sm">
            Est. {bonedi.yearEstablished}
          </div>
        )}
      </div>

      {/* Content (Section 93) */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <div className="mb-2">
            <h3 className="font-editorial text-xl font-bold text-[#7E1815] group-hover:text-[#B52B20] transition-colors leading-snug">
              {bonedi.name}
            </h3>
            {bonedi.bengaliName && (
              <p className="text-xs text-[#D6A13A] font-serif font-medium mt-0.5">{bonedi.bengaliName}</p>
            )}
          </div>

          <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-2 mb-4 font-normal">
            {bonedi.description}
          </p>

          {/* Heritage detail specs */}
          <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/25 space-y-1.5 text-xs text-[#171311] mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-[#7E1815]">
              <MapPin className="w-3.5 h-3.5 text-[#B52B20]" />
              <span>🚇 Nearest Metro: {bonedi.nearestMetro}</span>
              {bonedi.walkingTime && (
                <span className="text-[#5A4E46] font-normal text-[11px]">({bonedi.walkingTime})</span>
              )}
            </div>
            <p className="text-[11px] text-[#5A4E46] pl-5">{bonedi.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#D6A13A]/20">
          {onSeeOnMap && bonedi.latitude && (
            <button
              onClick={() => onSeeOnMap(bonedi.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-[#F8F0DF] hover:bg-[#EFE2C7] text-[#7E1815] border border-[#D6A13A]/40 text-xs font-bold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B52B20]" />
              <span>See on Map</span>
            </button>
          )}

          <Link
            href={`/bonedi/${bonedi.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF] text-xs font-bold transition-colors shadow-md shadow-[#7E1815]/20"
          >
            <span>GET DIRECTIONS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E7C46A]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
