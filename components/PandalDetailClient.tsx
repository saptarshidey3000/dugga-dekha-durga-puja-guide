'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Navigation,
  ExternalLink,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] bg-[#120E0C]/90 rounded-2xl animate-pulse border border-[#C9973E]/40 flex items-center justify-center text-xs text-[#E1BE68]">
      Loading OpenStreetMap...
    </div>
  ),
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

  const externalGoogleMapsUrl =
    pandal.googleMapsUrl ||
    (pandal.latitude && pandal.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pandal.name + ', ' + pandal.address)}`);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 bg-transparent text-[#F7F0E2]">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#C9973E]/30">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#120E0C]/90 hover:bg-[#8F1D18] text-xs font-bold text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Pandals</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120E0C]/90 border border-[#C9973E]/40 text-xs text-[#E1BE68] hover:text-[#F7F0E2] shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={toggleSave}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              saved
                ? 'bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]'
                : 'bg-[#120E0C]/90 text-[#E1BE68] border border-[#C9973E]/40 hover:text-[#F7F0E2]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current text-[#E1BE68]' : ''}`} />
            <span>{saved ? 'PANDAL SAVED' : 'SAVE PANDAL'}</span>
          </button>
        </div>
      </div>

      {/* Header Banner (NO image, text/location focused as requested in Section 10) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/50 text-[#F7F0E2] shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50 shadow-sm">
            {pandal.region}
          </span>
          {pandal.category.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#241714] text-[#E1BE68] border border-[#C9973E]/40"
            >
              {cat === 'must-visit'
                ? '🔥 MUST VISIT'
                : cat === 'best-theme'
                ? '🎨 BEST THEME'
                : cat === 'traditional'
                ? '🛕 TRADITIONAL'
                : '🏛️ HERITAGE'}
            </span>
          ))}
        </div>

        <div className="text-xs text-[#E1BE68] font-bold tracking-widest uppercase">
          {pandal.area} • 🚇 {pandal.nearestMetro} Metro Hub
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F7F0E2] tracking-tight">
          {pandal.name}
        </h1>

        {pandal.bengaliName && (
          <p className="text-sm sm:text-base text-[#E1BE68] font-serif">
            {pandal.bengaliName}
          </p>
        )}

        {/* External Google Maps Button */}
        <div className="pt-2">
          <a
            href={externalGoogleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold uppercase tracking-wider transition-all shadow-md border border-[#C9973E]/50"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
            <span>SEE ON MAP →</span>
            <ExternalLink className="w-3 h-3 text-[#E1BE68]" />
          </a>
        </div>
      </div>

      {/* Tactical Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#120E0C]/90 backdrop-blur-md border border-[#C9973E]/40 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
            Nearest Metro
          </span>
          <p className="font-bold text-sm text-[#F7F0E2] mt-1">🚇 {pandal.nearestMetro}</p>
          <span className="text-[11px] text-[#F7F0E2]/70 block">{pandal.metroExit || 'Main Gate'}</span>
        </div>

        <div className="bg-[#120E0C]/90 backdrop-blur-md border border-[#C9973E]/40 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
            Walking Time
          </span>
          <p className="font-bold text-sm text-[#F7F0E2] mt-1">{pandal.walkingTime || 'Walk from stop'}</p>
          <span className="text-[11px] text-[#F7F0E2]/70 block">{pandal.walkingDistance || 'Verified walk'}</span>
        </div>

        <div className="bg-[#120E0C]/90 backdrop-blur-md border border-[#C9973E]/40 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
            Crowd Advisory
          </span>
          <p className="font-bold text-sm text-[#F7F0E2] mt-1">
            {pandal.crowdLevel ? `● ${pandal.crowdLevel.toUpperCase()}` : 'Moderate'}
          </p>
          <span className="text-[10px] text-[#F7F0E2]/70 block truncate">
            {pandal.crowdSource || 'Verified Puja guide'}
          </span>
        </div>

        <div className="bg-[#120E0C]/90 backdrop-blur-md border border-[#C9973E]/40 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
            Visiting Hours
          </span>
          <p className="font-bold text-xs text-[#F7F0E2] mt-1 leading-snug">
            {pandal.bestTimeToVisit || '5:00 PM – 7:30 PM'}
          </p>
        </div>
      </div>

      {/* Description & Theme Section */}
      <div className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 rounded-3xl p-6 space-y-4 shadow-xl">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
            About the Puja
          </h2>
          <p className="text-sm text-[#F7F0E2]/90 leading-relaxed font-normal">
            {pandal.description}
          </p>
        </div>

        {pandal.theme && (
          <div className="pt-3 border-t border-[#C9973E]/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
              2026 Thematic Concept
            </h3>
            <p className="text-sm text-[#F7F0E2]/80 italic leading-relaxed">
              &quot;{pandal.theme}&quot;
            </p>
          </div>
        )}

        <div className="pt-3 border-t border-[#C9973E]/30">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
            Exact Location & Walking Directions
          </h3>
          <p className="text-xs text-[#F7F0E2] font-semibold">{pandal.address}</p>
          {pandal.directions && (
            <p className="text-xs text-[#E1BE68] mt-1">
              👉 {pandal.directions}
            </p>
          )}
        </div>
      </div>

      {/* NEXT STOP RECOMMENDATION */}
      {nextPandal && (
        <div className="bg-gradient-to-r from-[#8F1D18] to-[#B52A22] p-5 sm:p-6 rounded-3xl shadow-xl border-2 border-[#C9973E] text-[#F7F0E2]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-1.5 text-[#E1BE68]">
            <span>RECOMMENDED NEXT STOP</span>
            <span>Part of {associatedRoute?.name}</span>
          </div>

          <h3 className="font-editorial text-2xl font-bold">
            🛕 {nextPandal.name}
          </h3>
          <p className="text-xs text-[#F7F0E2]/90 mt-1 mb-4 leading-relaxed">
            {nextInstruction || nextPandal.directions}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs font-semibold text-[#E1BE68]">
              🚶 {nextPandal.walkingTime || '4 min walk'}
            </span>
            <Link
              href={`/pandal/${nextPandal.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7F0E2] text-[#8F1D18] text-xs font-bold shadow-md hover:bg-white transition-colors"
            >
              <span>Go to Next Pandal</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B52A22]" />
            </Link>
          </div>
        </div>
      )}

      {/* Spatial Map of Pandal Location (OpenStreetMap) */}
      {pandal.latitude && pandal.longitude && (
        <div className="bg-[#120E0C]/90 border-2 border-[#C9973E]/40 p-4 rounded-3xl shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#E1BE68] uppercase">
            <span>Pandal Location Map</span>
            <span className="text-[#F7F0E2]/70">
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
