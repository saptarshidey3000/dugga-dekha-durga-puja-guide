'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BONEDI_AREAS, BONEDI_BARIS } from '@/data/bonedi';
import BonediCard from '@/components/BonediCard';
import QuickJumpDropdown, { DropdownItem } from '@/components/QuickJumpDropdown';
import { Landmark, ArrowRight, Search, X, MapPin, Compass, Navigation } from 'lucide-react';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] bg-[#120E0C]/90 rounded-3xl animate-pulse border border-[#C9973E]/40 flex items-center justify-center text-xs text-[#E1BE68]">
      Loading Kolkata Bonedi Bari Spatial Map...
    </div>
  ),
});

export default function BonediLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedEnclaveFilter, setSelectedEnclaveFilter] = useState<string>('all');
  const [selectedBariId, setSelectedBariId] = useState<string | null>(null);

  const filteredBonedi = searchQuery.trim()
    ? BONEDI_BARIS.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.nearestMetro.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Baris to display on the spatial map based on enclave filter
  const mapBaris = selectedEnclaveFilter === 'all'
    ? BONEDI_BARIS
    : BONEDI_BARIS.filter((b) => {
        const area = BONEDI_AREAS.find((a) => a.id === selectedEnclaveFilter);
        return area ? area.bariIds.includes(b.id) : true;
      });

  // Handle clicking "See on Map" from any card
  const handleSeeOnMap = (bariId: string) => {
    setSelectedBariId(bariId);
    setShowMap(true);
    // Find if belongs to specific area
    const parentArea = BONEDI_AREAS.find((a) => a.bariIds.includes(bariId));
    if (parentArea && selectedEnclaveFilter !== 'all' && selectedEnclaveFilter !== parentArea.id) {
      setSelectedEnclaveFilter('all');
    }
    const mapSection = document.getElementById('bonedi-spatial-map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Dropdown items: Enclaves + Historic Households
  const bonediDropdownItems: DropdownItem[] = [
    // Group 1: 6 Heritage Enclaves
    ...BONEDI_AREAS.map((area) => ({
      id: `area-${area.id}`,
      title: `${area.name} Enclave`,
      subtitle: area.bengaliName,
      badge: `${area.bariIds.length} Baris`,
      group: '🏛️ Heritage Enclaves (Walking Routes)',
      highlight: `Metro: ${area.nearestMetro}`,
      href: `/bonedi/${area.id}`,
      icon: '🏛️',
    })),
    // Group 2: All Historic Bonedi Bari Estates
    ...BONEDI_BARIS.map((bari) => ({
      id: `bari-${bari.id}`,
      title: bari.name,
      subtitle: bari.bengaliName,
      badge: bari.yearEstablished ? `Est. ${bari.yearEstablished}` : bari.area,
      group: '🚪 Verified Historic Households',
      highlight: `Metro: ${bari.nearestMetro} (${bari.walkingTime || 'Direct'})`,
      href: `/bonedi/${bari.id}`,
      icon: '🚪',
    })),
  ];

  return (
    <div className="bg-transparent min-h-screen py-10 sm:py-14 px-4 sm:px-8 text-[#F7F0E2]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative z-40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8F1D18] text-[#E1BE68] text-[11px] font-black tracking-widest uppercase border border-[#C9973E]/50 shadow-sm self-start">
              <Landmark className="w-3.5 h-3.5" />
              <span>Kolkata Heritage Courtyard Guide</span>
            </div>

            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241714] hover:bg-[#8F1D18] border border-[#C9973E]/50 text-xs font-bold text-[#E1BE68] hover:text-[#F7F0E2] transition-colors shadow-lg self-start sm:self-auto cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#E1BE68]" />
              <span>{showMap ? 'Hide Heritage Map ✕' : '🗺️ View All on Spatial Map'}</span>
            </button>
          </div>

          <div>
            <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-[#F7F0E2] tracking-tight">
              BONEDI BARI GUIDE
            </h1>
            <p className="font-editorial text-xl sm:text-2xl text-[#E1BE68] font-bold mt-1">
              Choose Your Heritage Area
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#F7F0E2]/85 max-w-2xl leading-relaxed">
            Before the grand community Sarbojanin pandals, Kolkata’s festival lived inside ancestral courtyards. Experience authentic Thakurdalans, antique Belgian glass chandeliers, and family worship rituals spanning over three centuries.
          </p>

          {/* Quick Jump Dropdown for Bonedi Baris & Enclaves */}
          <div className="pt-3 border-t border-[#C9973E]/30">
            <QuickJumpDropdown
              items={bonediDropdownItems}
              label="⚡ Quick Jump to Heritage Enclave or Household (18 Baris):"
              placeholder="Select an Enclave or Bonedi Bari to jump directly..."
              icon={<Compass className="w-4 h-4 text-[#E1BE68]" />}
              variant="bonedi"
            />
          </div>
        </div>

        {/* Spatial Heritage Map Drawer (Section 14 & 16) */}
        {showMap && (
          <div
            id="bonedi-spatial-map-section"
            className="bg-[#120E0C]/95 border-2 border-[#C9973E]/50 p-5 rounded-3xl shadow-2xl animate-fadeIn space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9973E]/30 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#E1BE68] block">
                  Interactive Spatial Map
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#F7F0E2]">
                  Kolkata Heritage Courtyard Locations ({mapBaris.length} Baris Plotted)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://maps.google.com/?q=Kolkata+Bonedi+Bari+Durga+Puja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#241714] text-[#E1BE68] hover:bg-[#8F1D18] hover:text-[#F7F0E2] text-xs font-bold border border-[#C9973E]/40 transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open in Google Maps ↗</span>
                </a>

                <button
                  onClick={() => setShowMap(false)}
                  className="text-xs text-[#F7F0E2]/70 hover:text-white font-bold px-3 py-1.5 rounded-full bg-[#241714] border border-[#C9973E]/40"
                >
                  Close Map ✕
                </button>
              </div>
            </div>

            {/* Enclave Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-[#E1BE68] uppercase tracking-wider shrink-0 mr-1">
                Filter Enclave:
              </span>
              <button
                onClick={() => setSelectedEnclaveFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                  selectedEnclaveFilter === 'all'
                    ? 'bg-[#8F1D18] text-[#F7F0E2] border border-[#E1BE68]'
                    : 'bg-[#241714] text-[#F7F0E2]/80 hover:bg-[#35120F] border border-[#C9973E]/30'
                }`}
              >
                All Baris ({BONEDI_BARIS.length})
              </button>
              {BONEDI_AREAS.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedEnclaveFilter(area.id)}
                  className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                    selectedEnclaveFilter === area.id
                      ? 'bg-[#8F1D18] text-[#F7F0E2] border border-[#E1BE68]'
                      : 'bg-[#241714] text-[#F7F0E2]/80 hover:bg-[#35120F] border border-[#C9973E]/30'
                  }`}
                >
                  {area.name} ({area.bariIds.length})
                </button>
              ))}
            </div>

            {/* Interactive Leaflet Map */}
            <InteractiveMap
              bonediBaris={mapBaris}
              selectedPandalId={selectedBariId}
              onSelectPandal={(id) => setSelectedBariId(id)}
              heightClass="h-[440px] sm:h-[500px]"
            />

            {/* Selected Bonedi Bari Preview Pill */}
            {selectedBariId && (
              <div className="bg-[#241714] p-3.5 rounded-2xl border border-[#C9973E]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {(() => {
                  const b = BONEDI_BARIS.find((item) => item.id === selectedBariId);
                  if (!b) return null;
                  return (
                    <>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#E1BE68] uppercase">Selected House:</span>
                        <h4 className="font-editorial text-base font-bold text-[#F7F0E2]">
                          🏛️ {b.name} {b.bengaliName && `(${b.bengaliName})`}
                        </h4>
                        <p className="text-[11px] text-[#F7F0E2]/80">
                          📍 {b.address} • 🚇 {b.nearestMetro} ({b.walkingTime || 'Walkable'})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <a
                          href={b.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(b.name + ' Kolkata')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-[#8F1D18] hover:bg-[#B52A22] text-[#F7F0E2] font-bold transition-colors"
                        >
                          Google Maps ↗
                        </a>
                        <Link
                          href={`/bonedi/${b.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#C9973E] hover:bg-[#E1BE68] text-[#120E0C] font-black transition-colors"
                        >
                          View Details →
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* 6 Area Cards Grid — Entire card is clickable */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#120E0C]/90 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-[#C9973E]/40 shadow-md">
            <span className="text-xs font-black uppercase tracking-wider text-[#E1BE68] flex items-center gap-1.5">
              <span>🏛️</span>
              <span>6 Heritage Enclaves</span>
            </span>
            <span className="text-xs text-[#F7F0E2]/80 font-medium">
              Total {BONEDI_BARIS.length} Historic Aristocratic Households • Tap any card to open
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BONEDI_AREAS.map((area) => {
              const housesInArea = BONEDI_BARIS.filter((b) => area.bariIds.includes(b.id));

              return (
                <Link
                  key={area.id}
                  href={`/bonedi/${area.id}`}
                  className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 hover:border-[#E1BE68] rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all hover:-translate-y-1 group cursor-pointer block text-left"
                >
                  <div className="space-y-4">
                    {/* Header: Area & Count */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
                          Heritage Enclave
                        </span>
                        <h2 className="font-editorial text-2xl font-bold text-[#F7F0E2] group-hover:text-[#E1BE68] transition-colors">
                          {area.name}
                        </h2>
                        <span className="text-xs text-[#E1BE68] font-serif block">
                          {area.bengaliName}
                        </span>
                      </div>
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E]/40 shadow-xs">
                        {area.bariIds.length} Bonedi Baris
                      </span>
                    </div>

                    {/* Metro Hub Connection */}
                    <div className="bg-[#241714]/80 p-3 rounded-2xl border border-[#C9973E]/30 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#E1BE68]">
                        <MapPin className="w-3.5 h-3.5 text-[#E1BE68]" />
                        <span>🚇 {area.nearestMetro}</span>
                      </div>
                      {area.metroExit && (
                        <p className="text-[11px] text-[#F7F0E2]/70 pl-5">
                          {area.metroExit}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#F7F0E2]/80 leading-relaxed">
                      {area.description}
                    </p>

                    {/* Prominent Households list */}
                    <div className="pt-2 border-t border-[#C9973E]/30">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block mb-2">
                        Prominent Courtyards:
                      </span>
                      <ul className="space-y-1 text-xs text-[#F7F0E2]/90">
                        {housesInArea.slice(0, 4).map((house) => (
                          <li key={house.id} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E1BE68]" />
                            <span className="font-medium line-clamp-1">{house.name}</span>
                          </li>
                        ))}
                        {housesInArea.length > 4 && (
                          <li className="text-[11px] text-[#E1BE68] font-semibold pl-3">
                            + {housesInArea.length - 4} more heritage estates
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Primary CTA Visual Indicator */}
                  <div
                    className="mt-6 w-full py-3.5 rounded-2xl bg-[#8F1D18] group-hover:bg-[#B52A22] text-[#F7F0E2] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md transition-all border border-[#C9973E]/50 group-hover:scale-[1.01]"
                  >
                    <span>EXPLORE {area.name.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E1BE68] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Search for Specific House */}
        <div className="bg-[#120E0C]/90 backdrop-blur-md border-2 border-[#C9973E]/40 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#F7F0E2]">
                Looking for a Specific Ancestral House?
              </h3>
              <p className="text-xs text-[#F7F0E2]/70">
                Search across all {BONEDI_BARIS.length} verified Bonedi Baris by household name, area, or nearest Metro.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#E1BE68]">
              {BONEDI_BARIS.length} verified historic estates
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#E1BE68]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bonedi Bari (e.g. Shobhabazar Boro Rajbari, Laha Bari, Rani Rashmoni)..."
              className="w-full bg-[#241714] border border-[#C9973E]/40 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F7F0E2] placeholder-[#F7F0E2]/50 focus:outline-none focus:border-[#E1BE68]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-[#F7F0E2]/60 hover:text-[#F7F0E2]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="pt-2">
              <span className="text-xs font-bold text-[#E1BE68] block mb-3">
                Found {filteredBonedi.length} results:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBonedi.map((bonedi) => (
                  <BonediCard key={bonedi.id} bonedi={bonedi} onSeeOnMap={handleSeeOnMap} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
