'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Play,
  RotateCcw,
} from 'lucide-react';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';

interface RouteTimelineProps {
  route: Route;
  onSeeOnMap?: (pandalId: string) => void;
}

export default function RouteTimeline({ route, onSeeOnMap }: RouteTimelineProps) {
  const [tourActive, setTourActive] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
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

  const currentStop = route.stops[currentStopIndex];
  const currentPandal = currentStop ? PANDALS.find((p) => p.id === currentStop.pandalId) : null;
  const nextStop = route.stops[currentStopIndex + 1];
  const nextPandal = nextStop ? PANDALS.find((p) => p.id === nextStop.pandalId) : null;

  return (
    <div className="space-y-6">
      {/* Route Header Banner (Red / Burgundy Poster style) */}
      <div className="bg-gradient-to-br from-[#7E1815] via-[#7E1815] to-[#35120F] border border-[#D6A13A]/40 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-[#F8F0DF]">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6A13A]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#35120F] text-[#E7C46A] border border-[#D6A13A]/40 shadow-sm">
            {route.region}
          </span>
          <div className="flex items-center gap-3 text-xs text-[#F8F0DF]/90 font-medium">
            <span className="flex items-center gap-1 text-[#E7C46A]">
              <Clock className="w-3.5 h-3.5" /> {route.estimatedDuration}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#E7C46A]" /> {route.totalWalkingDistance}
            </span>
            <span>•</span>
            <span className="text-[#F8F0DF] font-bold">{route.stopsCount} Pandals</span>
          </div>
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F8F0DF] mb-1">
          {route.name}
        </h2>
        {route.bengaliName && (
          <p className="text-sm text-[#E7C46A] font-serif mb-3">{route.bengaliName}</p>
        )}
        <p className="text-xs sm:text-sm text-[#F8F0DF]/90 leading-relaxed mb-5">
          {route.description}
        </p>

        {/* Start Tour CTA Button */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#D6A13A]/25">
          {!tourActive ? (
            <button
              onClick={() => {
                setTourActive(true);
                setCurrentStopIndex(0);
                if (route.stops[0] && onSeeOnMap) onSeeOnMap(route.stops[0].pandalId);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F8F0DF] hover:bg-[#FFFFFF] text-[#7E1815] text-xs font-bold tracking-wider uppercase shadow-lg transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#B52B20]" />
              <span>START TOUR MODE</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                TOUR IN PROGRESS
              </span>
              <button
                onClick={() => setTourActive(false)}
                className="px-3 py-1.5 rounded-full bg-[#35120F] text-xs text-[#F8F0DF]/80 hover:text-[#F8F0DF] border border-[#D6A13A]/30"
              >
                Exit Tour
              </button>
            </div>
          )}

          {metro && (
            <Link
              href={`/metro/${metro.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#35120F]/80 text-[#E7C46A] hover:text-[#F8F0DF] border border-[#D6A13A]/40 text-xs font-semibold transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Explore {metro.name} Hub</span>
            </Link>
          )}
        </div>
      </div>

      {/* ACTIVE "NEXT STOP" LIVE COMPASS BANNER (When Tour is Running) */}
      {tourActive && currentPandal && (
        <div className="bg-gradient-to-r from-[#7E1815] to-[#B52B20] text-[#F8F0DF] p-5 rounded-2xl shadow-2xl border-2 border-[#D6A13A] animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full border border-white/20 text-[#E7C46A]">
              STOP {currentStopIndex + 1} OF {route.stops.length}
            </span>
            <span className="text-xs text-[#F8F0DF]/90 font-medium">YOU ARE HERE</span>
          </div>

          <h3 className="font-editorial text-2xl font-bold mb-1">
            🛕 {currentPandal.name}
          </h3>
          <p className="text-xs text-[#F8F0DF]/85 mb-4 leading-relaxed">
            {currentPandal.address}
          </p>

          {/* NEXT STOP POINTER */}
          {nextPandal && nextStop ? (
            <div className="bg-[#35120F]/90 text-[#F8F0DF] p-4 rounded-xl border border-[#D6A13A]/50 mb-4">
              <div className="flex items-center justify-between text-xs text-[#E7C46A] font-bold uppercase tracking-wider mb-1">
                <span>NEXT STOP</span>
                <span>🚶 {nextStop.walkingTime || '5 min'} • {nextStop.walkingDistance || '300 m'}</span>
              </div>
              <h4 className="text-lg font-bold text-[#F8F0DF]">{nextPandal.name}</h4>
              <p className="text-xs text-[#F8F0DF]/80 mt-1 italic">
                &quot;{nextStop.instruction || nextPandal.directions}&quot;
              </p>
            </div>
          ) : (
            <div className="bg-[#35120F]/80 p-3 rounded-xl border border-[#D6A13A]/40 mb-4 text-center">
              <p className="text-xs font-bold text-[#E7C46A]">
                🎉 Final Stop on this circuit! You have experienced all curated pandals.
              </p>
            </div>
          )}

          {/* Tour Controls */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              disabled={currentStopIndex === 0}
              onClick={() => {
                const prev = currentStopIndex - 1;
                setCurrentStopIndex(prev);
                if (route.stops[prev] && onSeeOnMap) onSeeOnMap(route.stops[prev].pandalId);
              }}
              className="px-3.5 py-2 rounded-xl bg-black/30 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/50 transition-colors"
            >
              ← Previous Stop
            </button>

            {onSeeOnMap && currentPandal.latitude && (
              <button
                onClick={() => onSeeOnMap(currentPandal.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#35120F] text-[#E7C46A] border border-[#D6A13A]/50 text-xs font-bold hover:bg-[#7E1815]"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>SEE ON MAP</span>
              </button>
            )}

            {nextStop ? (
              <button
                onClick={() => {
                  const next = currentStopIndex + 1;
                  setCurrentStopIndex(next);
                  if (route.stops[next] && onSeeOnMap) onSeeOnMap(route.stops[next].pandalId);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#E7C46A] text-[#7E1815] text-xs font-bold shadow-md hover:bg-[#F8F0DF] transition-colors"
              >
                <span>Proceed to Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentStopIndex(0);
                  setTourActive(false);
                }}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#E7C46A] text-[#7E1815] text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Finish Tour</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* SIGNATURE VERTICAL ROUTE TIMELINE (Sections 79, 90, 91) */}
      <div className="relative pl-7 sm:pl-9 border-l-2 border-[#D6A13A] space-y-8 my-6 ml-3 sm:ml-4">
        {/* STARTING METRO HUB NODE */}
        <div className="relative group">
          {/* Node Icon - Antique Gold with Deep Red Metro */}
          <div className="absolute -left-[41px] sm:-left-[49px] top-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#7E1815] border-2 border-[#D6A13A] flex items-center justify-center text-sm sm:text-base shadow-lg shadow-[#7E1815]/30">
            🚇
          </div>

          <div className="bg-[#FFFFFF] border border-[#D6A13A]/40 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#B52B20] mb-1">
              <span>METRO STARTING POINT</span>
              <span className="text-[#D6A13A] font-semibold">{metro?.line || 'Kolkata Metro'}</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#171311]">
              {route.metroStationName}
            </h3>
            {route.startingExit && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F0DF] border border-[#D6A13A]/40 text-xs font-bold text-[#7E1815]">
                <Footprints className="w-3.5 h-3.5 text-[#B52B20]" />
                <span>Take {route.startingExit}</span>
              </div>
            )}
            <p className="text-xs text-[#5A4E46] mt-2">
              Exit through the designated gate and follow the pedestrian route below to the first pandal.
            </p>
          </div>
        </div>

        {/* ORDERED PANDAL STOPS (01, 02, 03, 04...) */}
        {route.stops.map((stop, idx) => {
          const pandal = PANDALS.find((p) => p.id === stop.pandalId);
          if (!pandal) return null;

          const isSaved = savedIds[pandal.id] ?? isPandalSaved(pandal.id);
          const isCurrentActive = tourActive && currentStopIndex === idx;
          const stopNumberFormatted = stop.order < 10 ? `0${stop.order}` : `${stop.order}`;

          return (
            <div key={stop.pandalId} className="relative group">
              {/* Transition Walking Step Indicator (between stops) */}
              <div className="absolute -left-[32px] sm:-left-[40px] -top-5 flex items-center gap-1 text-[10px] font-bold text-[#7E1815] bg-[#F8F0DF] px-2.5 py-0.5 rounded-full border border-[#D6A13A]/50 shadow-sm">
                <span>↓</span>
                <span>{stop.walkingTime || '4 min'}</span>
              </div>

              {/* Numbered Stop Node Icon (Section 90: Antique gold circle with deep red number or vice versa) */}
              <div
                className={`absolute -left-[41px] sm:-left-[49px] top-1 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 shadow-lg transition-transform ${
                  isCurrentActive
                    ? 'bg-[#E7C46A] text-[#7E1815] border-[#7E1815] scale-110 ring-4 ring-[#D6A13A]/40'
                    : 'bg-[#D6A13A] text-[#7E1815] border-[#FFFFFF]'
                }`}
              >
                {stopNumberFormatted}
              </div>

              {/* Stop Card */}
              <div
                className={`rounded-2xl p-5 border transition-all ${
                  isCurrentActive
                    ? 'bg-[#FFFFFF] border-[#D6A13A] shadow-xl ring-2 ring-[#D6A13A]/30'
                    : 'bg-[#FFFFFF] border-[#D6A13A]/25 hover:border-[#D6A13A] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E1815]">
                        STOP {stopNumberFormatted} • {pandal.area}
                      </span>
                      {pandal.category.includes('must-visit') && (
                        <span className="chip-category text-[10px] py-0 px-2">
                          🔥 MUST VISIT
                        </span>
                      )}
                    </div>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#171311]">
                      {pandal.name}
                    </h3>
                    {pandal.bengaliName && (
                      <p className="text-xs text-[#7E1815] font-serif">{pandal.bengaliName}</p>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSave(pandal.id, e)}
                    aria-label="Save Pandal"
                    className={`p-2 rounded-full border transition-all ${
                      isSaved
                        ? 'bg-[#B52B20] text-[#F8F0DF] border-[#B52B20]'
                        : 'bg-[#F8F0DF] text-[#7E1815] border-[#D6A13A]/40 hover:text-[#B52B20]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-[#5A4E46] leading-relaxed mb-3">
                  {pandal.description}
                </p>

                {/* Walking Instruction Step Box */}
                {stop.instruction && (
                  <div className="bg-[#F8F0DF] p-3 rounded-xl border border-[#D6A13A]/30 mb-3 text-xs text-[#171311] flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-[#B52B20] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#7E1815]">Walking Direction: </span>
                      <span className="text-[#5A4E46]">{stop.instruction}</span>
                      {stop.walkingDistance && (
                        <span className="ml-1 text-[#7E1815] font-semibold">({stop.walkingDistance})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D6A13A]/20">
                  {onSeeOnMap && pandal.latitude && (
                    <button
                      onClick={() => onSeeOnMap(pandal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F0DF] text-[#7E1815] border border-[#D6A13A]/40 text-xs font-bold hover:bg-[#EFE2C7] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>See on Map</span>
                    </button>
                  )}

                  <Link
                    href={`/pandal/${pandal.id}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#7E1815] text-[#F8F0DF] text-xs font-bold hover:bg-[#B52B20] transition-colors shadow-sm"
                  >
                    <span>View Pandal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E7C46A]" />
                  </Link>

                  {idx < route.stops.length - 1 && (
                    <span className="text-[11px] text-[#5A4E46] ml-auto hidden sm:inline">
                      Next: {PANDALS.find((p) => p.id === route.stops[idx + 1].pandalId)?.name}
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
