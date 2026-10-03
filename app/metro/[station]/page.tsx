import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { ROUTES } from '@/data/routes';
import PandalCard from '@/components/PandalCard';
import { MapPin, Navigation, ArrowLeft, Footprints, Clock, ArrowRight } from 'lucide-react';

export function generateStaticParams() {
  return METRO_STATIONS.map((m) => ({ station: m.id }));
}

export default async function MetroStationDetailPage({
  params,
}: {
  params: Promise<{ station: string }>;
}) {
  const { station: stationId } = await params;
  const metro = METRO_STATIONS.find((m) => m.id === stationId);

  if (!metro) {
    notFound();
  }

  const connectedPandals = PANDALS.filter((p) => p.nearestMetroId === metro.id);
  const connectedRoutes = ROUTES.filter((r) => r.metroStationId === metro.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 bg-transparent text-[#120E0C]">
      {/* Back Link */}
      <Link
        href={`/metro?region=${encodeURIComponent(metro.region)}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-xs font-bold text-[#8F1D18] hover:text-[#B52A22] border border-[#C9973E]/40 shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#8F1D18]" />
        <span>← Back to {metro.region} Metro Hubs</span>
      </Link>

      {/* Station Hero Header (Poster Style) */}
      <div className="bg-gradient-to-br from-[#7E1815] via-[#7E1815] to-[#35120F] border border-[#D6A13A]/40 rounded-2xl p-6 sm:p-8 shadow-xl text-[#F8F0DF]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#35120F] text-[#E7C46A] border border-[#D6A13A]/40">
            {metro.region}
          </span>
          <span className="text-xs text-[#E7C46A] font-medium">{metro.line}</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F8F0DF]">
          {metro.name} Metro Station
        </h1>
        {metro.bengaliName && (
          <p className="text-base text-[#E7C46A] font-serif mt-1">{metro.bengaliName}</p>
        )}

        <p className="text-sm text-[#F8F0DF]/90 max-w-2xl mt-3 leading-relaxed">
          {metro.description}
        </p>

        {/* Exit Gates Grid */}
        <div className="mt-8 pt-6 border-t border-[#D6A13A]/25">
          <h2 className="font-editorial text-lg font-bold text-[#E7C46A] mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#E7C46A]" />
            <span>Verified Exit Gates & Walking Guidance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {metro.exits.map((exit) => (
              <div
                key={exit.id}
                className="bg-[#35120F]/80 border border-[#D6A13A]/30 p-4 rounded-xl space-y-1 shadow-sm"
              >
                <span className="text-xs font-bold text-[#E7C46A] tracking-wide uppercase">
                  {exit.gateNumber}
                </span>
                <h3 className="font-bold text-sm text-[#F8F0DF]">{exit.landmark}</h3>
                {exit.direction && (
                  <p className="text-xs text-[#F8F0DF]/80 pt-1 leading-snug">
                    👉 {exit.direction}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curated Routes Originating Here */}
      {connectedRoutes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B52B20]">
                Recommended Walking Circuit
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#7E1815]">
                Curated Circuits Starting from {metro.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/route/${route.id}`}
                className="bg-[#FFFFFF] border border-[#D6A13A]/30 hover:border-[#D6A13A] p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#7E1815]">
                      {route.stopsCount} Pandals
                    </span>
                    <span className="text-xs text-[#5A4E46]">
                      🚶 {route.estimatedDuration} • {route.totalWalkingDistance}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#171311] group-hover:text-[#B52B20] transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-xs text-[#5A4E46] mt-1 line-clamp-2">
                    {route.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#B52B20] font-bold mt-4 pt-3 border-t border-[#D6A13A]/20 group-hover:translate-x-1 transition-transform">
                  <span>Start Walking Tour</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D6A13A]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Connected Pandals List */}
      <div className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#7E1815]">
          Directly Accessible Pandals ({connectedPandals.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </div>
    </div>
  );
}
