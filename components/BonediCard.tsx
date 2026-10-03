'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BonediBari } from '@/data/types';
import { Landmark, MapPin, Navigation, ArrowRight } from 'lucide-react';

interface BonediCardProps {
  bonedi: BonediBari;
  onSeeOnMap?: (bonediId: string) => void;
}

export default function BonediCard({ bonedi, onSeeOnMap }: BonediCardProps) {
  return (
    <div className="group bg-[#FAF0DC] text-[#3A2118] border border-[#D99A3D]/40 hover:border-[#B93624] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Heritage Header Banner / Image */}
      <div className="relative h-44 w-full bg-[#3A2118] overflow-hidden">
        <Image
          src={bonedi.image || '/pujo-mobile.png'}
          alt={bonedi.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF0DC] via-transparent to-black/30" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A2118]/90 text-[#D99A3D] text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm border border-[#D99A3D]/40">
          <Landmark className="w-3 h-3" />
          <span>Bonedi Bari</span>
        </div>

        {bonedi.yearEstablished && (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#B93624] text-[#FFF8EC] text-[10px] font-bold tracking-wider uppercase">
            Est. {bonedi.yearEstablished}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="mb-2">
            <h3 className="font-editorial text-xl font-bold text-[#3A2118] group-hover:text-[#B93624] transition-colors leading-snug">
              {bonedi.name}
            </h3>
            {bonedi.bengaliName && (
              <p className="text-xs text-[#5C3A2E] font-serif mt-0.5">{bonedi.bengaliName}</p>
            )}
          </div>

          <p className="text-xs text-[#5C3A2E] leading-relaxed line-clamp-3 mb-4">
            {bonedi.description}
          </p>

          {/* Heritage detail specs */}
          <div className="bg-[#F6E8CC] p-3 rounded-xl border border-[#D99A3D]/30 space-y-1.5 text-xs text-[#3A2118] mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-[#B93624]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Nearest Metro: {bonedi.nearestMetro}</span>
              {bonedi.walkingTime && (
                <span className="text-[#5C3A2E] font-normal">({bonedi.walkingTime})</span>
              )}
            </div>
            <p className="text-[11px] text-[#5C3A2E] pl-5">{bonedi.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#D99A3D]/25">
          {onSeeOnMap && bonedi.latitude && (
            <button
              onClick={() => onSeeOnMap(bonedi.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-white/70 hover:bg-white text-[#3A2118] border border-[#D99A3D]/40 text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B93624]" />
              <span>See on Map</span>
            </button>
          )}

          <Link
            href={`/bonedi/${bonedi.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#3A2118] hover:bg-[#B93624] text-[#FFF8EC] text-xs font-semibold transition-colors shadow-sm"
          >
            <span>Heritage View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
