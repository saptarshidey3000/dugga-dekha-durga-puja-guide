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
  Users,
  Navigation,
  Sparkles,
  ArrowRight,
  Footprints,
  Calendar,
  Share2,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-[280px] bg-[#0B223D] rounded-2xl animate-pulse" />,
});

export default function PandalDetailClient({ pandal }: { pandal: Pandal }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const crowdColors: Record<string, string> = {
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Busy: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Very Crowded': 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D99A3D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Pandals</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B223D] border border-[#D99A3D]/30 text-xs text-[#D8CEBE] hover:text-[#FFF8EC]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={toggleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
              saved
                ? 'bg-[#B93624] text-[#FFF8EC]'
                : 'bg-[#0B223D] text-[#D8CEBE] border border-[#D99A3D]/30 hover:text-[#D99A3D]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'PANDAL SAVED' : 'SAVE PANDAL'}</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Image Banner */}
      <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-[#D99A3D]/30 shadow-2xl bg-[#071A2F]">
        <Image
          src={pandal.images[0] || '/pujo-mobile.png'}
          alt={pandal.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover object-center filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-[#071A2F]/40 to-transparent" />

        {/* Region & Categories Pills */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B93624] text-[#FFF8EC] shadow-md">
            {pandal.region}
          </span>
          {pandal.category.map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-[#071A2F]/90 text-[#D99A3D] border border-[#D99A3D]/30 backdrop-blur-sm shadow-md"
            >
              {cat === 'must-visit' ? '🔥 Must Visit' : cat === 'best-theme' ? '🎨 Best Theme' : cat === 'traditional' ? '🛕 Traditional' : '🏛️ Heritage'}
            </span>
          ))}
        </div>

        {/* Floating Pandal Identity in Banner */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="text-xs text-[#D99A3D] font-bold tracking-widest uppercase mb-1">
            {pandal.area} • {pandal.nearestMetro} Metro Hub
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] drop-shadow-md">
            {pandal.name}
          </h1>
          {pandal.bengaliName && (
            <p className="text-sm sm:text-base text-[#D8CEBE] font-serif mt-1">
              {pandal.bengaliName}
            </p>
          )}
        </div>
      </div>

      {/* Concise Tactical Specifications (Field Guide Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0B223D] border border-[#D99A3D]/25 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A3D] block">
            Nearest Metro
          </span>
          <p className="font-bold text-sm text-[#FFF8EC] mt-1">{pandal.nearestMetro}</p>
          <span className="text-[11px] text-[#D8CEBE]/80 block">{pandal.metroExit || 'Main Gate'}</span>
        </div>

        <div className="bg-[#0B223D] border border-[#D99A3D]/25 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A3D] block">
            Walking Time
          </span>
          <p className="font-bold text-sm text-[#FFF8EC] mt-1">{pandal.walkingTime || 'Walk from station'}</p>
          <span className="text-[11px] text-[#D8CEBE]/80 block">{pandal.walkingDistance || 'Verified walk'}</span>
        </div>

        <div className="bg-[#0B223D] border border-[#D99A3D]/25 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A3D] block">
            Crowd Advisory
          </span>
          <p className="font-bold text-sm text-[#FFF8EC] mt-1">{pandal.crowdLevel || 'Moderate'}</p>
          <span className="text-[10px] text-[#D8CEBE]/70 block truncate">
            {pandal.crowdSource || 'Kolkata Police 2026'}
          </span>
        </div>

        <div className="bg-[#0B223D] border border-[#D99A3D]/25 p-3.5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A3D] block">
            Best Time
          </span>
          <p className="font-bold text-xs text-[#FFF8EC] mt-1 leading-snug">
            {pandal.bestTimeToVisit || '5:00 PM – 7:30 PM'}
          </p>
        </div>
      </div>

      {/* Description & Theme Section */}
      <div className="bg-[#0B223D] border border-[#D99A3D]/25 rounded-2xl p-6 space-y-4 shadow-lg">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#D99A3D] mb-1">
            Pandal Description
          </h2>
          <p className="text-sm text-[#FFF8EC] leading-relaxed">
            {pandal.description}
          </p>
        </div>

        {pandal.theme && (
          <div className="pt-3 border-t border-[#D99A3D]/15">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D99A3D] mb-1">
              2026 Thematic Concept
            </h3>
            <p className="text-sm text-[#D8CEBE] italic leading-relaxed">
              &quot;{pandal.theme}&quot;
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-[#D99A3D]/15">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D99A3D] mb-1">
            Exact Location & Walking Directions
          </h3>
          <p className="text-xs text-[#FFF8EC] font-semibold">{pandal.address}</p>
          {pandal.directions && (
            <p className="text-xs text-[#D8CEBE] mt-1">
              👉 {pandal.directions}
            </p>
          )}
        </div>
      </div>

      {/* NEXT STOP RECOMMENDATION (USP) */}
      {nextPandal && (
        <div className="bg-gradient-to-r from-[#B93624] to-[#7E1B0E] p-5 rounded-2xl shadow-xl border-2 border-[#D99A3D] text-[#FFF8EC]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-1.5">
            <span>RECOMMENDED NEXT STOP</span>
            <span>Part of {associatedRoute?.name}</span>
          </div>

          <h3 className="font-editorial text-2xl font-bold">
            🛕 {nextPandal.name}
          </h3>
          <p className="text-xs text-[#FFF8EC]/90 mt-1 mb-3">
            {nextInstruction || nextPandal.directions}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <span className="text-xs font-semibold">
              🚶 {nextPandal.walkingTime || '4 min walk'}
            </span>
            <Link
              href={`/pandal/${nextPandal.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFF8EC] text-[#B93624] text-xs font-bold shadow-md hover:bg-white transition-colors"
            >
              <span>Go to Next Pandal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Spatial Map of Pandal Location */}
      {pandal.latitude && pandal.longitude && (
        <div className="bg-[#0B223D] border border-[#D99A3D]/30 p-4 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#D99A3D] uppercase">
            <span>Pandal Location Map</span>
            <span>
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
