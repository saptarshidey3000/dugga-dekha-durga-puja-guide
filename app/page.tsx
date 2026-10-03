'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Train, Landmark, MapPin, Footprints } from 'lucide-react';
import { ROUTES } from '@/data/routes';
import DuggaLogo from '@/components/DuggaLogo';

export default function HomePage() {
  // 4 Popular Metro Routes (including Dum Dum Area)
  const popularRoutes = [
    ROUTES.find((r) => r.id === 'kalighat-chetla-trail') || ROUTES[0],
    ROUTES.find((r) => r.id === 'dum-dum-park-trail') || ROUTES[1],
    ROUTES.find((r) => r.id === 'sovabazar-kumartuli-trail') || ROUTES[2],
    ROUTES.find((r) => r.id === 'deshapriya-gariahat-circuit') || ROUTES[3],
  ];

  return (
    <div className="w-full bg-transparent text-[#F7F0E2]">
      {/* ============================================================
          HERO (VIBRANT PUJA ARTWORK IN BACKGROUND, DARK TRANSLUCENT CONTAINER)
      ============================================================ */}
      <section className="relative min-h-[80vh] sm:min-h-[75vh] flex flex-col justify-center px-4 sm:px-8 py-12 sm:py-20 overflow-hidden">
        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto w-full text-center sm:text-left bg-[#120E0C]/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl border-2 border-[#C9973E]/50 shadow-2xl">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#8F1D18] border border-[#C9973E]/60 text-[#E1BE68] text-xs font-black tracking-widest uppercase mb-3 shadow-sm">
            KOLKATA DURGA PUJA 2026
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F7F0E2] tracking-tight leading-[1.05] drop-shadow-md mb-2">
            DUGGA DEKHA
          </h1>

          <p className="font-editorial text-xl sm:text-3xl text-[#E1BE68] italic mb-6">
            Explore Puja. Follow the route.
          </p>

          {/* Primary Action: Links directly to Metro Guide */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Link
              href="/metro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-black text-sm tracking-wider uppercase shadow-2xl shadow-[#8F1D18]/50 border border-[#C9973E]/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>EXPLORE PUJA</span>
              <ArrowRight className="w-4 h-4 text-[#E1BE68]" />
            </Link>
            <a
              href="#discovery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#241714]/90 hover:bg-[#241714] text-[#E1BE68] font-bold text-xs tracking-wider uppercase border border-[#C9973E]/40 transition-all shadow-md"
            >
              <span>All Guides</span>
            </a>
          </div>

          {/* Secondary reassurance text */}
          <p className="text-[11px] sm:text-xs text-[#F7F0E2]/80 tracking-wider uppercase mt-6 font-semibold">
            Metro Guides · Pandal Routes · Bonedi Bari
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION: WHAT ARE YOU LOOKING FOR? (TWO MAJOR JOURNEYS)
      ============================================================ */}
      <section id="discovery" className="px-4 sm:px-8 py-16 max-w-5xl mx-auto scroll-mt-14">
        <div className="text-center max-w-xl mx-auto mb-10 bg-[#120E0C]/85 backdrop-blur-md p-6 rounded-3xl border border-[#C9973E]/40 shadow-xl">
          <span className="text-xs font-black uppercase tracking-widest text-[#E1BE68]">
            Start Your Journey
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#F7F0E2] mt-1">
            What Are You Looking For?
          </h2>
          <p className="text-xs sm:text-sm text-[#F7F0E2]/85 mt-2">
            Choose your preferred way to experience Kolkata Durga Puja 2026.
          </p>
        </div>

        {/* 2 Primary Decision Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Metro Puja Guide */}
          <Link
            href="/metro"
            className="group relative rounded-3xl p-7 sm:p-8 bg-[#120E0C]/90 backdrop-blur-md hover:bg-[#120E0C] text-[#F7F0E2] border-2 border-[#C9973E]/40 hover:border-[#E1BE68] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#8F1D18] border border-[#C9973E]/60 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Train className="w-7 h-7 text-[#E1BE68]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E1BE68]">
                Primary Experience
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2] mt-1 mb-2">
                METRO PUJA GUIDE
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F0E2]/85 leading-relaxed">
                Explore pandals through Kolkata&apos;s Metro network. Pick a station, step out the right exit gate, and follow a curated sequence across 5 regions.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#C9973E]/30 flex items-center justify-between text-xs font-bold text-[#E1BE68]">
              <span>Choose Region & Metro</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Bonedi Bari */}
          <Link
            href="/bonedi"
            className="group relative rounded-3xl p-7 sm:p-8 bg-[#120E0C]/90 backdrop-blur-md hover:bg-[#120E0C] text-[#F7F0E2] border-2 border-[#C9973E]/40 hover:border-[#E1BE68] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#241714] border border-[#C9973E]/60 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-7 h-7 text-[#E1BE68]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E1BE68]">
                Heritage Courtyards
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2] mt-1 mb-2">
                BONEDI BARI GUIDE
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F0E2]/85 leading-relaxed">
                Discover Kolkata&apos;s traditional household Pujas celebrated inside 300-year-old aristocratic Thakurdalans with authentic photos and walking enclaves.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#C9973E]/30 flex items-center justify-between text-xs font-bold text-[#E1BE68]">
              <span>Explore Heritage Enclaves</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================
          POPULAR METRO ROUTES (FEATURED)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#120E0C]/85 backdrop-blur-md p-6 rounded-3xl border border-[#C9973E]/40">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E1BE68]">
                Curated Walking Circuits
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#F7F0E2] mt-1">
                Popular Metro Routes
              </h2>
              <p className="text-xs sm:text-sm text-[#F7F0E2]/80 mt-1">
                Arrive at the Metro station, follow the verified sequence, and hop pandals on foot.
              </p>
            </div>

            <Link
              href="/metro"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E1BE68] hover:text-[#F7F0E2]"
            >
              <span>View All 5 Regions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of 4 Popular Routes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 hover:border-[#E1BE68] rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/40">
                      {route.region}
                    </span>
                    <span className="text-xs font-bold text-[#E1BE68]">
                      {route.stopsCount} Stops
                    </span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#F7F0E2] leading-snug">
                      {route.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#E1BE68] mt-1">
                      <MapPin className="w-3 h-3 text-[#E1BE68]" />
                      <span>{route.metroStationName}</span>
                      {route.startingExit && (
                        <span className="text-[#F7F0E2]/70 font-semibold">({route.startingExit})</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#F7F0E2]/80 line-clamp-2 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="text-[11px] text-[#E1BE68] flex items-center gap-2 pt-2 border-t border-[#C9973E]/30 font-semibold">
                    <span>🚶 {route.totalWalkingDistance}</span>
                    <span>•</span>
                    <span>⏱️ {route.estimatedDuration}</span>
                  </div>
                </div>

                <Link
                  href={`/route/${route.id}`}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md transition-all border border-[#C9973E]/50"
                >
                  <span>START PANDAL HOPPING</span>
                  <ArrowRight className="w-3 h-3 text-[#E1BE68]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER WITH UNIFIED DUGGA LOGO (Section 12)
      ============================================================ */}
      <footer className="border-t border-[#C9973E]/40 py-12 px-4 sm:px-8 bg-[#120E0C]/95 backdrop-blur-xl text-[#F7F0E2] text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-4 flex flex-col items-center">
          <DuggaLogo size="lg" className="justify-center" />
          <p className="text-xs text-[#E1BE68] font-bold">
            &quot;Dugga Dekha tells you where to start and where to go next.&quot;
          </p>
          <p className="text-[11px] text-[#F7F0E2]/70 max-w-md">
            Curated Kolkata Metro & Bonedi Bari walking guide. Leaflet + OpenStreetMap navigation.
          </p>
        </div>
      </footer>
    </div>
  );
}
