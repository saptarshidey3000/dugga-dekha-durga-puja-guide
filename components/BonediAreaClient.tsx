'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BonediBari } from '@/data/types';
import { BonediAreaGroup } from '@/data/bonedi';
import QuickJumpDropdown, { DropdownItem } from '@/components/QuickJumpDropdown';
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Landmark,
  ArrowRight,
  Footprints,
  Eye,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-[#EEE1C8]/60 flex items-center justify-center text-[#8F1D18] text-sm animate-pulse rounded-2xl border border-[#C9973E]/30">
      Loading Heritage Route Map...
    </div>
  ),
});

interface BonediAreaClientProps {
  area: BonediAreaGroup;
  baris: BonediBari[];
}

export default function BonediAreaClient({ area, baris }: BonediAreaClientProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'hopping' | 'list'>('hopping');
  const [selectedBariId, setSelectedBariId] = useState<string | null>(baris[0]?.id || null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  const currentBari = baris[currentStopIndex] || baris[0];
  const nextBari = currentStopIndex < baris.length - 1 ? baris[currentStopIndex + 1] : null;

  const bariDropdownItems: DropdownItem[] = baris.map((b) => ({
    id: b.id,
    title: b.name,
    subtitle: b.bengaliName,
    badge: b.yearEstablished ? `Est. ${b.yearEstablished}` : b.walkingTime || b.nearestMetro,
    highlight: `Metro: ${b.nearestMetro} • ${b.address}`,
    href: `/bonedi/${b.id}`,
    icon: '🏛️',
  }));

  const handleNextStop = () => {
    if (currentStopIndex < baris.length - 1) {
      const nextIdx = currentStopIndex + 1;
      setCurrentStopIndex(nextIdx);
      setSelectedBariId(baris[nextIdx].id);
      const element = document.getElementById(`stop-${baris[nextIdx].id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="bg-transparent min-h-screen py-8 sm:py-12 px-4 sm:px-8 text-[#F7F0E2]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#C9973E]/30">
          <Link
            href="/bonedi"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1D18] hover:text-[#B52A22] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#B52A22]" />
            <span>Back to All Heritage Enclaves</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-[#EEE1C8] border border-[#C9973E]/40 text-xs font-bold">
              <button
                onClick={() => setViewMode('hopping')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'hopping'
                    ? 'bg-[#8F1D18] text-[#F7F0E2] shadow-sm'
                    : 'text-[#241714] hover:text-[#8F1D18]'
                }`}
              >
                🚶 Hopping Route
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#8F1D18] text-[#F7F0E2] shadow-sm'
                    : 'text-[#241714] hover:text-[#8F1D18]'
                }`}
              >
                🏛️ House List
              </button>
            </div>

            {/* Mobile Map Toggle */}
            <button
              onClick={() => setMobileMapOpen(!mobileMapOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EEE1C8] border border-[#C9973E]/40 text-xs font-bold text-[#8F1D18] shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-[#B52A22]" />
              <span>{mobileMapOpen ? 'Hide Map' : 'See on Map'}</span>
            </button>
          </div>
        </div>

        {/* Hero Area Header (Festive Red & Gold) */}
        <div className="bg-gradient-to-br from-[#8F1D18] via-[#8F1D18] to-[#241714] border border-[#C9973E]/40 rounded-3xl p-6 sm:p-10 text-[#F7F0E2] shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#241714] text-[#E1BE68] border border-[#C9973E]/40">
              Heritage Enclave
            </span>
            <span className="text-xs text-[#E1BE68] font-bold tracking-wider uppercase">
              {baris.length} BONEDI BARIS
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F7F0E2]">
            {area.name.toUpperCase()}
          </h1>
          <p className="text-lg text-[#E1BE68] font-serif mt-1">{area.bengaliName}</p>

          <p className="text-xs sm:text-sm text-[#F7F0E2]/90 max-w-2xl mt-4 leading-relaxed">
            {area.description}
          </p>

          <div className="mt-6 pt-5 border-t border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-[#E1BE68]" />
              <span className="font-bold">Nearest Metro:</span>
              <span className="text-[#E1BE68] font-semibold">{area.nearestMetro}</span>
              {area.metroExit && (
                <span className="text-white/80">({area.metroExit})</span>
              )}
            </div>

            {viewMode === 'list' && (
              <button
                onClick={() => setViewMode('hopping')}
                className="px-5 py-2.5 rounded-xl bg-[#E1BE68] text-[#8F1D18] text-xs font-bold uppercase tracking-wider hover:bg-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>START BONEDI BARI HOPPING</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Jump Dropdown for Baris in this Enclave */}
          <div className="mt-5 pt-4 border-t border-[#C9973E]/30">
            <QuickJumpDropdown
              items={bariDropdownItems}
              label={`⚡ Quick Jump to a Bonedi Bari in ${area.name} (${baris.length} Baris):`}
              placeholder={`Select any Bonedi Bari in ${area.name} to jump directly...`}
              icon={<Compass className="w-4 h-4 text-[#E1BE68]" />}
              variant="bonedi"
            />
          </div>
        </div>

        {/* Mobile Map Drawer */}
        {mobileMapOpen && (
          <div className="lg:hidden bg-[#EEE1C8]/90 border border-[#C9973E]/40 p-4 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8F1D18] font-bold uppercase">
              <span>{area.name} Heritage Circuit Map</span>
              <button
                onClick={() => setMobileMapOpen(false)}
                className="text-[#241714] font-bold px-2 py-0.5 rounded bg-[#F7F0E2]"
              >
                Close ✕
              </button>
            </div>
            <InteractiveMap
              bonediBaris={baris}
              selectedPandalId={selectedBariId}
              onSelectPandal={(id) => setSelectedBariId(id)}
              heightClass="h-[340px]"
            />
          </div>
        )}

        {/* VIEW 1: STEP-BY-STEP HOPPING TIMELINE (Section 27) */}
        {viewMode === 'hopping' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Vertical Timeline */}
            <div className="lg:col-span-7 space-y-6">
              {/* Timeline Header Card */}
              <div className="flex items-center justify-between bg-[#EEE1C8]/60 border border-[#C9973E]/30 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block">
                    Curated Heritage Hopping Route
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-[#120E0C]">
                    {area.name} Walking Circuit
                  </h2>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#8F1D18] text-[#F7F0E2]">
                  {baris.length} Stops
                </span>
              </div>

              {/* STARTING POINT CARD */}
              <div className="bg-[#8F1D18] border-2 border-[#C9973E] p-5 rounded-2xl text-[#F7F0E2] shadow-md relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#241714] border-2 border-[#C9973E] flex items-center justify-center text-lg">
                    🚇
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E1BE68] block">
                      STARTING POINT
                    </span>
                    <h3 className="font-editorial text-xl font-bold">
                      {area.nearestMetro} Metro
                    </h3>
                    <p className="text-xs text-[#E1BE68] font-semibold mt-0.5">
                      {area.metroExit || 'Main Gate Exit'}
                    </p>
                  </div>
                </div>
              </div>

              {/* TIMELINE CONNECTOR */}
              <div className="flex items-center justify-center py-2">
                <span className="text-xs font-bold text-[#8F1D18] uppercase tracking-wider">
                  ↓ START HOPPING
                </span>
              </div>

              {/* THE STOPS (01, 02, 03, 04) */}
              <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[3px] before:bg-gradient-to-b before:from-[#C9973E] before:via-[#C9973E] before:to-[#C9973E]/40">
                {baris.map((bari, idx) => {
                  const stopNumber = idx + 1;
                  const formattedNum = stopNumber < 10 ? `0${stopNumber}` : `${stopNumber}`;
                  const isCurrent = currentStopIndex === idx;
                  const isSelected = selectedBariId === bari.id;

                  return (
                    <div
                      key={bari.id}
                      id={`stop-${bari.id}`}
                      className="relative space-y-4"
                    >
                      {/* Red Numbered Circle (Section 14 & 27) */}
                      <div
                        className={`absolute -left-6 sm:-left-10 top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-transform ${
                          isCurrent
                            ? 'bg-[#8F1D18] border-[#E1BE68] text-[#F7F0E2] scale-110 ring-4 ring-[#8F1D18]/20'
                            : isSelected
                            ? 'bg-[#8F1D18] border-[#C9973E] text-[#F7F0E2]'
                            : 'bg-[#C9973E] border-white text-[#120E0C]'
                        }`}
                      >
                        {formattedNum}
                      </div>

                      {/* STOP CARD */}
                      <div
                        onClick={() => {
                          setSelectedBariId(bari.id);
                          setCurrentStopIndex(idx);
                        }}
                        className={`bg-[#EEE1C8]/40 border rounded-2xl p-5 sm:p-6 transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-[#8F1D18] shadow-lg bg-[#EEE1C8]/80'
                            : 'border-[#C9973E]/30 hover:border-[#C9973E]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row gap-5">
                          {/* Image */}
                          <div className="relative h-44 sm:h-36 sm:w-48 rounded-xl overflow-hidden bg-[#241714] shrink-0 border border-[#C9973E]/30">
                            <Image
                              src={bari.image || '/pujo-mobile.png'}
                              alt={bari.name}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 100vw, 192px"
                              className="object-cover"
                            />
                            {bari.yearEstablished && (
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#8F1D18] text-[#F7F0E2]">
                                Est. {bari.yearEstablished}
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 space-y-2 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18]">
                                  STOP {formattedNum} OF {baris.length}
                                </span>
                                <div className="flex items-center gap-2">
                                  {bari.commute ? (
                                    <span className="text-xs font-semibold text-[#8F1D18] flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8F1D18] text-[#F7F0E2]">
                                        {bari.commute.mode === 'WALK' ? '🚶 Walk' : bari.commute.mode === 'BOOK_AUTO' ? '🛺 Auto' : '🚶/🛺 Transit'}
                                      </span>
                                      <span>{bari.commute.durationMinutes} min ({bari.commute.distanceMeters}m · ~{bari.commute.estimatedSteps} steps)</span>
                                    </span>
                                  ) : bari.walkingTime && (
                                    <span className="text-xs font-semibold text-[#8F1D18] flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-[#B52A22]" />
                                      <span>{bari.walkingTime}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h3 className="font-editorial text-2xl font-bold text-[#120E0C] mt-1">
                                {bari.name}
                              </h3>
                              {bari.bengaliName && (
                                <p className="text-xs text-[#C9973E] font-serif">
                                  {bari.bengaliName}
                                </p>
                              )}

                              <p className="text-xs text-[#241714]/80 mt-2 line-clamp-3 leading-relaxed">
                                {bari.description}
                              </p>

                              {bari.directions && (
                                <p className="text-xs text-[#8F1D18] mt-2 font-medium">
                                  👉 {bari.directions}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 pt-3 border-t border-[#C9973E]/20 mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBariId(bari.id);
                                  setCurrentStopIndex(idx);
                                  setMobileMapOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold hover:bg-[#B52A22] transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
                                <span>SEE ON MAP</span>
                              </button>

                              <Link
                                href={`/bonedi/${bari.id}`}
                                className="px-3 py-1.5 rounded-lg bg-[#F7F0E2] border border-[#C9973E]/40 text-[#120E0C] text-xs font-bold hover:border-[#8F1D18] transition-colors flex items-center gap-1"
                              >
                                <span>View History</span>
                                <ArrowRight className="w-3 h-3 text-[#8F1D18]" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DOWN ARROW / NEXT STOP CONNECTOR */}
                      {idx < baris.length - 1 && (() => {
                        const nextStop = baris[idx + 1];
                        return (
                          <div className="flex flex-wrap items-center gap-2 py-2 text-xs font-bold text-[#8F1D18] uppercase tracking-wider pl-2">
                            <span>↓ NEXT STOP:</span>
                            <span className="text-[#120E0C] font-semibold">{nextStop.name}</span>
                            {nextStop.commute ? (
                              <span className="text-[#C9973E] font-medium lowercase">
                                ({nextStop.commute.mode === 'WALK' ? 'walk' : nextStop.commute.mode === 'BOOK_AUTO' ? 'auto' : 'transit'} ~{nextStop.commute.durationMinutes} min · {nextStop.commute.distanceMeters}m · ~{nextStop.commute.estimatedSteps} steps)
                              </span>
                            ) : nextStop.walkingTime && (
                              <span className="text-[#C9973E]">({nextStop.walkingTime})</span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 cols: Sticky Desktop Map (Desktop Route Section 43 & 17) */}
            <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              <div className="bg-[#EEE1C8]/60 border border-[#C9973E]/40 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#8F1D18] uppercase tracking-wider">
                    Heritage Route Navigation
                  </span>
                  <span className="text-[#241714]/70 font-semibold">{baris.length} Stops</span>
                </div>

                <InteractiveMap
                  bonediBaris={baris}
                  selectedPandalId={selectedBariId}
                  onSelectPandal={(id) => {
                    setSelectedBariId(id);
                    const idx = baris.findIndex((b) => b.id === id);
                    if (idx >= 0) setCurrentStopIndex(idx);
                  }}
                  heightClass="h-[520px]"
                />

                <div className="mt-4 pt-3 border-t border-[#C9973E]/20 space-y-2 text-xs text-[#241714]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Nearest Hub:</span>
                    <span className="text-[#8F1D18] font-semibold">{area.nearestMetro}</span>
                  </div>
                  {area.metroExit && (
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Verified Exit:</span>
                      <span className="text-[#B52A22] font-semibold">{area.metroExit}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Selected House:</span>
                    <span className="font-semibold text-[#8F1D18] line-clamp-1">
                      {baris.find((b) => b.id === selectedBariId)?.name || baris[0].name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: HOUSES LIST (Section 26) */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F1D18]">
                {baris.length} Verified Ancestral Residences
              </span>
              <button
                onClick={() => setViewMode('hopping')}
                className="text-xs font-bold text-[#8F1D18] hover:underline flex items-center gap-1"
              >
                <span>Switch to Step-by-Step Walking Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baris.map((bari) => (
                <Link
                  key={bari.id}
                  href={`/bonedi/${bari.id}`}
                  className="bg-[#EEE1C8]/60 border border-[#C9973E]/30 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-[#8F1D18] hover:shadow-xl transition-all cursor-pointer group block text-left"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#241714] border border-[#C9973E]/20">
                      <Image
                        src={bari.image || '/pujo-mobile.png'}
                        alt={bari.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {bari.yearEstablished && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8F1D18] text-[#F7F0E2]">
                          Est. {bari.yearEstablished}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-editorial text-xl font-bold text-[#120E0C] group-hover:text-[#8F1D18] transition-colors">
                        {bari.name}
                      </h3>
                      {bari.bengaliName && (
                        <p className="text-xs text-[#C9973E] font-serif">
                          {bari.bengaliName}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#241714]/80 line-clamp-3 leading-relaxed">
                      {bari.description}
                    </p>

                    <div className="bg-[#F7F0E2] p-2.5 rounded-xl border border-[#C9973E]/20 text-[11px] space-y-1">
                      <div className="font-semibold text-[#8F1D18] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B52A22]" />
                        <span>🚇 {bari.nearestMetro}</span>
                      </div>
                      {bari.directions && (
                        <p className="text-[#241714]/70 line-clamp-2">
                          👉 {bari.directions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#C9973E]/20 mt-4 flex items-center justify-between">
                    <span className="text-xs text-[#8F1D18] font-bold">
                      🚶 {bari.walkingTime || '~5 min'}
                    </span>
                    <div
                      className="px-3.5 py-1.5 rounded-lg bg-[#8F1D18] group-hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold transition-colors"
                    >
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STICKY CURRENT / NEXT STOP BAR ON MOBILE (Sections 15 & 37) */}
      {viewMode === 'hopping' && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 px-3 py-2 pointer-events-none">
          <div className="max-w-md mx-auto bg-[#8F1D18] text-[#F7F0E2] border-2 border-[#C9973E] rounded-2xl p-3 shadow-2xl pointer-events-auto flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1BE68] block">
                STOP {currentStopIndex + 1} OF {baris.length}
              </span>
              <p className="font-editorial text-sm font-bold truncate">
                {currentBari.name}
              </p>
              {nextBari && (
                <p className="text-[11px] text-white/80 truncate">
                  Next: <strong className="text-[#E1BE68]">{nextBari.name}</strong> ({nextBari.walkingTime || 'walk'})
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setMobileMapOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#241714] text-[#E1BE68] border border-[#C9973E] text-xs font-bold"
              >
                Map
              </button>

              {nextBari ? (
                <button
                  onClick={handleNextStop}
                  className="px-3 py-1.5 rounded-lg bg-[#E1BE68] text-[#8F1D18] text-xs font-bold shadow-md hover:bg-white transition-colors"
                >
                  Next →
                </button>
              ) : (
                <span className="px-2.5 py-1 rounded text-[11px] font-bold text-[#E1BE68] border border-[#C9973E]/50">
                  Done ✓
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
