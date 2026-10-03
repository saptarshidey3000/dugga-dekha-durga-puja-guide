'use client';

import React from 'react';
import Link from 'next/link';
import PlannerWizard from '@/components/PlannerWizard';
import { Sparkles, Bookmark, Compass, ArrowRight } from 'lucide-react';

export default function PlannerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 bg-[#F8F0DF] text-[#171311]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#D6A13A]/30">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#B52B20]">
            Smart Itinerary Engine
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#7E1815] mt-1">
            AI Puja Route Planner
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4E46] mt-2 max-w-xl">
            Never waste time deciding where to head next. Our algorithm creates an optimal, practical sequence from your starting Metro station.
          </p>
        </div>

        <Link
          href="/saved"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#D6A13A]/50 text-xs font-bold text-[#7E1815] hover:bg-[#F8F0DF] transition-colors shadow-sm"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#B52B20]" />
          <span>My Saved Plans</span>
        </Link>
      </div>

      {/* Main Wizard */}
      <PlannerWizard />

      {/* How it works info card */}
      <div className="bg-[#FFFFFF] border border-[#D6A13A]/30 rounded-2xl p-6 space-y-3 shadow-sm">
        <h3 className="font-editorial text-lg font-bold text-[#7E1815]">
          How the Dugga Planner Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5A4E46]">
          <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/25">
            <span className="font-bold text-[#7E1815] block mb-1">1. Metro-First Routing</span>
            <p>Routes strictly initiate at verified Metro exit gates to minimize confusion in crowded junctions.</p>
          </div>
          <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/25">
            <span className="font-bold text-[#7E1815] block mb-1">2. Crowd & Walking Pacing</span>
            <p>Calculates walking minutes between adjacent galis and factors visit time based on pandal crowd levels.</p>
          </div>
          <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/25">
            <span className="font-bold text-[#7E1815] block mb-1">3. Offline Client Persistence</span>
            <p>Saves plans directly to your device storage without requiring logins or accounts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
