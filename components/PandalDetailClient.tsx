'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pandal } from '@/data/types';
import { ROUTES } from '@/data/routes';
import { PANDALS } from '@/data/pandals';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Clock,
  ArrowRight,
  Share2,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[280px] bg-[#FFFFFF] rounded-2xl animate-pulse border border-[#D6A13A]/30" />,
});

export default function PandalDetailClient({ pandal }: { pandal: Pandal }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgSrc, setImgSrc] = useState(pandal.images[0] || '/pujo-mobile.png');

  useEffect(() => {
    setSaved(isPandalSaved(pandal.id));
  }, [pandal.id]);

  const toggleSave = () => {
    if (saved) {
      removeSavedPandal(pandal.id);
      setSaved(false);
    } else {
      savePandal(pandal.id);
      setSaved(true);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find next recommended stop if part of a route
  const associatedRoute = ROUTES.find((r) =>
    r.stops.some((s) => s.pandalId === pandal.id)
  );

  let nextPandal: Pandal | null = null;
  let nextInstruction = '';

  if (associatedRoute) {
    const currentIndex = associatedRoute.stops.findIndex((s) => s.pandalId === pandal.id);
    if (currentIndex >= 0 && currentIndex < associatedRoute.stops.length - 1) {
      const nextStop = associatedRoute.stops[currentIndex + 1];
      nextPandal = PANDALS.find((p) => p.id === nextStop.pandalId) || null;
      nextInstruction = nextStop.instruction || '';
    }
  }

  // Crowd badges specification: only show where verified data exists
  const crowdBadgeStyles: Record<string, { bg: string; dot: string }> = {
    Low: { bg: 'bg-emerald-50 border-emerald-300 text-emerald-800', dot: 'bg-emerald-600' },
    Moderate: { bg: 'bg-amber-50 border-amber-300 text-amber-800', dot: 'bg-amber-600' },
    Busy: { bg: 'bg-orange-50 border-orange-300 text-orange-800', dot: 'bg-orange-600' },
    'Very Crowded': { bg: 'bg-red-50 border-red-300 text-red-800', dot: 'bg-red-600' },
  };

  const crowdInfo = pandal.crowdLevel ? crowdBadgeStyles[pandal.crowdLevel] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 bg-[#F8F0DF] text-[#171311]">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D6A13A]/30">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7E1815] hover:text-[#B52B20] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#B52B20]" />
          <span>Back to All Pandals</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D6A13A]/40 text-xs text-[#5A4E46] hover:text-[#7E1815] shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B52B20]" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={toggleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
              saved
                ? 'bg-[#7E1815] text-[#F8F0DF] border border-[#D6A13A]'
                : 'bg-[#FFFFFF] text-[#7E1815] border border-[#D6A13A]/40 hover:text-[#B52B20]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current text-[#E7C46A]' : ''}`} />
            <span>{saved ? 'PANDAL SAVED' : 'SAVE PANDAL'}</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Image Banner (Section 92: Top Large Image) */}
      <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-[#D6A13A]/40 shadow-2xl bg-[#35120F]">
        <Image
          src={imgSrc}
          alt={pandal.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover object-center filter brightness-95"
          onError={() => setImgSrc('/pujo-mobile.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#35120F] via-[#35120F]/40 to-transparent" />

        {/* Region & Categories Pills */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B52B20] text-[#F8F0DF] shadow-md border border-[#D6A13A]/40">
            {pandal.region}
          </span>
          {pandal.category.map((cat) => (
            <span
              key={cat}
              className="chip-category shadow-md"
            >
              {cat === 'must-visit' ? '🔥 MUST VISIT' : cat === 'best-theme' ? '🎨 BEST THEME' : cat === 'traditional' ? '🛕 TRADITIONAL' : '🏛️ HERITAGE'}
            </span>
          ))}
        </div>

        {/* Floating Pandal Identity in Banner */}
        <div className="absolute bottom-5 left-5 right-5 text-[#F8F0DF]">
          <div className="text-xs text-[#E7C46A] font-bold tracking-widest uppercase mb-1">
            {pandal.area} • 🚇 {pandal.nearestMetro} Metro Hub
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F8F0DF] drop-shadow-md">
            {pandal.name}
          </h1>
          {pandal.bengaliName && (
            <p className="text-sm sm:text-base text-[#E7C46A] font-serif mt-1">
              {pandal.bengaliName}
            </p>
          )}
        </div>
      </div>

      {/* Tactical Specifications (Section 92: Metro, Walk, Address) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B52B20] block">
            Nearest Metro
          </span>
          <p className="font-bold text-sm text-[#171311] mt-1">🚇 {pandal.nearestMetro}</p>
          <span className="text-[11px] text-[#5A4E46] block">{pandal.metroExit || 'Main Gate'}</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B52B20] block">
            Walking Time
          </span>
          <p className="font-bold text-sm text-[#171311] mt-1">{pandal.walkingTime || 'Walk from station'}</p>
          <span className="text-[11px] text-[#5A4E46] block">{pandal.walkingDistance || 'Verified walk'}</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B52B20] block">
            Crowd Advisory
          </span>
          <p className="font-bold text-sm text-[#171311] mt-1">
            {pandal.crowdLevel ? `● ${pandal.crowdLevel.toUpperCase()}` : 'Moderate'}
          </p>
          <span className="text-[10px] text-[#5A4E46] block truncate">
            {pandal.crowdSource || 'Verified Puja guide'}
          </span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 p-3.5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B52B20] block">
            Best Visiting Hours
          </span>
          <p className="font-bold text-xs text-[#171311] mt-1 leading-snug">
            {pandal.bestTimeToVisit || '5:00 PM – 7:30 PM'}
          </p>
        </div>
      </div>

      {/* Description & Theme Section (Section 92: About the Puja) */}
      <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#B52B20] mb-1">
            About the Puja
          </h2>
          <p className="text-sm text-[#171311] leading-relaxed font-normal">
            {pandal.description}
          </p>
        </div>

        {pandal.theme && (
          <div className="pt-3 border-t border-[#D6A13A]/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#7E1815] mb-1">
              2026 Thematic Concept
            </h3>
            <p className="text-sm text-[#5A4E46] italic leading-relaxed">
              &quot;{pandal.theme}&quot;
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-[#D6A13A]/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#7E1815] mb-1">
            Exact Location & Walking Directions
          </h3>
          <p className="text-xs text-[#171311] font-semibold">{pandal.address}</p>
          {pandal.directions && (
            <p className="text-xs text-[#5A4E46] mt-1">
              👉 {pandal.directions}
            </p>
          )}
        </div>
      </div>

      {/* NEXT STOP RECOMMENDATION (Section 92: NEXT STOP) */}
      {nextPandal && (
        <div className="bg-gradient-to-r from-[#7E1815] to-[#B52B20] p-5 sm:p-6 rounded-2xl shadow-xl border-2 border-[#D6A13A] text-[#F8F0DF]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-1.5 text-[#E7C46A]">
            <span>RECOMMENDED NEXT STOP</span>
            <span>Part of {associatedRoute?.name}</span>
          </div>

          <h3 className="font-editorial text-2xl font-bold">
            🛕 {nextPandal.name}
          </h3>
          <p className="text-xs text-[#F8F0DF]/90 mt-1 mb-4 leading-relaxed">
            {nextInstruction || nextPandal.directions}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs font-semibold text-[#E7C46A]">
              🚶 {nextPandal.walkingTime || '4 min walk'}
            </span>
            <Link
              href={`/pandal/${nextPandal.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8F0DF] text-[#7E1815] text-xs font-bold shadow-md hover:bg-white transition-colors"
            >
              <span>Go to Next Pandal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B52B20]" />
            </Link>
          </div>
        </div>
      )}

      {/* Spatial Map of Pandal Location (Section 92: SEE ON MAP) */}
      {pandal.latitude && pandal.longitude && (
        <div className="bg-[#FFFFFF] border border-[#D6A13A]/40 p-4 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#7E1815] uppercase">
            <span>Pandal Location Map</span>
            <span className="text-[#5A4E46]">
              {pandal.latitude.toFixed(4)}, {pandal.longitude.toFixed(4)}
            </span>
          </div>
          <InteractiveMap
            pandals={[pandal]}
            center={[pandal.latitude, pandal.longitude]}
            zoom={16}
            heightClass="h-[300px]"
          />
        </div>
      )}
    </div>
  );
}
