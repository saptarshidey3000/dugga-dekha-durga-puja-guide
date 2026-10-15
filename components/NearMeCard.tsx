'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NearbyPlace } from '@/lib/near-me';
import { Navigation, MapPin, ArrowRight, Map, Train, Landmark } from 'lucide-react';

interface NearMeCardProps {
  place: NearbyPlace;
  rank?: number;
  onSeeOnMap?: (placeId: string) => void;
}

export default function NearMeCard({ place, rank, onSeeOnMap }: NearMeCardProps) {
  const isBonedi = place.type === 'bonedi';
  const isMetro = place.type === 'metro';

  const categoryTag = isBonedi ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#2A1815] text-[#E1BE68] border border-[#C9973E]/60 shadow-xs">
      <Landmark className="w-3 h-3 text-[#E1BE68]" />
      <span>Bonedi Bari</span>
    </span>
  ) : isMetro ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#14261C] text-[#7ce0b2] border border-emerald-500/50 shadow-xs">
      <Train className="w-3 h-3 text-[#7ce0b2]" />
      <span>Metro Station</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E]/60 shadow-xs">
      <span>🛕</span>
      <span>Pandal</span>
    </span>
  );

  return (
    <div className="group relative rounded-3xl bg-[#18110F]/90 backdrop-blur-xl border border-[#C9973E]/40 hover:border-[#E1BE68] shadow-xl hover:shadow-[0_12px_36px_rgba(143,29,24,0.3)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 overflow-hidden">
      {/* Visual Header for Bonedi Bari if authentic image exists */}
      {isBonedi && place.image && (
        <div className="relative aspect-[16/9] w-full bg-[#241714] overflow-hidden border-b border-[#C9973E]/30">
          <Image
            src={place.image}
            alt={place.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18110F] via-transparent to-black/30" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#120E0C]/90 text-[#E1BE68] text-[10px] font-black tracking-wider uppercase backdrop-blur-sm border border-[#C9973E]/60 shadow-md">
            <Landmark className="w-3 h-3" />
            <span>HERITAGE COURTYARD</span>
          </div>
          {place.yearEstablished && (
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/70 text-[10px] font-black tracking-wider uppercase shadow-md">
              Est. {place.yearEstablished}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Top metadata strip: Category tag & glowing straight-line distance pill */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {rank !== undefined && (
                <span className="w-6 h-6 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/80 text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs">
                  {rank < 10 ? `0${rank}` : rank}
                </span>
              )}
              {categoryTag}
            </div>

            {/* Glowing Distance Pill */}
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#8F1D18] to-[#6A120E] text-[#F7F0E2] text-xs font-black border border-[#E1BE68]/70 shadow-[0_2px_10px_rgba(201,151,62,0.25)]">
                <span className="text-[#E1BE68]">📍</span>
                <span>{place.formattedDistance}</span>
              </span>
              <span className="block text-[9px] text-[#E1BE68]/70 uppercase tracking-widest font-bold mt-0.5">
                Straight-line
              </span>
            </div>
          </div>

          {/* Area & Region Tagline */}
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1BE68] block mb-1">
            {place.area} · {place.region}
          </span>

          {/* Title & Bengali Name */}
          <h3 className="font-editorial text-xl sm:text-2xl font-black text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors leading-snug">
            {place.name}
          </h3>
          {place.bengaliName && (
            <p className="text-xs text-[#E1BE68]/90 font-serif font-medium mt-0.5">{place.bengaliName}</p>
          )}

          {/* Clean Description */}
          {place.description && (
            <p className="text-xs text-[#F7F0E2]/85 leading-relaxed mt-2 line-clamp-2">
              {place.description}
            </p>
          )}

          {/* Nearest Metro & Address pill */}
          <div className="mt-3.5 bg-[#241714]/70 p-3 rounded-2xl border border-[#C9973E]/30 space-y-1 text-xs">
            {place.nearestMetro && (
              <div className="flex items-center justify-between text-[#E1BE68] font-bold">
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E1BE68]" />
                  <span className="truncate">🚇 {place.nearestMetro}</span>
                </span>
                {place.walkingTime && (
                  <span className="text-[#F7F0E2]/70 font-semibold text-[11px] shrink-0">
                    🚶 {place.walkingTime}
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-[#F7F0E2]/70 truncate">
              {place.address}
            </p>
          </div>
        </div>

        {/* Simplified Actions Bar: Primary Get Directions + View Details + Map Icon */}
        <div className="pt-3 border-t border-[#C9973E]/30 flex items-center gap-2">
          {/* Primary Action: Get Directions (Google Maps Walking Mode) */}
          <a
            href={place.googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8F1D18] to-[#B52A22] hover:from-[#B52A22] hover:to-[#8F1D18] text-[#F7F0E2] border border-[#E1BE68]/60 text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] cursor-pointer"
            title="Open walking directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
            <span className="truncate">GET DIRECTIONS ↗</span>
          </a>

          {/* Map Pin Jump Button */}
          {onSeeOnMap && (
            <button
              type="button"
              onClick={() => onSeeOnMap(place.id)}
              className="p-3 rounded-2xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 hover:border-[#E1BE68] transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Locate on Leaflet map"
            >
              <Map className="w-4 h-4" />
            </button>
          )}

          {/* Details Page Link */}
          <Link
            href={place.detailUrl}
            className="py-3 px-4 rounded-2xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] text-xs font-extrabold uppercase tracking-wider transition-all border border-[#C9973E]/40 hover:border-[#E1BE68] flex items-center justify-center gap-1 shrink-0"
          >
            <span>DETAILS</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
