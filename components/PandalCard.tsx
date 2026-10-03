'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, MapPin, ArrowRight, Clock, Users, Navigation } from 'lucide-react';
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

  const crowdColors: Record<string, string> = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Busy: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Very Crowded': 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <div className="group relative bg-[#0B223D] border border-[#D99A3D]/20 hover:border-[#D99A3D]/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col">
      {/* Visual Image / Banner */}
      <div className="relative h-44 sm:h-48 w-full bg-[#071A2F] overflow-hidden">
        <Image
          src={pandal.images[0] || '/pujo-mobile.png'}
          alt={pandal.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B223D] via-[#0B223D]/40 to-transparent" />

        {/* Order badge if in route */}
        {orderNumber !== undefined && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#B93624] text-[#FFF8EC] font-bold text-sm flex items-center justify-center border-2 border-[#FFF8EC] shadow-md">
            {orderNumber}
          </div>
        )}

        {/* Save Pandal Button */}
        <button
          onClick={handleToggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save pandal'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
            saved
              ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
              : 'bg-[#071A2F]/80 text-[#FFF8EC]/80 border-[#D99A3D]/30 hover:text-[#D99A3D]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Categories Pills */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {pandal.category.map((cat) => {
            const label = cat === 'must-visit' ? '🔥 Must Visit' : cat === 'best-theme' ? '🎨 Best Theme' : cat === 'traditional' ? '🛕 Traditional' : '🏛️ Heritage';
            return (
              <span
                key={cat}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#071A2F]/90 text-[#D99A3D] border border-[#D99A3D]/30 backdrop-blur-sm"
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors line-clamp-1">
              {pandal.name}
            </h3>
            {pandal.yearEstablished && (
              <span className="text-[11px] text-[#D99A3D] shrink-0 font-medium">
                Est. {pandal.yearEstablished}
              </span>
            )}
          </div>

          {pandal.bengaliName && (
            <p className="text-xs text-[#D8CEBE]/80 mb-2 font-serif">
              {pandal.bengaliName}
            </p>
          )}

          <p className="text-xs text-[#D8CEBE]/90 line-clamp-2 mb-3.5 leading-relaxed">
            {pandal.description}
          </p>

          {/* Quick Route/Metro Specs */}
          <div className="space-y-1.5 text-xs text-[#D8CEBE]/85 bg-[#071A2F]/60 p-2.5 rounded-xl border border-[#D99A3D]/15 mb-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#FFF8EC] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D99A3D]" />
                <span>{pandal.nearestMetro} Metro</span>
              </span>
              {pandal.walkingTime && (
                <span className="flex items-center gap-1 text-[#D99A3D] font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{pandal.walkingTime}</span>
                </span>
              )}
            </div>

            {pandal.metroExit && (
              <p className="text-[11px] text-[#D8CEBE]/70 pl-5">
                {pandal.metroExit}
              </p>
            )}

            {pandal.crowdLevel && (
              <div className="flex items-center justify-between pt-1 border-t border-[#D99A3D]/10">
                <span className="text-[11px] text-[#D8CEBE]/70 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#D99A3D]" /> Crowd
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${crowdColors[pandal.crowdLevel] || 'text-[#D8CEBE]'}`}>
                  {pandal.crowdLevel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#D99A3D]/15">
          {onSeeOnMap && pandal.latitude && pandal.longitude && (
            <button
              onClick={() => onSeeOnMap(pandal.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0F2A4A] hover:bg-[#173860] text-[#D99A3D] border border-[#D99A3D]/30 text-xs font-semibold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>See on Map</span>
            </button>
          )}

          <Link
            href={`/pandal/${pandal.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#B93624] hover:bg-[#cf412e] text-[#FFF8EC] text-xs font-semibold shadow-md transition-colors"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
