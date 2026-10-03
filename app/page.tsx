'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Train, Landmark, MapPin, Footprints } from 'lucide-react';
import { ROUTES } from '@/data/routes';

export default function HomePage() {
  // 4 Popular Metro Routes (Section 29)
  const popularRoutes = [
    ROUTES.find((r) => r.id === 'kalighat-chetla-trail') || ROUTES[0],
    ROUTES.find((r) => r.id === 'sovabazar-kumartuli-trail') || ROUTES[1],
    ROUTES.find((r) => r.id === 'deshapriya-gariahat-circuit') || ROUTES[2],
    ROUTES.find((r) => r.id === 'college-square-central-trail') || ROUTES[3],
  ];

  return (
    <div className="w-full bg-[#F7F0E2] text-[#120E0C]">
      {/* ============================================================
          SECTION 07 & 29: HERO (NO COLOR OVERLAY, SUBTLE BLURRED ARTWORK)
      ============================================================ */}
      <section className="relative min-h-[85vh] sm:min-h-[80vh] flex flex-col justify-end px-4 sm:px-8 pb-14 sm:pb-20 pt-10 overflow-hidden bg-[#241714]">
        {/* Background Artwork - Vertical for mobile, Horizontal for tablet/desktop */}
        {/* Only blurred a little bit, NO dark red or color tint overlay covering the artwork */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(min-width: 768px)" srcSet="/hopping-laptop-tab.png" />
            <img
              src="/pujo-mobile.png"
              alt="Kolkata Durga Puja Artwork"
              className="w-full h-full object-cover object-top blur-[2px] scale-105"
            />
          </picture>
        </div>

        {/* Hero Content (Section 07) */}
        <div className="relative z-10 max-w-3xl mx-auto w-full text-center sm:text-left bg-[#120E0C]/75 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-[#C9973E]/40 shadow-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-[#241714] border border-[#C9973E]/50 text-[#E1BE68] text-xs font-bold tracking-widest uppercase mb-3">
            KOLKATA DURGA PUJA 2026
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F7F0E2] tracking-tight leading-[1.05] drop-shadow-md mb-2">
            DUGGA DEKHA
          </h1>

          <p className="font-editorial text-xl sm:text-3xl text-[#E1BE68] italic mb-6">
            Explore Puja. Follow the route.
          </p>

          {/* Only ONE primary action (Section 07) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <a
              href="#discovery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-bold text-sm tracking-wider uppercase shadow-2xl shadow-[#8F1D18]/50 border border-[#C9973E]/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>EXPLORE PUJA</span>
              <ArrowRight className="w-4 h-4 text-[#E1BE68]" />
            </a>
          </div>

          {/* Optional tiny secondary text (Section 07) */}
          <p className="text-[11px] sm:text-xs text-[#F7F0E2]/80 tracking-wider uppercase mt-6 font-medium">
            Metro Guides · Pandal Routes · Bonedi Bari
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 08 & 29: WHAT ARE YOU LOOKING FOR? (TWO MAJOR JOURNEYS)
      ============================================================ */}
      <section id="discovery" className="px-4 sm:px-8 py-16 max-w-5xl mx-auto scroll-mt-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F1D18]">
            Start Your Journey
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#120E0C] mt-1">
            What Are You Looking For?
          </h2>
          <p className="text-xs sm:text-sm text-[#5A4E46] mt-2">
            Choose your preferred way to experience Kolkata Durga Puja 2026.
          </p>
        </div>

        {/* 2 Primary Decision Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Metro Puja Guide */}
          <Link
            href="/metro"
            className="group relative rounded-3xl p-7 sm:p-8 bg-gradient-to-br from-[#8F1D18] to-[#241714] text-[#F7F0E2] border-2 border-[#C9973E]/40 hover:border-[#C9973E] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#241714] border border-[#C9973E]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Train className="w-7 h-7 text-[#E1BE68]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E1BE68]">
                Primary Experience
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2] mt-1 mb-2">
                METRO PUJA GUIDE
              </h3>
              <p className="text-xs sm:text-sm text-[#F7F0E2]/85 leading-relaxed">
                Explore pandals through Kolkata&apos;s Metro network. Pick a station, step out the right exit gate, and follow a curated sequence.
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
            className="group relative rounded-3xl p-7 sm:p-8 bg-[#FFFFFF] text-[#120E0C] border-2 border-[#C9973E]/40 hover:border-[#8F1D18] shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#F7F0E2] border border-[#C9973E]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Landmark className="w-7 h-7 text-[#8F1D18]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8F1D18]">
                Heritage Courtyards
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#120E0C] mt-1 mb-2">
                BONEDI BARI GUIDE
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4E46] leading-relaxed">
                Discover Kolkata&apos;s traditional household Pujas celebrated inside 300-year-old aristocratic Thakurdalans.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#C9973E]/30 flex items-center justify-between text-xs font-bold text-[#8F1D18]">
              <span>Explore Heritage Enclaves</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================
          SECTION 29: FEATURED SECTION (POPULAR METRO ROUTES)
      ============================================================ */}
      <section className="px-4 sm:px-8 py-16 bg-[#EEE1C8]/40 border-t border-[#C9973E]/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F1D18]">
                Curated Walking Circuits
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-extrabold text-[#120E0C] mt-1">
                Popular Metro Routes
              </h2>
              <p className="text-xs sm:text-sm text-[#5A4E46] mt-1">
                Arrive at the Metro station, follow the verified sequence, and hop pandals on foot.
              </p>
            </div>

            <Link
              href="/metro"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1D18] hover:text-[#B52A22]"
            >
              <span>View All Regional Metro Hubs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of 4 Popular Routes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-[#FFFFFF] border border-[#C9973E]/30 hover:border-[#C9973E] rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8F1D18] text-[#F7F0E2]">
                      {route.region}
                    </span>
                    <span className="text-xs font-bold text-[#8F1D18]">
                      {route.stopsCount} Stops
                    </span>
                  </div>

                  <div>
                    <h3 className="font-editorial text-lg font-bold text-[#120E0C] leading-snug">
                      {route.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#5A4E46] mt-1">
                      <MapPin className="w-3 h-3 text-[#B52A22]" />
                      <span>{route.metroStationName}</span>
                      {route.startingExit && (
                        <span className="text-[#8F1D18] font-semibold">({route.startingExit})</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#5A4E46] line-clamp-2 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="text-[11px] text-[#5A4E46] flex items-center gap-2 pt-2 border-t border-[#C9973E]/20">
                    <span>🚶 {route.totalWalkingDistance}</span>
                    <span>•</span>
                    <span>⏱️ {route.estimatedDuration}</span>
                  </div>
                </div>

                <Link
                  href={`/route/${route.id}`}
                  className="mt-4 w-full py-2.5 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
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
          FOOTER WITH DUGGA DEKHA BRANDING
      ============================================================ */}
      <footer className="border-t border-[#C9973E]/30 py-10 px-4 sm:px-8 bg-[#241714] text-[#F7F0E2] text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-editorial text-lg font-extrabold text-[#E1BE68]">
            DUGGA DEKHA · KOLKATA DURGA PUJA 2026
          </p>
          <p className="text-[11px] text-[#F7F0E2]/90">
            &quot;Dugga Dekha tells you where to start and where to go next.&quot;
          </p>
          <p className="text-[11px] text-[#F7F0E2]/60">
            Curated Kolkata Metro & Bonedi Bari walking guide. No AI generators. No SaaS clutter.
          </p>
        </div>
      </footer>
    </div>
  );
}
