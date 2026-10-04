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
  ExternalLink,
  Landmark,
  Check,
  X,
} from 'lucide-react';
import { isPandalSaved, savePandal, removeSavedPandal } from '@/lib/storage';
import { NearbyBonediItem } from '@/lib/proximity';
import NearbyBonediExtension from '@/components/NearbyBonediExtension';

interface RouteTimelineProps {
  route: Route;
  onSeeOnMap?: (pandalId: string) => void;
  nearbyBaris?: NearbyBonediItem[];
  addedBariIds?: string[];
  onToggleBari?: (bariId: string) => void;
}

export default function RouteTimeline({
  route,
  onSeeOnMap,
  nearbyBaris = [],
  addedBariIds = [],
  onToggleBari,
}: RouteTimelineProps) {
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
  const lastStop = route.stops[route.stops.length - 1];
  const lastPandal = lastStop ? PANDALS.find((p) => p.id === lastStop.pandalId) : null;

  const addedBarisList = nearbyBaris.filter((item) => addedBariIds.includes(item.bonedi.id));

  const currentFormatted =
    activeStop && activeStop.order < 10 ? `0${activeStop.order}` : `${activeStop?.order || '01'}`;
  const nextFormatted =
    nextStop && nextStop.order < 10 ? `0${nextStop.order}` : `${nextStop?.order || ''}`;

  return (
    <div className="space-y-6 text-[#F7F0E2]">
      {/* Route Header Banner */}
      <div className="bg-[#120E0C]/90 backdrop-blur-md text-[#F7F0E2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C9973E]/50 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-extrabold tracking-widest uppercase bg-[#8F1D18] text-[#E1BE68] px-3.5 py-1 rounded-full border border-[#C9973E]/40">
            {route.region}
          </span>
          <div className="flex items-center gap-3 text-xs text-[#E1BE68] font-bold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {route.estimatedDuration}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" /> {route.totalWalkingDistance}
            </span>
          </div>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold tracking-tight mt-1 mb-1 text-[#F7F0E2]">
          {route.name.toUpperCase()}
        </h1>
        <p className="font-editorial text-xl sm:text-2xl text-[#E1BE68] italic mb-3">
          {route.tagline || `PANDAL HOPPING · ${route.stopsCount} STOPS`}
        </p>

        <p className="text-xs sm:text-sm text-[#F7F0E2]/90 leading-relaxed mb-5 max-w-xl">
          {route.description}
        </p>

        {/* STARTING POINT */}
        <div className="bg-[#241714]/90 border-2 border-[#C9973E]/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#8F1D18] border-2 border-[#C9973E] flex items-center justify-center text-xl shrink-0 shadow-sm">
              🚇
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1BE68] block">
                STARTING POINT
              </span>
              <p className="font-extrabold text-base text-[#F7F0E2]">{route.metroStationName}</p>
            </div>
          </div>
          {route.startingExit && (
            <div className="px-4 py-1.5 rounded-full bg-[#8F1D18] text-[#F7F0E2] text-xs font-bold border border-[#C9973E]/60 text-center shadow-xs">
              Take {route.startingExit}
            </div>
          )}
        </div>
      </div>

      {/* CURRENT / NEXT STOP STICKY BAR */}
      {activePandal && (
        <div className="sticky top-16 z-30 bg-[#120E0C]/95 backdrop-blur-xl text-[#F7F0E2] p-4 rounded-2xl border-2 border-[#C9973E] shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-extrabold uppercase tracking-widest text-[#E1BE68] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E1BE68] animate-ping" />
              CURRENT STOP: {currentFormatted} — {activePandal.name.toUpperCase()}
            </span>
            <span className="text-[11px] text-[#F7F0E2]/70 font-bold">
              Stop {currentStep + 1} of {route.stops.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-[#C9973E]/30">
            {nextPandal ? (
              <div className="text-xs text-[#F7F0E2] flex items-center gap-1.5 truncate">
                <span className="text-[#E1BE68] font-bold">↓ NEXT:</span>
                <span className="font-extrabold text-[#F7F0E2]">
                  {nextFormatted} — {nextPandal.name}
                </span>
                <span className="text-[#E1BE68] font-semibold text-[11px] shrink-0">
                  (🚶 ~{nextStop?.walkingTime || '4 min'})
                </span>
              </div>
            ) : (
              <p className="text-xs text-[#E1BE68] font-bold">
                🎉 Final Pandal on this curated route!
              </p>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {(activePandal.googleMapsUrl || activePandal.latitude) && (
                <a
                  href={activePandal.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${activePandal.latitude},${activePandal.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] text-xs font-bold transition-colors border border-[#C9973E]/40 flex items-center gap-1"
                >
                  <span>SEE ON MAP</span>
                  <ExternalLink className="w-3 h-3 text-[#E1BE68]" />
                </a>
              )}
              {nextStop && (
                <button
                  onClick={() => {
                    const next = currentStep + 1;
                    setCurrentStep(next);
                    if (route.stops[next] && onSeeOnMap) onSeeOnMap(route.stops[next].pandalId);
                    const el = document.getElementById(`stop-${route.stops[next].pandalId}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#C9973E] hover:bg-[#E1BE68] text-[#120E0C] text-xs font-extrabold transition-all shadow-sm flex items-center gap-1"
                >
                  <span>Next Stop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VERTICAL ROUTE TIMELINE */}
      <div className="relative pl-7 sm:pl-10 border-l-4 border-[#C9973E] space-y-10 my-8 ml-4 sm:ml-6">
        {/* Metro Starting Marker on Timeline */}
        <div className="relative group">
          <div className="absolute -left-[45px] sm:-left-[53px] -top-1 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8F1D18] border-2 border-[#C9973E] flex items-center justify-center text-lg text-[#F7F0E2] shadow-lg">
            🚇
          </div>
          <div className="bg-[#120E0C]/90 backdrop-blur-md rounded-2xl p-4 border border-[#C9973E]/40 shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E1BE68]">
              JOURNEY BEGINS
            </span>
            <h4 className="font-editorial text-lg font-bold text-[#F7F0E2]">
              {route.metroStationName}
            </h4>
            <p className="text-xs text-[#F7F0E2]/80 mt-0.5">
              {route.startingExit ? `Exit through ${route.startingExit}` : 'Exit the station and follow the walking direction below.'}
            </p>
          </div>
        </div>

        {/* Pandal Stops Sequence (NO IMAGES, text/location focused) */}
        {route.stops.map((stop, idx) => {
          const pandal = PANDALS.find((p) => p.id === stop.pandalId);
          if (!pandal) return null;

          const isSaved = savedIds[pandal.id] ?? isPandalSaved(pandal.id);
          const isCurrent = currentStep === idx;
          const stopNumberFormatted = stop.order < 10 ? `0${stop.order}` : `${stop.order}`;
          const nextStopItem = route.stops[idx + 1];
          const nextStopPandal = nextStopItem ? PANDALS.find((p) => p.id === nextStopItem.pandalId) : null;

          return (
            <div key={stop.pandalId} id={`stop-${stop.pandalId}`} className="relative group scroll-mt-36">
              {/* Walking Time Badge from Previous Stop */}
              {stop.walkingTime && (
                <div className="absolute -left-[35px] sm:-left-[43px] -top-7 flex items-center gap-1 text-[11px] font-extrabold text-[#E1BE68] bg-[#120E0C] px-3 py-0.5 rounded-full border border-[#C9973E] shadow-sm">
                  <span>↓ 🚶 {stop.walkingTime}</span>
                </div>
              )}

              {/* Numbered Marker: Gold circle with dark text; active marker Deep Red with gold border */}
              <button
                onClick={() => {
                  setCurrentStep(idx);
                  if (onSeeOnMap) onSeeOnMap(pandal.id);
                }}
                className={`absolute -left-[45px] sm:-left-[53px] top-2 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 shadow-xl transition-all ${
                  isCurrent
                    ? 'bg-[#8F1D18] text-[#E1BE68] border-[#E1BE68] scale-110 ring-4 ring-[#C9973E]/40'
                    : 'bg-[#C9973E] text-[#120E0C] border-[#FFFFFF] hover:scale-105'
                }`}
              >
                {stopNumberFormatted}
              </button>

              {/* Stop Card: Text & Location Focused (NO IMAGE as requested in Section 10 & 22) */}
              <div
                className={`rounded-3xl p-5 sm:p-7 border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#120E0C]/95 backdrop-blur-md border-[#E1BE68] shadow-2xl ring-2 ring-[#C9973E]/30'
                    : 'bg-[#120E0C]/90 backdrop-blur-md border-[#C9973E]/40 hover:border-[#E1BE68] shadow-md'
                }`}
              >
                {/* Header: Stop Number, Area & Bookmark */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E1BE68] block mb-0.5">
                      STOP {stopNumberFormatted} · {pandal.area.toUpperCase()}
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                      {pandal.name}
                    </h3>
                    {pandal.bengaliName && (
                      <p className="text-xs text-[#E1BE68] font-serif mt-0.5">{pandal.bengaliName}</p>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => toggleSave(pandal.id, e)}
                    aria-label="Save Pandal"
                    className={`p-2.5 rounded-full border transition-all ${
                      isSaved
                        ? 'bg-[#8F1D18] text-[#E1BE68] border-[#C9973E]'
                        : 'bg-[#241714]/80 text-[#F7F0E2]/70 border-[#C9973E]/40 hover:text-[#E1BE68]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 leading-relaxed mb-4">
                  {pandal.description}
                </p>

                {/* Walking Direction Instruction */}
                {stop.instruction && (
                  <div className="bg-[#241714]/90 p-3.5 rounded-2xl border border-[#C9973E]/40 mb-4 text-xs text-[#F7F0E2] flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-[#E1BE68] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-[#E1BE68]">Walking Direction: </span>
                      <span className="text-[#F7F0E2]/90">{stop.instruction}</span>
                      {stop.walkingDistance && (
                        <span className="ml-1 text-[#E1BE68] font-bold">({stop.walkingDistance})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons: [ SEE ON MAP ] & [ Pandal Details ] */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#C9973E]/20">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* External Google Maps (Section 10 & 18: No API key needed) */}
                    {(stop.googleMapsUrl || pandal.googleMapsUrl || pandal.latitude) && (
                      <a
                        href={stop.googleMapsUrl || pandal.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#C9973E]/50 text-xs font-bold transition-all shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
                        <span>SEE ON MAP →</span>
                      </a>
                    )}

                    <Link
                      href={`/pandal/${pandal.id}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] text-xs font-bold transition-all border border-[#C9973E]/40"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Next Stop Indicator */}
                  {nextStopPandal && (
                    <div className="text-xs font-extrabold text-[#E1BE68] flex items-center gap-1 bg-[#241714] px-3 py-1 rounded-full border border-[#C9973E]/30">
                      <span>↓ NEXT: {nextStopPandal.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* DYNAMIC EXTENDED HERITAGE STOPS (If user toggled them on) */}
        {addedBarisList.map((item, addIdx) => {
          const stopNumber = route.stops.length + addIdx + 1;
          const stopNumberFormatted = stopNumber < 10 ? `0${stopNumber}` : `${stopNumber}`;

          return (
            <div
              key={item.bonedi.id}
              id={`stop-${item.bonedi.id}`}
              className="relative pl-8 sm:pl-10 pb-8 animate-fadeIn"
            >
              {/* Walking time from previous stop */}
              <div className="absolute -left-[35px] sm:-left-[43px] -top-7 flex items-center gap-1 text-[11px] font-extrabold text-[#E1BE68] bg-[#120E0C] px-3 py-0.5 rounded-full border border-[#C9973E] shadow-sm">
                <span>↓ 🚶 ~{item.walkingMinutes} min ({item.distanceMeters}m)</span>
              </div>

              {/* Numbered Marker: Special Heritage Red / Gold */}
              <div
                className="absolute -left-[45px] sm:-left-[53px] top-2 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-2 border-[#E1BE68] bg-[#8F1D18] text-[#E1BE68] shadow-xl ring-4 ring-[#C9973E]/40"
              >
                {stopNumberFormatted}
              </div>

              {/* Stop Card */}
              <div className="rounded-3xl p-5 sm:p-7 border-2 border-[#E1BE68] bg-[#120E0C]/95 backdrop-blur-md shadow-2xl ring-2 ring-[#C9973E]/30 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#8F1D18] text-[#E1BE68] border border-[#C9973E]/50">
                        EXTENDED HERITAGE STOP
                      </span>
                      <span className="text-[10px] text-[#E1BE68]/80 font-bold uppercase">
                        {item.bonedi.area}
                      </span>
                    </div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                      {item.bonedi.name}
                    </h3>
                    {item.bonedi.bengaliName && (
                      <p className="text-xs text-[#E1BE68] font-serif mt-0.5">
                        {item.bonedi.bengaliName}
                      </p>
                    )}
                  </div>

                  {/* Remove / Toggle Off Button */}
                  {onToggleBari && (
                    <button
                      onClick={() => onToggleBari(item.bonedi.id)}
                      className="px-3 py-1 rounded-full bg-[#241714] hover:bg-[#8F1D18] text-[#F7F0E2]/70 hover:text-[#F7F0E2] border border-[#C9973E]/40 text-[10px] font-bold transition-colors"
                      title="Remove from Route"
                    >
                      Remove ✕
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 leading-relaxed">
                  {item.bonedi.description}
                </p>

                {/* Walking Instruction */}
                <div className="bg-[#241714]/90 p-3.5 rounded-2xl border border-[#C9973E]/40 text-xs text-[#F7F0E2] flex items-start gap-2.5">
                  <Navigation className="w-4 h-4 text-[#E1BE68] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[#E1BE68]">Walking Connection: </span>
                    <span className="text-[#F7F0E2]/90">{item.directionInstruction}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#C9973E]/20">
                  <div className="flex flex-wrap items-center gap-2">
                    {onSeeOnMap && item.bonedi.latitude && (
                      <button
                        onClick={() => onSeeOnMap(item.bonedi.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#C9973E]/50 text-xs font-bold transition-all shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#E1BE68]" />
                        <span>SEE ON MAP →</span>
                      </button>
                    )}

                    <Link
                      href={`/bonedi/${item.bonedi.id}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] text-xs font-bold transition-all border border-[#C9973E]/40"
                    >
                      <span>View History & Dalans</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <span className="text-[11px] font-bold text-[#E1BE68] bg-[#241714] px-3 py-1 rounded-full border border-[#C9973E]/30">
                    Est. {item.bonedi.yearEstablished || 'Ancient Heritage'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXTEND YOUR WALK: NEARBY HERITAGE / BONEDI BARI SECTION */}
      {nearbyBaris && nearbyBaris.length > 0 && (
        <div className="pt-4">
          <NearbyBonediExtension
            nearbyBaris={nearbyBaris}
            addedBariIds={addedBariIds}
            onToggleBari={onToggleBari || (() => {})}
            onSeeOnMap={onSeeOnMap}
            lastPandalName={lastPandal?.name || 'Last Pandal'}
          />
        </div>
      )}
    </div>
  );
}
