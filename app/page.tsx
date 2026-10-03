'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Bookmark,
  Clock,
  Footprints,
  Landmark,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/data/routes';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { BONEDI_BARIS } from '@/data/bonedi';
import { CATEGORIES } from '@/data/categories';
import { PUJA_CALENDAR_2026, CULTURAL_RITUALS } from '@/data/puja';
import { Region, PandalCategory } from '@/data/types';
import RouteTimeline from '@/components/RouteTimeline';
import PandalCard from '@/components/PandalCard';
import BonediCard from '@/components/BonediCard';
import PlannerWizard from '@/components/PlannerWizard';
import dynamic from 'next/dynamic';

// Leaflet map dynamically imported without SSR
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#0B223D] flex items-center justify-center text-[#D99A3D] text-sm animate-pulse rounded-2xl border border-[#D99A3D]/20">
      Loading Kolkata Route Map...
    </div>
  ),
});

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('South Kolkata');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('kalighat-chetla-trail');
  const [mapSelectedPandalId, setMapSelectedPandalId] = useState<string | null>(null);

  const activeRoute = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];
  const activeRoutePandals = activeRoute.stops
    .map((s) => PANDALS.find((p) => p.id === s.pandalId))
    .filter(Boolean) as typeof PANDALS;
  const activeRouteMetro = METRO_STATIONS.find((m) => m.id === activeRoute.metroStationId);

  const featuredPandals = PANDALS.filter((p) => p.category.includes('must-visit')).slice(0, 6);
  const featuredBonedi = BONEDI_BARIS.slice(0, 4);

  const regions: { id: Region; label: string; count: number; metroHub: string }[] = [
    { id: 'South Kolkata', label: 'South Kolkata', count: 18, metroHub: 'Kalighat • Deshapriya' },
    { id: 'North Kolkata', label: 'North Kolkata', count: 18, metroHub: 'Sovabazar • Shyambazar' },
    { id: 'Central Kolkata', label: 'Central Kolkata', count: 7, metroHub: 'MG Road • Central' },
    { id: 'East / West Metro', label: 'East / West Metro', count: 4, metroHub: 'Salt Lake • Karunamoyee' },
  ];

  return (
    <div className="w-full">
      {/* ============================================================
          HERO SECTION (CINEMATIC MOBILE-FIRST WITH ARTWORK)
      ============================================================ */}
      <section className="relative min-h-[90vh] sm:min-h-[85vh] flex flex-col justify-end px-4 sm:px-8 pb-12 sm:pb-16 pt-8 overflow-hidden">
        {/* Background Artwork - Vertical for mobile, Horizontal for tablet/desktop */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(min-width: 768px)" srcSet="/hopping-laptop-tab.png" />
            <img
              src="/pujo-mobile.png"
              alt="Kolkata Durga Puja Artwork"
              className="w-full h-full object-cover object-top filter brightness-95"
            />
          </picture>

          {/* Restrained Vignette & Bottom Text Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F] via-[#071A2F]/65 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A2F]/80 via-transparent to-[#071A2F]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A2F]/90 border border-[#D99A3D]/40 text-[#D99A3D] text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#B93624] animate-ping" />
            <span>KOLKATA DURGA PUJA 2026</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FFF8EC] leading-[1.1] tracking-tight mb-4 drop-shadow-md">
            Find the Puja. <br />
            <span className="text-[#D99A3D] italic">Follow the route.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#FFF8EC]/90 max-w-xl font-normal leading-relaxed mb-8 drop-shadow">
            Curated pandal routes, Metro exit guides, and practical walking itineraries to experience more with zero wasted travel.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md">
            <Link
              href="#metro-guide"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B93624] to-[#d13f2b] text-[#FFF8EC] font-bold text-sm tracking-wide shadow-xl shadow-[#B93624]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>EXPLORE PUJA</span>
            </Link>

            <Link
              href="/planner"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#071A2F]/90 hover:bg-[#0B223D] text-[#D99A3D] hover:text-[#FFF8EC] font-bold text-sm tracking-wide border border-[#D99A3D]/50 backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#D99A3D]" />
              <span>PLAN MY PUJA</span>
            </Link>
          </div>

          {/* Core Product Promise Micro-ticker */}
          <div className="mt-8 pt-6 border-t border-[#D99A3D]/20 flex flex-wrap items-center gap-4 text-xs text-[#D8CEBE]">
            <span className="text-[#D99A3D] font-bold uppercase tracking-wider">The Dugga Way:</span>
            <span>🚇 Metro Exit</span>
            <span>→</span>
            <span>🚶 Walk</span>
            <span>→</span>
            <span>🛕 Pandal</span>
            <span>→</span>
            <span>🗺️ Next Stop</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: EXPLORE KOLKATA REGIONS
      ============================================================ */}
      <section className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D99A3D]">
            Geographic Discovery
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FFF8EC] mt-1">
            Choose Your Kolkata Region
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2">
            Organized around primary Metro arteries for effortless travel across North, South, Central, and Salt Lake.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((reg) => (
            <Link
              key={reg.id}
              href={`/explore?region=${encodeURIComponent(reg.id)}`}
              className="group p-5 rounded-2xl bg-[#0B223D] border border-[#D99A3D]/25 hover:border-[#D99A3D] hover:bg-[#0F2A4A] transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-[#071A2F] border border-[#D99A3D]/30 flex items-center justify-center text-[#D99A3D]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-[#D99A3D] bg-[#071A2F] px-2.5 py-0.5 rounded-full border border-[#D99A3D]/20">
                    {reg.count} Pandals
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors">
                  {reg.label}
                </h3>
                <p className="text-xs text-[#D8CEBE]/80 mt-1">
                  Metro Hubs: <span className="text-[#FFF8EC]">{reg.metroHub}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#D99A3D] font-semibold mt-4 pt-3 border-t border-[#D99A3D]/15 group-hover:translate-x-1 transition-transform">
                <span>View Regional Pandals</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 2 & 3: METRO PUJA GUIDE & FEATURED ROUTES (USP)
      ============================================================ */}
      <section id="metro-guide" className="px-4 sm:px-8 py-16 bg-[#0B223D]/60 border-y border-[#D99A3D]/20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
                The Primary Experience
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
                Metro Puja Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#D8CEBE]/90 max-w-xl mt-2 leading-relaxed">
                Start at a Metro station. Follow a curated sequence. See more pandals with less unnecessary walking and zero backtracking.
              </p>
            </div>

            {/* Region Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['South Kolkata', 'North Kolkata', 'Central Kolkata', 'East / West Metro'] as Region[]).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      const matching = ROUTES.find((rt) => rt.region === r);
                      if (matching) setSelectedRouteId(matching.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedRegion === r
                        ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
                        : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
                    }`}
                  >
                    {r}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Route Selector Sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {ROUTES.filter((r) => r.region === selectedRegion).map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                  selectedRouteId === route.id
                    ? 'bg-[#D99A3D] text-[#071A2F] border-[#D99A3D] font-bold shadow-md'
                    : 'bg-[#071A2F] text-[#FFF8EC] border-[#D99A3D]/25 hover:bg-[#0F2A4A]'
                }`}
              >
                🚇 {route.name} ({route.stopsCount} stops)
              </button>
            ))}
          </div>

          {/* DESKTOP SPLIT: ROUTE TIMELINE (LEFT) & INTERACTIVE MAP (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Route Timeline (7 cols) */}
            <div className="lg:col-span-7">
              <RouteTimeline
                route={activeRoute}
                onSeeOnMap={(pandalId) => setMapSelectedPandalId(pandalId)}
              />
            </div>

            {/* Right: Sticky Interactive Map (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <div className="bg-[#0B223D] border border-[#D99A3D]/30 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#D99A3D] uppercase tracking-wider">
                    Interactive Route Map
                  </span>
                  <span className="text-[#D8CEBE]">
                    {activeRoutePandals.length} Points of Interest
                  </span>
                </div>

                <InteractiveMap
                  pandals={activeRoutePandals}
                  metroStation={activeRouteMetro}
                  activeRoute={activeRoute}
                  selectedPandalId={mapSelectedPandalId}
                  heightClass="h-[380px] sm:h-[460px]"
                />

                <div className="mt-3 pt-3 border-t border-[#D99A3D]/15 flex items-center justify-between text-xs text-[#D8CEBE]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#071A2F] border border-[#D99A3D] inline-block text-[8px] text-center">
                      🚇
                    </span>
                    <span>Metro Exit Gate</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#B93624] inline-block" />
                    <span>Route Stop Order</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: AI PUJA PLANNER
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D99A3D]">
            Smart Itinerary Generator
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
            Build Your Custom Puja Plan
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2">
            Have 4 hours at Kalighat or 6 hours in North Kolkata? Let the algorithm calculate the exact walking sequence and visit times.
          </p>
        </div>

        <PlannerWizard />
      </section>

      {/* ============================================================
          SECTION 5: BONEDI BARI (WARM CREAM VINTAGE EDITORIAL SECTION)
      ============================================================ */}
      <section className="section-cream py-16 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
                Aristocratic Heritage Discovery
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#3A2118] mt-1">
                Bonedi Bari Heritage Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#5C3A2E] max-w-xl mt-2 leading-relaxed">
                Step inside 250-year-old aristocratic courtyards, Thakurdalans, and zamindari palaces where Durga Puja first began in Kolkata.
              </p>
            </div>

            <Link
              href="/bonedi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3A2118] text-[#FFF8EC] hover:bg-[#B93624] text-xs font-bold tracking-wide transition-colors shrink-0 shadow-md"
            >
              <span>Explore All Bonedi Baris</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBonedi.map((bonedi) => (
              <BonediCard key={bonedi.id} bonedi={bonedi} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: CATEGORIES & MUST VISIT SHOWCASE
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D99A3D]">
            Curated Discovery
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FFF8EC] mt-1">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2">
            Whether you seek timeless traditional Ekchala idols or visionary thematic installations.
          </p>
        </div>

        {/* 4 Core Category Filter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore?category=${cat.id}`}
              className="p-4 sm:p-5 rounded-2xl bg-[#0B223D] border border-[#D99A3D]/25 hover:border-[#D99A3D] hover:bg-[#0F2A4A] transition-all group flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl sm:text-3xl mb-2 block">{cat.icon}</span>
                <h3 className="font-editorial text-base sm:text-lg font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#D8CEBE]/70 mt-1 line-clamp-2">
                  {cat.tagline}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#D99A3D]/15 flex items-center justify-between text-[11px] text-[#D99A3D] font-semibold">
                <span>View Pandals</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Must-Visit Grid */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC]">
            🔥 Iconic Must-Visit Highlights
          </h3>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#D99A3D] hover:underline flex items-center gap-1"
          >
            <span>See All ({PANDALS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 8: PUJA 2026 CALENDAR & CULTURAL INFORMATION
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 bg-[#0B223D]/40 border-t border-[#D99A3D]/20">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Calendar Block */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
                Tithi & Dates
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#FFF8EC] mt-1">
                Puja 2026 Calendar
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PUJA_CALENDAR_2026.map((day) => (
                <div
                  key={day.tithi}
                  className={`p-4 rounded-2xl border text-center flex flex-col justify-between ${
                    day.isMainDay
                      ? 'bg-[#0B223D] border-[#D99A3D]/40 shadow-md'
                      : 'bg-[#071A2F] border-[#D99A3D]/15'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#D99A3D]">
                      {day.englishDay}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-[#FFF8EC] mt-1">
                      {day.tithi}
                    </h4>
                    <p className="text-xs text-[#D8CEBE]/80 font-serif">{day.bengaliTithi}</p>
                    <div className="my-2 py-1 px-2 rounded-lg bg-[#071A2F] text-[11px] font-semibold text-[#FFF8EC] border border-[#D99A3D]/20">
                      {day.date2026}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#D8CEBE]/70 line-clamp-3 mt-2 leading-tight">
                    {day.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Information Cards */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D99A3D]">
                Cultural Heritage & Rituals
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#FFF8EC] mt-1">
                The Soul of Kolkata Puja
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CULTURAL_RITUALS.map((ritual) => (
                <div
                  key={ritual.id}
                  className="p-5 rounded-2xl bg-[#0B223D] border border-[#D99A3D]/20 hover:border-[#D99A3D]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B93624]">
                        {ritual.timeframe}
                      </span>
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-[#FFF8EC]">
                      {ritual.name}
                    </h4>
                    <p className="text-xs text-[#D99A3D] font-serif mb-2">{ritual.bengaliName}</p>
                    <p className="text-xs text-[#D8CEBE]/90 leading-relaxed mb-3">
                      {ritual.description}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#D99A3D] italic bg-[#071A2F] p-2.5 rounded-xl border border-[#D99A3D]/15">
                    {ritual.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="px-4 sm:px-8 py-12 bg-[#071A2F] border-t border-[#D99A3D]/25 text-center text-xs text-[#D8CEBE]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="font-editorial text-2xl font-bold text-[#FFF8EC]">
            DUGGA <span className="text-[#B93624]">2026</span>
          </div>
          <p className="text-xs text-[#D99A3D]">
            &quot;Find the Puja. Follow the route. Experience more.&quot;
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium pt-2">
            <Link href="/explore" className="hover:text-[#FFF8EC]">Explore Pandals</Link>
            <span>•</span>
            <Link href="/metro" className="hover:text-[#FFF8EC]">Metro Stations</Link>
            <span>•</span>
            <Link href="/routes" className="hover:text-[#FFF8EC]">Curated Routes</Link>
            <span>•</span>
            <Link href="/bonedi" className="hover:text-[#FFF8EC]">Bonedi Bari</Link>
            <span>•</span>
            <Link href="/planner" className="hover:text-[#FFF8EC]">AI Puja Planner</Link>
            <span>•</span>
            <Link href="/saved" className="hover:text-[#FFF8EC]">Saved Plans</Link>
          </div>
          <p className="text-[11px] text-[#D8CEBE]/60 pt-4">
            Curated Kolkata Durga Puja Guide 2026. Data sourced from official Kolkata Police advisories and heritage directories.
          </p>
        </div>
      </footer>
    </div>
  );
}
