import React from 'react';
import { notFound } from 'next/navigation';
import { ROUTES } from '@/data/routes';
import { PANDALS } from '@/data/pandals';
import { METRO_STATIONS } from '@/data/metros';
import RouteDetailClient from '@/components/RouteDetailClient';

export function generateStaticParams() {
  return ROUTES.map((r) => ({ routeId: r.id }));
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const { routeId } = await params;
  const route = ROUTES.find((r) => r.id === routeId);

  if (!route) {
    notFound();
  }

  const pandals = route.stops
    .map((s) => PANDALS.find((p) => p.id === s.pandalId))
    .filter(Boolean) as typeof PANDALS;

  const metroStation = METRO_STATIONS.find((m) => m.id === route.metroStationId);

  return (
    <RouteDetailClient
      route={route}
      pandals={pandals}
      metroStation={metroStation}
    />
  );
}
