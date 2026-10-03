'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { METRO_STATIONS } from '@/data/metros';
import { PANDALS } from '@/data/pandals';
import { ROUTES } from '@/data/routes';
import { Region } from '@/data/types';
import { MapPin, ArrowRight, Footprints, Navigation, Compass } from 'lucide-react';

export default function MetroDirectoryPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions: Region[] = [
    'South Kolkata',
    'North Kolkata',
    'Central Kolkata',
    'East / West Metro',
  ];

  const filteredStations =
    selectedRegion === 'all'
      ? METRO_STATIONS
      : METRO_STATIONS.filter((m) => m.region === selectedRegion);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#D99A3D]/20">
        <span className="text-xs font-bold uppercase tracking-widest text-[#B93624]">
          Transit Navigation
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF8EC] mt-1">
          Kolkata Metro Puja Hubs
        </h1>
        <p className="text-xs sm:text-sm text-[#D8CEBE]/80 mt-2 max-w-2xl leading-relaxed">
          The secret to effortless Puja hopping is choosing the right Metro station and taking the designated exit gate. Select your station to view verified walking routes and direct pandals.
        </p>
      </div>

      {/* Region Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRegion('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
            selectedRegion === 'all'
              ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
              : 'bg-[#0B223D] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
          }`}
        >
          All Metro Lines ({METRO_STATIONS.length})
        </button>
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
              selectedRegion === reg
                ? 'bg-[#B93624] text-[#FFF8EC] border-[#B93624] shadow-md'
                : 'bg-[#0B223D] text-[#D8CEBE] border-[#D99A3D]/25 hover:border-[#D99A3D]'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Metro Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map((station) => {
          const directPandals = PANDALS.filter((p) => p.nearestMetroId === station.id);
          const stationRoutes = ROUTES.filter((r) => r.metroStationId === station.id);

          return (
            <div
              key={station.id}
              className="bg-[#0B223D] border border-[#D99A3D]/25 hover:border-[#D99A3D]/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Station Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#071A2F] text-[#D99A3D] px-2.5 py-1 rounded-full border border-[#D99A3D]/30">
                    {station.line}
                  </span>
                  <span className="text-[11px] font-semibold text-[#B93624]">
                    {station.region}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl font-bold text-[#FFF8EC] group-hover:text-[#D99A3D] transition-colors">
                  {station.name}
                </h3>
                {station.bengaliName && (
                  <p className="text-xs text-[#D8CEBE]/80 font-serif mb-2">{station.bengaliName}</p>
                )}

                <p className="text-xs text-[#D8CEBE]/90 line-clamp-2 mb-4 leading-relaxed">
                  {station.description}
                </p>

                {/* Exits Summary */}
                <div className="bg-[#071A2F]/80 p-3 rounded-xl border border-[#D99A3D]/15 space-y-1.5 text-xs text-[#D8CEBE] mb-4">
                  <span className="font-bold text-[#FFF8EC] block text-[11px] uppercase tracking-wider text-[#D99A3D]">
                    Verified Exits ({station.exits.length})
                  </span>
                  {station.exits.slice(0, 2).map((exit) => (
                    <div key={exit.id} className="text-[11px]">
                      <span className="font-semibold text-[#FFF8EC]">{exit.gateNumber}: </span>
                      <span>{exit.landmark}</span>
                    </div>
                  ))}
                  {station.exits.length > 2 && (
                    <span className="text-[10px] text-[#D99A3D] block">
                      +{station.exits.length - 2} more exits...
                    </span>
                  )}
                </div>

                {/* Direct Pandals Preview */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D8CEBE] block mb-1.5">
                    Nearby Pandals ({directPandals.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {directPandals.slice(0, 4).map((p) => (
                      <span
                        key={p.id}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-[#071A2F] text-[#FFF8EC] border border-[#D99A3D]/20"
                      >
                        {p.name}
                      </span>
                    ))}
                    {directPandals.length > 4 && (
                      <span className="text-[10px] text-[#D99A3D] self-center">
                        +{directPandals.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Station Card Actions */}
              <div className="pt-3 border-t border-[#D99A3D]/15 flex items-center justify-between">
                <span className="text-xs text-[#D8CEBE]">
                  {stationRoutes.length > 0 ? `${stationRoutes.length} Walking Routes` : 'Direct Walking'}
                </span>
                <Link
                  href={`/metro/${station.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#B93624] hover:bg-[#cf412e] text-[#FFF8EC] text-xs font-semibold shadow-md transition-colors"
                >
                  <span>Explore Station Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
