import React from 'react';
import { notFound } from 'next/navigation';
import { PANDALS } from '@/data/pandals';
import PandalDetailClient from '@/components/PandalDetailClient';

export function generateStaticParams() {
  return PANDALS.map((p) => ({ pandalId: p.id }));
}

export default async function PandalDetailPage({
  params,
}: {
  params: Promise<{ pandalId: string }>;
}) {
  const { pandalId } = await params;
  const pandal = PANDALS.find((p) => p.id === pandalId);

  if (!pandal) {
    notFound();
  }

  return <PandalDetailClient pandal={pandal} />;
}
