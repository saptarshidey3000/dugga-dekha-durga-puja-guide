'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Route } from '@/data/types';
import { PANDALS } from '@/data/pandals';
import { METRO_STATIONS } from '@/data/metros';
import {
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  Bookmark,
  Footprints,
} from 'lucide-react';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';

interface RouteTimelineProps {
  route: Route;
  onSeeOnMap?: (pandalId: string) => void;
}

export default function RouteTimeline({ route, onSeeOnMap }: RouteTimelineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [savedIds, setSavedIds] = useState<{ [id: string]: boolean }>({});

  const metro = METRO_STATIONS.find((m) => m.id === route.metroStationId);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedIds[id] ?? isPandalSaved(id)) {
      removeSavedPandal(id);
      setSavedIds((prev) => ({ ...prev, [id]: false }));
    } else {
      savePandal(id);
      setSavedIds((prev) => ({ ...prev, [id]: true }));
    }
  };

  const activeStop = route.stops[currentStep];
  const activePandal = activeStop ? PANDALS.find((p) => p.id === activeStop.pandalId) : null;
  const nextStop = route.stops[currentStep + 1];
  const nextPandal = nextStop ? PANDALS.find((p) => p.id === nextStop.pandalId) : null;

  return (
    <div className="space-y-6 text-[#120E0C]">
      {/* Route Header Banner (Section 36 - Authentic Festive Red) */}
      <div className="bg-gradient-to-br from-[#8F1D18] via-[#8F1D18] to-[#241714] text-[#F7F0E2] rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#C9973E]/40 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold tracking-widest uppercase bg-[#241714] text-[#E1BE68] px-3 py-1 rounded-full border border-[#C9973E]/30">
            {route.region}
          </span>
          <div className="flex items-center gap-3 text-xs text-[#F7F0E2]/80 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E1BE68]" /> {route.estimatedDuration}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#E1BE68]" /> {route.totalWalkingDistance}
            </span>
          </div>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 mb-1">
          {route.name}
        </h1>
        <p className="font-editorial text-lg text-[#E1BE68] italic mb-3">
          Pandal Hopping • {route.stopsCount} Stops
        </p>

        <p className="text-xs sm:text-sm text-[#F7F0E2]/90 leading-relaxed mb-4 max-w-xl">
          {route.description}
        </p>

        {/* Starting Point Banner (Section 13, 14, 36) */}
        <div className="bg-[#241714] border border-[#C9973E]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8F1D18] border border-[#C9973E] flex items-center justify-center text-lg">
              🚇
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E1BE68] block">
                STARTING POINT
              </span>
              <p className="font-bold text-sm text-[#F7F0E2]">{route.metroStationName} Metro</p>
            </div>
          </div>
          {route.startingExit && (
            <div className="px-3.5 py-1.5 rounded-full bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold border border-[#C9973E]/50 text-center">
              Take {route.startingExit}
            </div>
          )}
        </div>
      </div>

      {/* Sticky / Prominent Current & Next Stop Banner (Section 15 & 37) */}
      {activePandal && (
        <div className="sticky top-16 z-30 bg-[#241714] text-[#F7F0E2] p-4 rounded-2xl border-2 border-[#C9973E] shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold uppercase tracking-widest text-[#E1BE68]">
              STOP {currentStep + 1} OF {route.stops.length}: {activePandal.name}
            </span>
            {nextPandal && (
              <span className="text-[11px] text-[#F7F0E2]/70 hidden sm:inline">
                Next: {nextPandal.name} ({nextStop?.walkingTime || 'walk'})
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C9973E]/30">
            {nextPandal ? (
              <p className="text-xs text-[#F7F0E2]/90 truncate">
                <span className="text-[#E1BE68] font-semibold">NEXT: </span>
                <span className="font-bold">{nextPandal.name}</span>
                <span className="text-xs text-[#E1BE68] ml-1">
                  🚶 {nextStop?.walkingTime || '4 min'}
                </span>
              </p>
            ) : (
              <p className="text-xs text-[#E1BE68] font-bold">
                🎉 Final Pandal on this route!
              </p>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {onSeeOnMap && activePandal.latitude && (
                <button
                  onClick={() => onSeeOnMap(activePandal.id)}
                  className="px-3 py-1.5 rounded-xl bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold hover:bg-[#B52A22] transition-colors border border-[#C9973E]/40"
                >
                  See on Map
                </button>
              )}
              {nextStop && (
                <button
                  onClick={() => {
                    const next = currentStep + 1;
                    setCurrentStep(next);
                    if (route.stops[next] && onSeeOnMap) onSeeOnMap(route.stops[next].pandalId);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#C9973E] text-[#241714] text-xs font-bold hover:bg-[#E1BE68] transition-colors shadow-sm"
                >
                  Next Stop →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Signature Vertical Timeline (Sections 14, 36) */}
      <div className="relative pl-8 sm:pl-10 border-l-2 border-[#C9973E] space-y-10 my-8 ml-4 sm:ml-6">
        {route.stops.map((stop, idx) => {
          const pandal = PANDALS.find((p) => p.id === stop.pandalId);
          if (!pandal) return null;

          const isSaved = savedIds[pandal.id] ?? isPandalSaved(pandal.id);
          const isCurrent = currentStep === idx;
          const stopNumberFormatted = stop.order < 10 ? `0${stop.order}` : `${stop.order}`;

          return (
            <div key={stop.pandalId} className="relative group">
              {/* Walking time from previous stop */}
              {idx > 0 && (
                <div className="absolute -left-[35px] sm:-left-[43px] -top-6 flex items-center gap-1 text-[11px] font-bold text-[#8F1D18] bg-[#F7F0E2] px-2.5 py-0.5 rounded-full border border-[#C9973E] shadow-sm">
                  <span>↓ 🚶 {stop.walkingTime || '4 min'}</span>
                </div>
              )}

              {/* Red Numbered Circle (Section 14) */}
              <div
                onClick={() => {
                  setCurrentStep(idx);
                  if (onSeeOnMap) onSeeOnMap(pandal.id);
                }}
                className={`cursor-pointer absolute -left-[44px] sm:-left-[52px] top-1 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-lg transition-transform ${
                  isCurrent
                    ? 'bg-[#8F1D18] text-[#E1BE68] border-[#C9973E] scale-110 ring-4 ring-[#C9973E]/30'
                    : 'bg-[#8F1D18] text-[#F7F0E2] border-[#FFFFFF]'
                }`}
              >
                {stopNumberFormatted}
              </div>

              {/* Pandal Stop Card (Section 36) */}
              <div
                className={`rounded-2xl p-5 sm:p-6 border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#FFFFFF] border-[#8F1D18] shadow-xl ring-2 ring-[#8F1D18]/10'
                    : 'bg-[#FFFFFF] border-[#C9973E]/30 hover:border-[#8F1D18] shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F1D18] block mb-0.5">
                      STOP {stopNumberFormatted} • {pandal.area}
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#120E0C]">
                      {pandal.name}
                    </h3>
                    {pandal.bengaliName && (
                      <p className="text-xs text-[#8F1D18] font-serif">{pandal.bengaliName}</p>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSave(pandal.id, e)}
                    aria-label="Save Pandal"
                    className={`p-2 rounded-full border transition-all ${
                      isSaved
                        ? 'bg-[#8F1D18] text-[#F7F0E2] border-[#8F1D18]'
                        : 'bg-[#F7F0E2] text-[#8F1D18] border-[#C9973E]/40 hover:text-[#B52A22]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4E46] leading-relaxed mb-4">
                  {pandal.description}
                </p>

                {/* Walking Information (Section 36) */}
                {stop.instruction && (
                  <div className="bg-[#F7F0E2] p-3 rounded-xl border border-[#C9973E]/30 mb-4 text-xs text-[#120E0C] flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-[#8F1D18] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#8F1D18]">Walking Direction: </span>
                      <span className="text-[#5A4E46]">{stop.instruction}</span>
                      {stop.walkingDistance && (
                        <span className="ml-1 text-[#8F1D18] font-semibold">({stop.walkingDistance})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions: [ SEE ON MAP ] and View Pandal */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#C9973E]/20">
                  <div className="flex items-center gap-2">
                    {onSeeOnMap && pandal.latitude && (
                      <button
                        onClick={() => {
                          setCurrentStep(idx);
                          onSeeOnMap(pandal.id);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7F0E2] text-[#8F1D18] border border-[#C9973E]/40 text-xs font-bold hover:bg-[#EEE1C8] transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>SEE ON MAP</span>
                      </button>
                    )}

                    <Link
                      href={`/pandal/${pandal.id}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold hover:bg-[#B52A22] transition-colors shadow-sm"
                    >
                      <span>Pandal Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68]" />
                    </Link>
                  </div>

                  {idx < route.stops.length - 1 && (
                    <span className="text-xs text-[#8F1D18] font-bold">
                      ↓ NEXT: {PANDALS.find((p) => p.id === route.stops[idx + 1].pandalId)?.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
