import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BONEDI_BARIS } from '@/data/bonedi';
import { Landmark, ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';

export function generateStaticParams() {
  return BONEDI_BARIS.map((b) => ({ id: b.id }));
}

export default async function BonediDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bonedi = BONEDI_BARIS.find((b) => b.id === id);

  if (!bonedi) {
    notFound();
  }

  return (
    <div className="section-cream min-h-screen py-8 sm:py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/bonedi"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B93624] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bonedi Baris</span>
        </Link>

        {/* Visual Banner */}
        <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden border border-[#D99A3D]/40 shadow-xl bg-[#3A2118]">
          <Image
            src={bonedi.image || '/pujo-mobile.png'}
            alt={bonedi.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A2118] via-[#3A2118]/30 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3A2118] text-[#D99A3D] border border-[#D99A3D]/40">
              {bonedi.area}
            </span>
            {bonedi.yearEstablished && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B93624] text-[#FFF8EC]">
                Est. {bonedi.yearEstablished}
              </span>
            )}
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-[#FFF8EC]">
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold">
              {bonedi.name}
            </h1>
            {bonedi.bengaliName && (
              <p className="text-base text-[#D99A3D] font-serif mt-1">{bonedi.bengaliName}</p>
            )}
          </div>
        </div>

        {/* Tactical Heritage Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#FAF0DC] p-4 rounded-2xl border border-[#D99A3D]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B93624] block mb-1">
              Nearest Metro Connection
            </span>
            <p className="font-bold text-base text-[#3A2118] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B93624]" />
              <span>{bonedi.nearestMetro} Metro</span>
            </p>
            <p className="text-xs text-[#5C3A2E] mt-1">
              Walking: <strong>{bonedi.walkingTime || '~5-8 min'}</strong> from station
            </p>
          </div>

          <div className="bg-[#FAF0DC] p-4 rounded-2xl border border-[#D99A3D]/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B93624] block mb-1">
              Address & Courtyard Location
            </span>
            <p className="font-semibold text-xs text-[#3A2118]">{bonedi.address}</p>
            {bonedi.directions && (
              <p className="text-xs text-[#5C3A2E] mt-1">👉 {bonedi.directions}</p>
            )}
          </div>
        </div>

        {/* Narrative Description & Heritage Note */}
        <div className="bg-[#FAF0DC] p-6 rounded-2xl border border-[#D99A3D]/40 space-y-4 shadow-sm text-[#3A2118]">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#B93624] mb-1">
              Family & Estate Heritage
            </h2>
            <p className="text-sm leading-relaxed text-[#3A2118]">
              {bonedi.description}
            </p>
          </div>

          {bonedi.heritageNote && (
            <div className="pt-3 border-t border-[#D99A3D]/25">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#B93624] mb-1">
                Notable Ritual & Iconography Features
              </h3>
              <p className="text-xs text-[#5C3A2E] italic leading-relaxed">
                &quot;{bonedi.heritageNote}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
