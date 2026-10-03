'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BonediBari } from '@/data/types';
import { BonediAreaGroup } from '@/data/bonedi';
import { ArrowLeft, MapPin, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] bg-[#EEE1C8]/60 rounded-2xl animate-pulse border border-[#C9973E]/30" />
  ),
});

interface BonediDetailClientProps {
  bonedi: BonediBari;
  parentArea?: BonediAreaGroup;
  nextBari?: BonediBari | null;
}

export default function BonediDetailClient({
  bonedi,
  parentArea,
  nextBari,
}: BonediDetailClientProps) {
  return (
    <div className="bg-transparent min-h-screen py-8 sm:py-12 px-4 sm:px-6 text-[#120E0C]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C9973E]/30">
          <Link
            href={parentArea ? `/bonedi/${parentArea.id}` : '/bonedi'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F1D18] hover:text-[#B52A22] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#B52A22]" />
            <span>
              {parentArea
                ? `Back to ${parentArea.name} Hopping Circuit`
                : 'Back to All Bonedi Baris'}
            </span>
          </Link>

          {parentArea && (
            <Link
              href={`/bonedi/${parentArea.id}`}
              className="text-xs font-bold text-[#8F1D18] hover:underline"
            >
              Start Full Area Tour →
            </Link>
          )}
        </div>

        {/* Visual Banner (Section 18 & 06 Palette) */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-[#C9973E]/40 shadow-2xl bg-[#241714]">
          <Image
            src={bonedi.image || '/bonedi-mobile.png'}
            alt={bonedi.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
          {/* Subtle bottom gradient purely for title contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8F1D18] text-[#F7F0E2] border border-[#C9973E]/40">
              {bonedi.area}
            </span>
            {bonedi.yearEstablished && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C9973E] text-[#120E0C]">
                Est. {bonedi.yearEstablished}
              </span>
            )}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-[#F7F0E2]">
            <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-[#F7F0E2]">
              {bonedi.name}
            </h1>
            {bonedi.bengaliName && (
              <p className="text-base text-[#E1BE68] font-serif mt-1">
                {bonedi.bengaliName}
              </p>
            )}
          </div>
        </div>

        {/* Tactical Heritage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#120E0C]/90 backdrop-blur-md p-4 rounded-2xl border border-[#C9973E]/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
              Nearest Metro Hub
            </span>
            <p className="font-bold text-base text-[#F7F0E2] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E1BE68]" />
              <span>{bonedi.nearestMetro} Metro</span>
            </p>
            <p className="text-xs text-[#F7F0E2]/80">
              {bonedi.metroExit || 'Main Gate Exit'} • Walking:{' '}
              <strong className="text-[#E1BE68]">{bonedi.walkingTime || '~5 min'}</strong>
            </p>
          </div>

          <div className="bg-[#120E0C]/90 backdrop-blur-md p-4 rounded-2xl border border-[#C9973E]/40 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E1BE68] block">
              Courtyard Address & Direction
            </span>
            <p className="font-semibold text-xs text-[#F7F0E2]">{bonedi.address}</p>
            {bonedi.directions && (
              <p className="text-xs text-[#E1BE68] font-medium pt-1">
                👉 {bonedi.directions}
              </p>
            )}
            {bonedi.googleMapsUrl && (
              <div className="pt-2">
                <a
                  href={bonedi.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E1BE68] hover:text-white underline"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open in Google Maps ↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Narrative Description & Heritage Note */}
        <div className="bg-[#120E0C]/90 backdrop-blur-md p-6 rounded-2xl border border-[#C9973E]/40 space-y-4 shadow-xl text-[#F7F0E2]">
          {bonedi.founderHistory && bonedi.founderHistory !== bonedi.description && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
                Founder History
              </h2>
              <p className="text-sm leading-relaxed text-[#F7F0E2]/85">
                {bonedi.founderHistory}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
              Family & Estate Heritage
            </h2>
            <p className="text-sm leading-relaxed text-[#F7F0E2]/85">
              {bonedi.description}
            </p>
          </div>

          {bonedi.heritageNote && (
            <div className="pt-3 border-t border-[#C9973E]/30">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#E1BE68] mb-1">
                Notable Ritual & Iconography Features
              </h3>
              <p className="text-xs text-[#F7F0E2]/80 italic leading-relaxed">
                &quot;{bonedi.heritageNote}&quot;
              </p>
            </div>
          )}
        </div>

        {/* NEXT STOP IN THE CIRCUIT (Section 18 & 27) */}
        {nextBari && (
          <div className="bg-gradient-to-r from-[#8F1D18] to-[#B52A22] p-5 sm:p-6 rounded-2xl shadow-xl border-2 border-[#C9973E] text-[#F7F0E2]">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-1.5 text-[#E1BE68]">
              <span>NEXT STOP IN CIRCUIT</span>
              <span>{parentArea?.name} Walking Tour</span>
            </div>

            <h3 className="font-editorial text-2xl font-bold">
              🏛️ {nextBari.name}
            </h3>
            {nextBari.directions && (
              <p className="text-xs text-[#F7F0E2]/90 mt-1 mb-4 leading-relaxed">
                {nextBari.directions}
              </p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <span className="text-xs font-semibold text-[#E1BE68]">
                🚶 {nextBari.walkingTime || '~5 min walk'}
              </span>
              <Link
                href={`/bonedi/${nextBari.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7F0E2] text-[#8F1D18] text-xs font-bold shadow-md hover:bg-white transition-colors"
              >
                <span>Go to Next House</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B52A22]" />
              </Link>
            </div>
          </div>
        )}

        {/* Map Coordinates */}
        {bonedi.latitude && bonedi.longitude && (
          <div className="bg-[#EEE1C8]/40 border border-[#C9973E]/30 p-4 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#8F1D18] uppercase">
              <span>Courtyard Map Location</span>
              <span className="text-[#241714]/70">
                {bonedi.latitude.toFixed(4)}, {bonedi.longitude.toFixed(4)}
              </span>
            </div>
            <InteractiveMap
              bonediBaris={[bonedi]}
              center={[bonedi.latitude, bonedi.longitude]}
              zoom={16}
              heightClass="h-[300px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
