'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Navigation, 
  RefreshCw, 
  AlertCircle, 
  Train, 
  Landmark, 
  Compass, 
  ArrowRight, 
  Map, 
  List,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { getNearbyPlaces, NearbyPlace, PlaceType } from '@/lib/near-me';
import NearMeCard from '@/components/NearMeCard';

const NearMeMap = dynamic(() => import('@/components/NearMeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[520px] bg-[#140E0C]/90 rounded-3xl animate-pulse border border-[#C9973E]/40 flex flex-col items-center justify-center gap-3 text-[#E1BE68]">
      <div className="w-10 h-10 rounded-full border-2 border-[#E1BE68] border-t-transparent animate-spin" />
      <span className="text-xs font-bold uppercase tracking-widest">Loading Leaflet Map...</span>
    </div>
  ),
});

type GeoStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'timeout' | 'unsupported';

const POPULAR_AREAS = [
  { name: 'South Kolkata', href: '/explore?region=South+Kolkata' },
  { name: 'North Kolkata', href: '/explore?region=North+Kolkata' },
  { name: 'Central Kolkata', href: '/explore?region=Central+Kolkata' },
  { name: 'Salt Lake + New Town', href: '/explore?region=Salt+Lake+%2B+New+Town' },
  { name: 'Dum Dum Area', href: '/explore?region=Dum+Dum' },
];

function NearMeContent() {
  const searchParams = useSearchParams();
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | 'all'>(3000);
  const [selectedCategory, setSelectedCategory] = useState<'all' | PlaceType>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Allow optional URL lat/lng for testing or deep-linking
  useEffect(() => {
    const pLat = searchParams.get('lat');
    const pLng = searchParams.get('lng');
    if (pLat && pLng) {
      const lat = parseFloat(pLat);
      const lng = parseFloat(pLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setUserCoords([lat, lng]);
        setGeoStatus('success');
      }
    }
  }, [searchParams]);

  const requestLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }

    setGeoStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords([lat, lng]);
        setGeoStatus('success');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoStatus('denied');
        } else if (err.code === err.TIMEOUT) {
          setGeoStatus('timeout');
        } else {
          setGeoStatus('unavailable');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  };

  // Compute nearby places locally based on current coordinates
  const allNearby = useMemo(() => {
    if (!userCoords) return [];
    return getNearbyPlaces(userCoords[0], userCoords[1], selectedRadius);
  }, [userCoords, selectedRadius]);

  // Filtered by selected category (All / Pandals / Bonedi / Metro)
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return allNearby;
    return allNearby.filter((p) => p.type === selectedCategory);
  }, [allNearby, selectedCategory]);

  // Counts for each category within the selected radius
  const counts = useMemo(() => {
    const pandalsCount = allNearby.filter((p) => p.type === 'pandal').length;
    const bonediCount = allNearby.filter((p) => p.type === 'bonedi').length;
    const metroCount = allNearby.filter((p) => p.type === 'metro').length;
    return {
      all: allNearby.length,
      pandal: pandalsCount,
      bonedi: bonediCount,
      metro: metroCount,
    };
  }, [allNearby]);

  const handleSeeOnMap = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setViewMode('map');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-transparent text-[#F7F0E2] min-h-screen pb-24">
      {/* ============================================================
          STATE 1: IDLE / LANDING (UNIFIED, STREAMLINED, VISUALLY STUNNING)
      ============================================================ */}
      {geoStatus === 'idle' && (
        <section className="px-4 sm:px-8 pt-8 sm:pt-16 pb-12 max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-[#140E0C]/90 backdrop-blur-2xl border-2 border-[#C9973E]/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 sm:p-14 text-center overflow-hidden flex flex-col items-center">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8F1D18]/25 rounded-full blur-3xl pointer-events-none" />

            {/* Top pill badge */}
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8F1D18] border border-[#E1BE68]/70 text-[#E1BE68] text-xs font-black tracking-widest uppercase mb-6 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>আপনার আশেপাশে পুজো পরিক্রমা</span>
            </div>

            {/* Regal Heading */}
            <h1 className="relative font-editorial text-4xl sm:text-6xl lg:text-7xl font-black text-[#F7F0E2] tracking-tight leading-[1.05] drop-shadow-lg mb-4">
              Explore Near You
            </h1>

            {/* Supporting Text */}
            <p className="relative font-editorial text-base sm:text-xl text-[#E1BE68] max-w-xl leading-relaxed mb-8">
              Find pandals, heritage Pujas and Metro stations around your current location.
            </p>

            {/* MAGNETIC PRIMARY CTA: USE MY LOCATION */}
            <div className="relative flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={requestLocation}
                className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#8F1D18] via-[#B52A22] to-[#8F1D18] hover:from-[#B52A22] hover:to-[#8F1D18] text-[#F7F0E2] border-2 border-[#E1BE68] shadow-[0_0_35px_rgba(201,151,62,0.35)] hover:shadow-[0_0_55px_rgba(225,190,104,0.6)] text-sm sm:text-base font-black tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#120E0C]/60 flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-[#E1BE68] animate-pulse" />
                </div>
                <span>USE MY LOCATION</span>
                <ArrowRight className="w-4 h-4 text-[#E1BE68] group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Reassuring Privacy Microcopy */}
              <div className="flex items-center gap-1.5 text-xs text-[#F7F0E2]/70 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-[#E1BE68]" />
                <span>One-tap browser check · Location is never stored or tracked</span>
              </div>
            </div>

            {/* CLEAN MANUAL REGION FALLBACK: OR CHOOSE AN AREA */}
            <div className="relative mt-12 pt-8 border-t border-[#C9973E]/30 w-full max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E1BE68] block mb-3">
                OR EXPLORE BY REGION
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {POPULAR_AREAS.map((area) => (
                  <Link
                    key={area.name}
                    href={area.href}
                    className="px-4 py-2 rounded-full bg-[#241714]/90 hover:bg-[#35120F] text-[#F7F0E2] hover:text-[#E1BE68] border border-[#C9973E]/40 hover:border-[#E1BE68] text-xs font-bold transition-all shadow-sm hover:scale-105"
                  >
                    {area.name} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          STATE 2: LOADING ("Finding Puja spots near you…")
      ============================================================ */}
      {geoStatus === 'loading' && (
        <section className="px-4 sm:px-8 py-20 max-w-md mx-auto text-center">
          <div className="bg-[#140E0C]/90 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border-2 border-[#C9973E]/50 shadow-2xl flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#8F1D18] border-t-[#E1BE68] animate-spin" />
              <Navigation className="w-6 h-6 text-[#E1BE68]" />
            </div>

            <h3 className="font-editorial text-2xl font-extrabold text-[#F7F0E2]">
              Finding Puja spots near you…
            </h3>
            <p className="text-xs text-[#F7F0E2]/80 leading-relaxed">
              Detecting your location and measuring distances to Kolkata&apos;s pandals, heritage baris, and Metro stations.
            </p>
          </div>
        </section>
      )}

      {/* ============================================================
          STATE 3: PERMISSION DENIED OR ERROR STATES
      ============================================================ */}
      {(geoStatus === 'denied' || geoStatus === 'unavailable' || geoStatus === 'timeout' || geoStatus === 'unsupported') && (
        <section className="px-4 sm:px-8 py-10 max-w-2xl mx-auto space-y-6">
          <div className="bg-[#140E0C]/90 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border-2 border-[#8F1D18] shadow-2xl text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#8F1D18]/40 border border-[#C9973E] flex items-center justify-center text-[#E1BE68]">
              <AlertCircle className="w-7 h-7" />
            </div>

            {geoStatus === 'denied' && (
              <>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                  Location access is disabled.
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-md leading-relaxed">
                  You can enable location permission in your browser settings or explore Puja by selecting a region or Metro station.
                </p>
              </>
            )}

            {geoStatus === 'unavailable' && (
              <>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                  Location unavailable.
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-md leading-relaxed">
                  We couldn&apos;t determine your location. Please try again or explore manually.
                </p>
              </>
            )}

            {geoStatus === 'timeout' && (
              <>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                  Location request timed out.
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-md leading-relaxed">
                  The request took longer than expected. Please try again or select a region below.
                </p>
              </>
            )}

            {geoStatus === 'unsupported' && (
              <>
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#F7F0E2]">
                  Location not supported.
                </h3>
                <p className="text-xs sm:text-sm text-[#F7F0E2]/85 max-w-md leading-relaxed">
                  Location access is unavailable in your browser. You can explore manually by region or Metro station.
                </p>
              </>
            )}

            {/* Error Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={requestLocation}
                className="py-3 px-6 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#E1BE68] text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E1BE68]" />
                <span>TRY AGAIN</span>
              </button>

              <Link
                href="/metro"
                className="py-3 px-5 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold uppercase tracking-wider transition-all"
              >
                EXPLORE METRO GUIDE
              </Link>

              <Link
                href="/bonedi"
                className="py-3 px-5 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold uppercase tracking-wider transition-all"
              >
                EXPLORE BONEDI BARI
              </Link>
            </div>
          </div>

          {/* Fallback region selector */}
          <div className="bg-[#140E0C]/85 backdrop-blur-xl p-6 rounded-3xl border border-[#C9973E]/40 shadow-xl space-y-3 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E1BE68] block">
              CHOOSE AN AREA INSTEAD
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_AREAS.map((area) => (
                <Link
                  key={area.name}
                  href={area.href}
                  className="px-4 py-2 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#F7F0E2] hover:text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold transition-all"
                >
                  {area.name} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          STATE 4: RESULTS ACTIVE (STREAMLINED & VISUALLY ELEVATED)
      ============================================================ */}
      {geoStatus === 'success' && userCoords && (
        <section className="px-4 sm:px-8 pt-4 max-w-5xl mx-auto space-y-5">
          {/* TOP DISCOVERY HEADER (SLEEK & INTEGRATED) */}
          <div className="bg-[#140E0C]/90 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-[#C9973E]/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Near You Status & Radius Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="font-editorial text-lg sm:text-xl font-bold text-[#F7F0E2]">
                  Pujas Near You
                </span>
              </div>

              {/* Radius Chips */}
              <div className="flex items-center gap-1 bg-[#241714] p-1 rounded-full border border-[#C9973E]/35">
                {[
                  { value: 1000, label: '1 km' },
                  { value: 3000, label: '3 km' },
                  { value: 5000, label: '5 km' },
                  { value: 'all', label: 'All' },
                ].map((rad) => {
                  const isSelected = selectedRadius === rad.value;
                  return (
                    <button
                      key={rad.label}
                      type="button"
                      onClick={() => setSelectedRadius(rad.value as any)}
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#8F1D18] text-[#F7F0E2] shadow-sm'
                          : 'text-[#F7F0E2]/70 hover:text-[#E1BE68]'
                      }`}
                    >
                      {rad.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Controls (Refresh & View Toggle) */}
            <div className="flex items-center justify-between md:justify-end gap-2.5">
              <button
                type="button"
                onClick={requestLocation}
                className="py-2 px-3 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Update your current GPS location"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-[#241714] p-1 rounded-full border border-[#C9973E]/40">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#8F1D18] text-[#F7F0E2] shadow-sm'
                      : 'text-[#F7F0E2]/70 hover:text-[#E1BE68]'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-[#8F1D18] text-[#F7F0E2] shadow-sm'
                      : 'text-[#F7F0E2]/70 hover:text-[#E1BE68]'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* HORIZONTAL CATEGORY FILTER TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All', count: counts.all, icon: Compass },
              { id: 'pandal', label: 'Pandals', count: counts.pandal, icon: Sparkles },
              { id: 'bonedi', label: 'Bonedi Bari', count: counts.bonedi, icon: Landmark },
              { id: 'metro', label: 'Metro', count: counts.metro, icon: Train },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#8F1D18] to-[#B52A22] text-[#F7F0E2] border border-[#E1BE68] shadow-md scale-[1.02]'
                      : 'bg-[#18110F]/90 text-[#F7F0E2]/80 hover:text-[#E1BE68] border border-[#C9973E]/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#E1BE68]" />
                  <span>{cat.label}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#120E0C]/80 text-[#E1BE68] font-bold">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ============================================================
              VIEW: MAP VIEW
          ============================================================ */}
          {viewMode === 'map' && (
            <div className="space-y-4 animate-fadeIn">
              <NearMeMap
                userCoords={userCoords}
                places={filteredPlaces}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={(id) => setSelectedPlaceId(id)}
              />

              {/* Selected place quick preview card */}
              {selectedPlaceId && (
                <div className="animate-fadeIn">
                  {filteredPlaces
                    .filter((p) => p.id === selectedPlaceId)
                    .map((place) => (
                      <NearMeCard key={place.id} place={place} />
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              VIEW: LIST VIEW (DEFAULT)
          ============================================================ */}
          {viewMode === 'list' && (
            <div className="space-y-4 animate-fadeIn">
              {filteredPlaces.length > 0 ? (
                <>
                  <div className="flex items-center justify-between text-xs text-[#E1BE68] font-semibold px-2">
                    <span>
                      {filteredPlaces.length} spot{filteredPlaces.length === 1 ? '' : 's'} sorted by closest distance
                    </span>
                    <span className="text-[#F7F0E2]/60 text-[11px]">
                      * Straight-line distance
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map((place, idx) => (
                      <NearMeCard
                        key={`${place.type}-${place.id}`}
                        place={place}
                        rank={idx + 1}
                        onSeeOnMap={handleSeeOnMap}
                      />
                    ))}
                  </div>
                </>
              ) : (
                /* NO RESULTS WITHIN SELECTED RADIUS */
                <div className="bg-[#140E0C]/90 backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-[#C9973E]/40 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-full bg-[#8F1D18]/30 border border-[#C9973E] flex items-center justify-center text-[#E1BE68]">
                    <Search className="w-6 h-6" />
                  </div>

                  <h3 className="font-editorial text-2xl font-extrabold text-[#F7F0E2]">
                    No locations found within {selectedRadius === 'all' ? 'the dataset' : `${(selectedRadius as number) / 1000} km`}.
                  </h3>
                  <p className="text-xs text-[#F7F0E2]/80 max-w-md leading-relaxed">
                    Try expanding your search radius to discover more pujas and metro gateways across Kolkata.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {selectedRadius !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedRadius(selectedRadius === 1000 ? 3000 : selectedRadius === 3000 ? 5000 : 'all')}
                        className="py-2.5 px-6 rounded-full bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] border border-[#E1BE68] text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        EXPAND SEARCH RADIUS
                      </button>
                    )}

                    <Link
                      href="/metro"
                      className="py-2.5 px-5 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      OPEN METRO GUIDE
                    </Link>

                    <Link
                      href="/bonedi"
                      className="py-2.5 px-5 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] border border-[#C9973E]/40 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      BROWSE BONEDI BARI
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MINIMAL FOOTER REGION JUMPER */}
          <div className="mt-12 pt-6 border-t border-[#C9973E]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#F7F0E2]/80">
            <span className="font-bold text-[#E1BE68]">
              Looking to explore another region?
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AREAS.map((area) => (
                <Link
                  key={area.name}
                  href={area.href}
                  className="px-3 py-1 rounded-full bg-[#241714] hover:bg-[#35120F] text-[#E1BE68] hover:text-[#F7F0E2] border border-[#C9973E]/40 text-[11px] font-bold transition-all"
                >
                  {area.name} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function NearMePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#E1BE68] border-t-transparent animate-spin" />
        </div>
      }
    >
      <NearMeContent />
    </Suspense>
  );
}
