'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Footprints,
  Train,
  Clock,
  Layers,
  Calendar,
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
import CircuitCard from '@/components/CircuitCard';
import MetroStationCard from '@/components/MetroStationCard';
import BonediCard from '@/components/BonediCard';
import PlannerWizard from '@/components/PlannerWizard';
import dynamic from 'next/dynamic';

// Leaflet map dynamically imported without SSR
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#FFFFFF] flex items-center justify-center text-[#7E1815] text-sm animate-pulse rounded-2xl border border-[#D6A13A]/30">
      Loading Kolkata Route Map...
    </div>
  ),
});

export default function HomePage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('South Kolkata');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('kalighat-chetla-trail');
  const [circuitRegionFilter, setCircuitRegionFilter] = useState<Region>('South Kolkata');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [mapSelectedPandalId, setMapSelectedPandalId] = useState<string | null>(null);

  const activeRoute = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];
  const activeRoutePandals = activeRoute.stops
    .map((s) => PANDALS.find((p) => p.id === s.pandalId))
    .filter(Boolean) as typeof PANDALS;
  const activeRouteMetro = METRO_STATIONS.find((m) => m.id === activeRoute.metroStationId);

  // Curated Must-Visit pandals with category filtering
  const mustVisitPandals = PANDALS.filter((p) => {
    if (activeCategoryFilter === 'all') return p.category.includes('must-visit');
    return p.category.includes(activeCategoryFilter as PandalCategory);
  }).slice(0, 6);

  // Circuits filtered by region
  const filteredCircuits = ROUTES.filter((r) => r.region === circuitRegionFilter);

  // Key Metro Hubs for Station Cards (Section 80)
  const keyMetroHubs = METRO_STATIONS.slice(0, 6);

  // 4 Featured Bonedi Baris
  const featuredBonedi = BONEDI_BARIS.slice(0, 4);

  const regions: { id: Region; label: string; count: number; metroHub: string }[] = [
    { id: 'South Kolkata', label: 'South Kolkata', count: 18, metroHub: 'Kalighat • Deshapriya' },
    { id: 'North Kolkata', label: 'North Kolkata', count: 18, metroHub: 'Sovabazar • Shyambazar' },
    { id: 'Central Kolkata', label: 'Central Kolkata', count: 7, metroHub: 'MG Road • Central' },
    { id: 'East / West Metro', label: 'East / West Metro', count: 4, metroHub: 'Salt Lake • Karunamoyee' },
  ];

  return (
    <div className="w-full bg-[#F8F0DF] text-[#171311]">
      {/* ============================================================
          SECTION 74 & 84: HERO (DARK CINEMATIC WITH ARTWORK & RED GRADIENT)
      ============================================================ */}
      <section className="relative min-h-[92vh] sm:min-h-[88vh] flex flex-col justify-end px-4 sm:px-8 pb-12 sm:pb-16 pt-8 overflow-hidden bg-[#35120F]">
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

          {/* Cinematic Red / Burgundy Gradient Overlay (Section 74) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#35120F] via-[#7E1815]/80 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#35120F]/90 via-transparent to-[#35120F]/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#35120F]/90 border border-[#D6A13A]/50 text-[#E7C46A] text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#B52B20] animate-ping" />
            <span>KOLKATA DURGA PUJA 2026</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F8F0DF] leading-[1.08] tracking-tight mb-4 drop-shadow-md">
            Find the Puja. <br />
            <span className="text-[#E7C46A] italic font-serif">Follow the route.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#F8F0DF]/90 max-w-xl font-normal leading-relaxed mb-8 drop-shadow">
            Curated pandal routes, Metro exit guides, and practical walking itineraries to experience more with zero wasted travel.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md">
            <Link
              href="#metro-guide"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B52B20] to-[#7E1815] text-[#F8F0DF] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#7E1815]/50 border border-[#D6A13A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4 text-[#E7C46A]" />
              <span>EXPLORE PUJA</span>
            </Link>

            <Link
              href="/planner"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#35120F]/90 hover:bg-[#7E1815] text-[#E7C46A] hover:text-[#F8F0DF] font-bold text-xs sm:text-sm tracking-wider uppercase border border-[#D6A13A]/50 backdrop-blur-md transition-all hover:scale-[1.02] shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#E7C46A]" />
              <span>PLAN MY PUJA</span>
            </Link>
          </div>

          {/* Signature Dugga Philosophy Micro-ticker */}
          <div className="mt-8 pt-6 border-t border-[#D6A13A]/25 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#F8F0DF]/85">
            <span className="text-[#E7C46A] font-bold uppercase tracking-wider">The Dugga Way:</span>
            <span className="bg-[#35120F]/70 px-2 py-0.5 rounded border border-[#D6A13A]/30">🚇 Metro Exit</span>
            <span className="text-[#E7C46A]">→</span>
            <span className="bg-[#35120F]/70 px-2 py-0.5 rounded border border-[#D6A13A]/30">🚶 Walk</span>
            <span className="text-[#E7C46A]">→</span>
            <span className="bg-[#35120F]/70 px-2 py-0.5 rounded border border-[#D6A13A]/30">🛕 Pandal</span>
            <span className="text-[#E7C46A]">→</span>
            <span className="bg-[#35120F]/70 px-2 py-0.5 rounded border border-[#D6A13A]/30">🗺️ Next Stop</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 85: QUICK ACTIONS (THUMB-FRIENDLY BUTTONS BELOW HERO)
      ============================================================ */}
      <section className="px-4 sm:px-8 -mt-6 sm:-mt-8 relative z-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FFFFFF] p-3 sm:p-4 rounded-2xl sm:rounded-full border border-[#D6A13A]/40 shadow-xl shadow-[#7E1815]/10">
          <Link
            href="/explore"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF] text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
          >
            <Compass className="w-4 h-4 text-[#E7C46A]" />
            <span>EXPLORE PANDALS</span>
          </Link>

          <Link
            href="/planner"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#F8F0DF] hover:bg-[#EFE2C7] text-[#7E1815] border border-[#D6A13A]/60 text-xs font-bold tracking-wider uppercase transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#B52B20]" />
            <span>PLAN MY PUJA</span>
          </Link>

          <Link
            href="#metro-guide"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#F8F0DF] hover:bg-[#EFE2C7] text-[#7E1815] border border-[#D6A13A]/60 text-xs font-bold tracking-wider uppercase transition-all active:scale-95"
          >
            <Train className="w-4 h-4 text-[#B52B20]" />
            <span>METRO GUIDE</span>
          </Link>
        </div>
      </section>

      {/* ============================================================
          SECTION 84.3: EXPLORE BY AREA (WARM OFF-WHITE EDITORIAL)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
            Geographic Discovery
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171311] mt-1">
            Choose Your Kolkata Region
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4E46] mt-2">
            Organized around primary Metro arteries for effortless travel across North, South, Central, and Salt Lake.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regions.map((reg) => (
            <Link
              key={reg.id}
              href={`/explore?region=${encodeURIComponent(reg.id)}`}
              className="group p-5 rounded-2xl bg-[#FFFFFF] border border-[#D6A13A]/30 hover:border-[#D6A13A] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-[#F8F0DF] border border-[#D6A13A]/40 flex items-center justify-center text-[#7E1815]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] font-bold text-[#7E1815] bg-[#F8F0DF] px-2.5 py-0.5 rounded-full border border-[#D6A13A]/30">
                    {reg.count} Pandals
                  </span>
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors">
                  {reg.label}
                </h3>
                <p className="text-xs text-[#5A4E46] mt-1 font-medium">
                  Metro Hubs: <span className="text-[#171311] font-semibold">{reg.metroHub}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#B52B20] font-bold mt-4 pt-3 border-t border-[#D6A13A]/20 group-hover:translate-x-1 transition-transform">
                <span>View Regional Pandals</span>
                <ChevronRight className="w-4 h-4 text-[#D6A13A]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 75 & 76: PUJA CIRCUITS (POSTER CARDS)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 bg-[#EFE2C7] border-y border-[#D6A13A]/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
                Curated Walking Trails
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171311] mt-1">
                Puja Circuits
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4E46] max-w-xl mt-1.5 leading-relaxed">
                Pre-routed walking circuits engineered around Metro stations. Zero guesswork, zero backtracking.
              </p>
            </div>

            {/* Region Filter Chips */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(['South Kolkata', 'North Kolkata', 'Central Kolkata', 'East / West Metro'] as Region[]).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => setCircuitRegionFilter(r)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      circuitRegionFilter === r
                        ? 'bg-[#7E1815] text-[#F8F0DF] border-[#D6A13A] shadow-md'
                        : 'bg-[#FFFFFF] text-[#5A4E46] border-[#D6A13A]/35 hover:border-[#D6A13A]'
                    }`}
                  >
                    {r}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Circuit Cards Grid (Section 76) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCircuits.map((route) => (
              <CircuitCard key={route.id} route={route} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/routes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7E1815] hover:bg-[#B52B20] text-[#F8F0DF] text-xs font-bold tracking-wider uppercase shadow-md transition-all"
            >
              <span>EXPLORE ALL PUJA CIRCUITS</span>
              <ArrowRight className="w-4 h-4 text-[#E7C46A]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 77 & 78: MUST-VISIT PANDALS (OFF-WHITE EDITORIAL)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
              Curated Masterpieces
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#171311] mt-1">
              🔥 Must-Visit Pandals
            </h2>
            <p className="text-xs sm:text-sm text-[#5A4E46] max-w-xl mt-1 leading-relaxed">
              Kolkata’s legendary pandals selected for their architectural daring, spiritual grandeur, and cultural significance.
            </p>
          </div>

          {/* Category Visual Chips (Section 83) */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'must-visit', label: '🔥 Must Visit' },
              { id: 'best-theme', label: '🎨 Best Theme' },
              { id: 'traditional', label: '🛕 Traditional' },
              { id: 'heritage', label: '🏛️ Heritage' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all ${
                  activeCategoryFilter === cat.id
                    ? 'chip-category-selected'
                    : 'chip-category hover:border-[#D6A13A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pandal Cards Grid (Section 77 & 78) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mustVisitPandals.map((pandal) => (
            <PandalCard
              key={pandal.id}
              pandal={pandal}
              onSeeOnMap={(id) => {
                setMapSelectedPandalId(id);
                const el = document.getElementById('metro-guide');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFFFF] hover:bg-[#F8F0DF] text-[#7E1815] border border-[#D6A13A]/50 text-xs font-bold tracking-wider uppercase shadow-sm transition-all"
          >
            <span>VIEW ALL ({PANDALS.length}) PANDALS</span>
            <ArrowRight className="w-4 h-4 text-[#B52B20]" />
          </Link>
        </div>
      </section>

      {/* ============================================================
          SECTION 79, 80, 90, 91: METRO PUJA GUIDE & SIGNATURE METRO HUBS (RED SECTION)
      ============================================================ */}
      <section id="metro-guide" className="px-4 sm:px-8 py-16 bg-gradient-to-b from-[#7E1815] to-[#35120F] text-[#F8F0DF] border-y border-[#D6A13A]/30">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E7C46A]">
                The Signature Dugga Navigation
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F8F0DF] mt-1">
                Metro Puja Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#F8F0DF]/90 max-w-xl mt-2 leading-relaxed">
                Metro Exit → Walking Direction → Pandal Order → Next Stop. Follow Kolkata’s easiest transit-first itinerary.
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
                        ? 'bg-[#B52B20] text-[#F8F0DF] border-[#D6A13A] shadow-md'
                        : 'bg-[#35120F] text-[#F8F0DF]/80 border-[#D6A13A]/30 hover:border-[#D6A13A]'
                    }`}
                  >
                    {r}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Route Selector Sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {ROUTES.filter((r) => r.region === selectedRegion).map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                  selectedRouteId === route.id
                    ? 'bg-[#E7C46A] text-[#7E1815] border-[#E7C46A] font-bold shadow-md'
                    : 'bg-[#35120F]/80 text-[#F8F0DF] border-[#D6A13A]/30 hover:bg-[#7E1815]'
                }`}
              >
                🚇 {route.name} ({route.stopsCount} stops)
              </button>
            ))}
          </div>

          {/* SPLIT INTERFACE: ROUTE TIMELINE (LEFT) & INTERACTIVE MAP (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Route Timeline with signature 01, 02, 03 circular markers */}
            <div className="lg:col-span-7">
              <RouteTimeline
                route={activeRoute}
                onSeeOnMap={(pandalId) => setMapSelectedPandalId(pandalId)}
              />
            </div>

            {/* Right: Sticky Interactive Map (Section 89: off-white map container) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <div className="bg-[#FFFFFF] text-[#171311] border border-[#D6A13A]/50 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#7E1815] uppercase tracking-wider">
                    Interactive Route Map
                  </span>
                  <span className="text-[#5A4E46] font-semibold">
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

                <div className="mt-3 pt-3 border-t border-[#D6A13A]/25 flex items-center justify-between text-xs text-[#5A4E46]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#7E1815] border border-[#D6A13A] inline-flex items-center justify-center text-[9px] text-[#F8F0DF]">
                      🚇
                    </span>
                    <span>Metro Exit Gate</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#D6A13A] text-[#7E1815] text-[9px] font-bold inline-flex items-center justify-center">
                      01
                    </span>
                    <span>Stop Order</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 80: Curated Metro Station Cards */}
          <div className="pt-8 border-t border-[#D6A13A]/25">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E7C46A]">
                  Primary Stations
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F8F0DF] mt-0.5">
                  Explore by Metro Hub
                </h3>
              </div>
              <Link
                href="/metro"
                className="text-xs font-bold text-[#E7C46A] hover:underline flex items-center gap-1"
              >
                <span>All Metro Stations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyMetroHubs.map((station) => (
                <MetroStationCard key={station.id} metro={station} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 93: BONEDI BARI HERITAGE GUIDE (HERITAGE WARM CANVAS)
      ============================================================ */}
      <section className="py-16 px-4 sm:px-8 bg-[#F8F0DF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
                Aristocratic Heritage Discovery
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#7E1815] mt-1">
                Bonedi Bari Heritage Guide
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4E46] max-w-xl mt-2 leading-relaxed">
                Step inside 250-year-old aristocratic courtyards, Thakurdalans, and zamindari palaces where Durga Puja first began in Kolkata.
              </p>
            </div>

            <Link
              href="/bonedi"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7E1815] text-[#F8F0DF] hover:bg-[#B52B20] text-xs font-bold tracking-wider uppercase transition-colors shrink-0 shadow-md"
            >
              <span>Explore All Bonedi Baris</span>
              <ArrowRight className="w-4 h-4 text-[#E7C46A]" />
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
          SECTION 84.8: AI PUJA PLANNER (CUSTOM ITINERARY GENERATOR)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
            Smart Itinerary Generator
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#171311] mt-1">
            Build Your Custom Puja Plan
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4E46] mt-2">
            Have 4 hours at Kalighat or 6 hours in North Kolkata? Let the algorithm calculate the exact walking sequence and visit times.
          </p>
        </div>

        <PlannerWizard />
      </section>

      {/* ============================================================
          SECTION 8: PUJA 2026 CALENDAR & CULTURAL INFORMATION
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 bg-[#EFE2C7] border-t border-[#D6A13A]/30">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Calendar Block */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
                Tithi & Dates
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#171311] mt-1">
                Puja 2026 Calendar
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PUJA_CALENDAR_2026.map((day) => (
                <div
                  key={day.tithi}
                  className={`p-4 rounded-2xl border text-center flex flex-col justify-between ${
                    day.isMainDay
                      ? 'bg-[#FFFFFF] border-[#D6A13A] shadow-md ring-1 ring-[#D6A13A]/30'
                      : 'bg-[#F8F0DF] border-[#D6A13A]/25'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#B52B20]">
                      {day.englishDay}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-[#171311] mt-1">
                      {day.tithi}
                    </h4>
                    <p className="text-xs text-[#7E1815] font-serif">{day.bengaliTithi}</p>
                    <div className="my-2 py-1 px-2 rounded-lg bg-[#EFE2C7] text-[11px] font-bold text-[#7E1815] border border-[#D6A13A]/30">
                      {day.date2026}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#5A4E46] line-clamp-3 mt-2 leading-tight">
                    {day.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Information Cards */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
                Cultural Heritage & Rituals
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#171311] mt-1">
                The Soul of Kolkata Puja
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CULTURAL_RITUALS.map((ritual) => (
                <div
                  key={ritual.id}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D6A13A]/30 hover:border-[#D6A13A] transition-all flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B52B20]">
                        {ritual.timeframe}
                      </span>
                    </div>
                    <h4 className="font-editorial text-xl font-bold text-[#171311]">
                      {ritual.name}
                    </h4>
                    <p className="text-xs text-[#7E1815] font-serif mb-2">{ritual.bengaliName}</p>
                    <p className="text-xs text-[#5A4E46] leading-relaxed mb-3">
                      {ritual.description}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#7E1815] italic bg-[#F8F0DF] p-2.5 rounded-xl border border-[#D6A13A]/25">
                    {ritual.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER (DEEP RED / BURGUNDY WITH ANTIQUE GOLD ACCENTS)
      ============================================================ */}
      <footer className="px-4 sm:px-8 py-12 bg-[#35120F] border-t border-[#D6A13A]/40 text-center text-xs text-[#F8F0DF]/80">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="font-editorial text-2xl font-bold text-[#F8F0DF]">
            DUGGA <span className="text-[#E7C46A]">2026</span>
          </div>
          <p className="text-xs text-[#E7C46A] italic">
            &quot;Find the Puja. Follow the route. Experience more.&quot;
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium pt-2 text-[#F8F0DF]/90">
            <Link href="/explore" className="hover:text-[#E7C46A]">Explore Pandals</Link>
            <span className="text-[#D6A13A]">•</span>
            <Link href="/metro" className="hover:text-[#E7C46A]">Metro Stations</Link>
            <span className="text-[#D6A13A]">•</span>
            <Link href="/routes" className="hover:text-[#E7C46A]">Curated Routes</Link>
            <span className="text-[#D6A13A]">•</span>
            <Link href="/bonedi" className="hover:text-[#E7C46A]">Bonedi Bari</Link>
            <span className="text-[#D6A13A]">•</span>
            <Link href="/planner" className="hover:text-[#E7C46A]">AI Puja Planner</Link>
            <span className="text-[#D6A13A]">•</span>
            <Link href="/saved" className="hover:text-[#E7C46A]">Saved Plans</Link>
          </div>
          <p className="text-[11px] text-[#F8F0DF]/60 pt-4">
            Curated Kolkata Durga Puja Guide 2026. Data sourced from official Kolkata Police advisories and heritage directories.
          </p>
        </div>
      </footer>
    </div>
  );
}
