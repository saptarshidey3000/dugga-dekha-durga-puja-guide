import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { ROUTES } from '@/data/routes';
import PandalCard from '@/components/PandalCard';
import { MapPin, Navigation, ArrowLeft, Footprints, Clock, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Link */}
      <Link
        href="/metro"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D99A3D] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Metro Hubs</span>
      </Link>

      {/* Station Hero Header */}
      <div className="bg-[#0B223D] border border-[#D99A3D]/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B93624] text-[#FFF8EC]">
            {metro.region}
          </span>
          <span className="text-xs text-[#D99A3D] font-medium">{metro.line}</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC]">
          {metro.name} Metro Station
        </h1>
        {metro.bengaliName && (
          <p className="text-base text-[#D99A3D] font-serif mt-1">{metro.bengaliName}</p>
        )}

        <p className="text-sm text-[#D8CEBE] max-w-2xl mt-3 leading-relaxed">
          {metro.description}
        </p>

        {/* Exit Gates Grid */}
        <div className="mt-8 pt-6 border-t border-[#D99A3D]/20">
          <h2 className="font-editorial text-lg font-bold text-[#FFF8EC] mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#D99A3D]" />
            <span>Verified Exit Gates & Walking Guidance</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {metro.exits.map((exit) => (
              <div
                key={exit.id}
                className="bg-[#071A2F] border border-[#D99A3D]/25 p-4 rounded-xl space-y-1 shadow-sm"
              >
                <span className="text-xs font-bold text-[#B93624] tracking-wide uppercase">
                  {exit.gateNumber}
                </span>
                <h3 className="font-semibold text-sm text-[#FFF8EC]">{exit.landmark}</h3>
                {exit.direction && (
                  <p className="text-xs text-[#D8CEBE]/80 pt-1 leading-snug">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#D99A3D]">
                Recommended Walking Circuit
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#FFF8EC]">
                Curated Routes Starting from {metro.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedRoutes.map((route) => (
              <Link
                key={route.id}
                href={`/route/${route.id}`}
                className="bg-[#0B223D] border border-[#D99A3D]/30 hover:border-[#D99A3D] p-5 rounded-2xl shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#D99A3D]">
                      {route.stopsCount} Pandals
                    </span>
                    <span className="text-xs text-[#D8CEBE]">
                      🚶 {route.estimatedDuration} • {route.totalWalkingDistance}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-xs text-[#D8CEBE]/80 mt-1 line-clamp-2">
                    {route.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#D99A3D] font-bold mt-4 pt-3 border-t border-[#D99A3D]/15 group-hover:translate-x-1 transition-transform">
                  <span>Start Walking Tour</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Connected Pandals List */}
      <div className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#FFF8EC]">
          Directly Accessible Pandals ({connectedPandals.length})
        </h2>

        {connectedPandals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        ) : (
          <div className="bg-[#0B223D] p-8 rounded-2xl text-center text-[#D8CEBE] text-xs">
            Connecting routes transit from this station into surrounding residential clusters.
          </div>
        )}
      </div>
    </div>
  );
}
