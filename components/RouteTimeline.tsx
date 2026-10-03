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
  Compass,
  ArrowRight,
  Bookmark,
  CheckCircle,
  Footprints,
  Play,
  RotateCcw,
  Sparkles,
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
      {/* Route Header Banner */}
      <div className="bg-[#0B223D] border border-[#D99A3D]/25 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D99A3D]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#B93624] text-[#FFF8EC] shadow-sm">
            {route.region}
          </span>
          <div className="flex items-center gap-3 text-xs text-[#D8CEBE]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D99A3D]" /> {route.estimatedDuration}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-[#D99A3D]" /> {route.totalWalkingDistance}
            </span>
            <span>•</span>
            <span className="text-[#FFF8EC] font-semibold">{route.stopsCount} Pandals</span>
          </div>
        </div>

        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#FFF8EC] mb-1">
          {route.name}
        </h2>
        {route.bengaliName && (
          <p className="text-sm text-[#D99A3D] font-serif mb-3">{route.bengaliName}</p>
        )}
        <p className="text-xs sm:text-sm text-[#D8CEBE]/90 leading-relaxed mb-5">
          {route.description}
        </p>

        {/* Start Tour CTA Button */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#D99A3D]/15">
          {!tourActive ? (
            <button
              onClick={() => {
                setTourActive(true);
                setCurrentStopIndex(0);
                if (route.stops[0] && onSeeOnMap) onSeeOnMap(route.stops[0].pandalId);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B93624] hover:bg-[#cf412e] text-[#FFF8EC] text-sm font-semibold shadow-lg shadow-[#B93624]/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
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
                className="px-3 py-1.5 rounded-full bg-[#071A2F] text-xs text-[#D8CEBE] hover:text-[#FFF8EC] border border-[#D99A3D]/25"
              >
                Exit Tour
              </button>
            </div>
          )}

          {metro && (
            <Link
              href={`/metro/${metro.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#071A2F] text-[#D99A3D] hover:text-[#FFF8EC] border border-[#D99A3D]/30 text-xs font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Explore {metro.name} Metro Hub</span>
            </Link>
          )}
        </div>
      </div>

      {/* ACTIVE "NEXT STOP" LIVE COMPASS BANNER (When Tour is Running) */}
      {tourActive && currentPandal && (
        <div className="bg-gradient-to-r from-[#B93624] to-[#7E1B0E] text-[#FFF8EC] p-5 rounded-2xl shadow-2xl border-2 border-[#D99A3D] animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase bg-black/30 px-3 py-1 rounded-full border border-white/20">
              STOP {currentStopIndex + 1} OF {route.stops.length}
            </span>
            <span className="text-xs text-[#FFF8EC]/90 font-medium">YOU ARE HERE</span>
          </div>

          <h3 className="font-editorial text-2xl font-bold mb-1">
            🛕 {currentPandal.name}
          </h3>
          <p className="text-xs text-[#FFF8EC]/85 mb-4 leading-relaxed">
            {currentPandal.address}
          </p>

          {/* NEXT STOP POINTER */}
          {nextPandal && nextStop ? (
            <div className="bg-[#071A2F]/90 text-[#FFF8EC] p-4 rounded-xl border border-[#D99A3D]/40 mb-4">
              <div className="flex items-center justify-between text-xs text-[#D99A3D] font-bold uppercase tracking-wider mb-1">
                <span>NEXT STOP</span>
                <span>🚶 {nextStop.walkingTime || '5 min walk'} • {nextStop.walkingDistance || '300 m'}</span>
              </div>
              <h4 className="text-lg font-bold text-[#FFF8EC]">{nextPandal.name}</h4>
              <p className="text-xs text-[#D8CEBE] mt-1 italic">
                &quot;{nextStop.instruction || nextPandal.directions}&quot;
              </p>
            </div>
          ) : (
            <div className="bg-[#071A2F]/80 p-3 rounded-xl border border-[#D99A3D]/30 mb-4 text-center">
              <p className="text-xs font-semibold text-[#D99A3D]">
                🎉 Final Stop on this route! You have experienced all curated pandals.
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071A2F] text-[#D99A3D] border border-[#D99A3D]/40 text-xs font-bold hover:bg-[#0B223D]"
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
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#D99A3D] text-[#071A2F] text-xs font-bold shadow-md hover:bg-[#f3bc65] transition-colors"
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
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#D99A3D] text-[#071A2F] text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Finish Tour</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TIMELINE LIST */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D99A3D]/30 space-y-8 my-6 ml-3 sm:ml-4">
        {/* STARTING METRO NODE */}
        <div className="relative group">
          {/* Node Icon */}
          <div className="absolute -left-[37px] sm:-left-[45px] top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#071A2F] border-2 border-[#D99A3D] flex items-center justify-center text-sm sm:text-base shadow-lg shadow-[#071A2F]">
            🚇
          </div>

          <div className="bg-[#0B223D]/80 border border-[#D99A3D]/30 rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#D99A3D] mb-1">
              <span>STARTING POINT</span>
              <span>{metro?.line || 'Kolkata Metro'}</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#FFF8EC]">
              {route.metroStationName}
            </h3>
            {route.startingExit && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071A2F] border border-[#D99A3D]/40 text-xs font-semibold text-[#D99A3D]">
                <Footprints className="w-3.5 h-3.5 text-[#B93624]" />
                <span>Take {route.startingExit}</span>
              </div>
            )}
            <p className="text-xs text-[#D8CEBE]/80 mt-2">
              Exit through the designated gate and follow the pedestrian route below to the first pandal.
            </p>
          </div>
        </div>

        {/* ORDERED PANDAL STOPS */}
        {route.stops.map((stop, idx) => {
          const pandal = PANDALS.find((p) => p.id === stop.pandalId);
          if (!pandal) return null;

          const isSaved = savedIds[pandal.id] ?? isPandalSaved(pandal.id);
          const isCurrentActive = tourActive && currentStopIndex === idx;

          return (
            <div key={stop.pandalId} className="relative group">
              {/* Transition Walking Step Indicator (between stops) */}
              <div className="absolute -left-[30px] sm:-left-[38px] -top-5 flex items-center gap-1.5 text-[10px] font-bold text-[#D99A3D] bg-[#071A2F] px-2 py-0.5 rounded-full border border-[#D99A3D]/30 shadow-sm">
                <span>↓</span>
                <span>{stop.walkingTime || '4 min'}</span>
              </div>

              {/* Numbered Stop Node Icon */}
              <div
                className={`absolute -left-[37px] sm:-left-[45px] top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm border-2 shadow-lg transition-transform ${
                  isCurrentActive
                    ? 'bg-[#D99A3D] text-[#071A2F] border-[#FFF8EC] scale-110 ring-4 ring-[#D99A3D]/30'
                    : 'bg-[#B93624] text-[#FFF8EC] border-[#FFF8EC]'
                }`}
              >
                {stop.order}
              </div>

              {/* Stop Card */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                  isCurrentActive
                    ? 'bg-[#0F2A4A] border-[#D99A3D] shadow-2xl ring-1 ring-[#D99A3D]/40'
                    : 'bg-[#0B223D] border-[#D99A3D]/20 hover:border-[#D99A3D]/50 shadow-md'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D99A3D]">
                        STOP {stop.order} • {pandal.area}
                      </span>
                      {pandal.category.includes('must-visit') && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#B93624] text-[#FFF8EC]">
                          🔥 MUST VISIT
                        </span>
                      )}
                    </div>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#FFF8EC]">
                      {pandal.name}
                    </h3>
                    {pandal.bengaliName && (
                      <p className="text-xs text-[#D8CEBE]/80 font-serif">{pandal.bengaliName}</p>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSave(pandal.id, e)}
                    aria-label="Save Pandal"
                    className={`p-2 rounded-full border transition-all ${
                      isSaved
                        ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624]'
                        : 'bg-[#071A2F] text-[#D8CEBE] border-[#D99A3D]/25 hover:text-[#D99A3D]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-[#D8CEBE]/90 leading-relaxed mb-3">
                  {pandal.description}
                </p>

                {/* Walking Instruction Step Box */}
                {stop.instruction && (
                  <div className="bg-[#071A2F]/70 p-3 rounded-xl border border-[#D99A3D]/15 mb-3 text-xs text-[#D8CEBE] flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-[#D99A3D] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#FFF8EC]">Walking Direction: </span>
                      <span>{stop.instruction}</span>
                      {stop.walkingDistance && (
                        <span className="ml-1 text-[#D99A3D] font-medium">({stop.walkingDistance})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D99A3D]/15">
                  {onSeeOnMap && pandal.latitude && (
                    <button
                      onClick={() => onSeeOnMap(pandal.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#071A2F] text-[#D99A3D] border border-[#D99A3D]/30 text-xs font-semibold hover:bg-[#0F2A4A] transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>See on Map</span>
                    </button>
                  )}

                  <Link
                    href={`/pandal/${pandal.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B93624] text-[#FFF8EC] text-xs font-semibold hover:bg-[#cf412e] transition-colors"
                  >
                    <span>View Pandal</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {idx < route.stops.length - 1 && (
                    <span className="text-[11px] text-[#D8CEBE]/60 ml-auto hidden sm:inline">
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
