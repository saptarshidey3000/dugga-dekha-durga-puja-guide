import React from 'react';
import { notFound } from 'next/navigation';
import { BONEDI_AREAS, BONEDI_BARIS } from '@/data/bonedi';
import BonediAreaClient from '@/components/BonediAreaClient';
import BonediDetailClient from '@/components/BonediDetailClient';

export function generateStaticParams() {
  const areaParams = BONEDI_AREAS.map((a) => ({ id: a.id }));
  const bariParams = BONEDI_BARIS.map((b) => ({ id: b.id }));
  return [...areaParams, ...bariParams];
}

export default async function BonediDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Case 1: If id matches a Bonedi Area (Section 26 & 27: Area page + Step-by-Step Hopping)
  const area = BONEDI_AREAS.find((a) => a.id === id);
  if (area) {
    const barisInArea = BONEDI_BARIS.filter((b) => area.bariIds.includes(b.id));
    return <BonediAreaClient area={area} baris={barisInArea} />;
  }

  // Case 2: If id matches a specific Bonedi Bari (Individual Heritage House Detail)
  const bonedi = BONEDI_BARIS.find((b) => b.id === id);
  if (!bonedi) {
    notFound();
  }

  // Find associated area group
  const parentArea = BONEDI_AREAS.find((a) => a.bariIds.includes(bonedi.id));
  const siblingBaris = parentArea
    ? BONEDI_BARIS.filter((b) => parentArea.bariIds.includes(b.id))
    : [];
  const currentIndex = siblingBaris.findIndex((b) => b.id === bonedi.id);
  const nextBari =
    currentIndex >= 0 && currentIndex < siblingBaris.length - 1
      ? siblingBaris[currentIndex + 1]
      : null;

  return (
    <BonediDetailClient
      bonedi={bonedi}
      parentArea={parentArea}
      nextBari={nextBari}
    />
  );
}
