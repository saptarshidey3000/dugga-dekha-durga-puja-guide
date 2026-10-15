import { PANDALS } from '@/data/pandals';
import { BONEDI_BARIS } from '@/data/bonedi';
import { METRO_STATIONS } from '@/data/metros';
import { Pandal, BonediBari, MetroStation } from '@/data/types';
import { calculateDistanceMeters } from './proximity';

export type PlaceType = 'pandal' | 'bonedi' | 'metro';

export interface NearbyPlace {
  id: string;
  name: string;
  bengaliName?: string;
  type: PlaceType;
  typeLabel: 'Pandal' | 'Bonedi Bari' | 'Metro Station';
  categoryLabel?: string;
  region: string;
  area: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  formattedDistance: string;
  address: string;
  description: string;
  nearestMetro?: string;
  metroExit?: string;
  walkingTime?: string;
  detailUrl: string;
  googleMapsDirectionsUrl: string;
  image?: string;
  yearEstablished?: string | number;
  pandalData?: Pandal;
  bonediData?: BonediBari;
  metroData?: MetroStation;
}

/**
 * Formats straight-line distance in human-readable Kolkata street navigation format
 * Example: "250 m away", "850 m away", "1.4 km away"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m away`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km away`;
}

/**
 * Builds an external Google Maps walking directions URL.
 * Never claims user location unless coordinates are explicitly provided.
 */
export function buildDirectionsUrl(
  destLat: number,
  destLng: number,
  userLat?: number,
  userLng?: number,
  destName?: string
): string {
  if (userLat !== undefined && userLng !== undefined) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}&travelmode=walking`;
  }
  if (destName) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${destName} Kolkata`)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
}

/**
 * Calculates straight-line distance to all pandals, bonedi baris, and metro stations.
 * Filters by radius (in meters) and sorts by distance ascending.
 * Missing or invalid coordinates are excluded.
 */
export function getNearbyPlaces(
  userLat: number,
  userLng: number,
  radiusMeters: number | 'all' = 3000
): NearbyPlace[] {
  const results: NearbyPlace[] = [];

  // 1. Process Durga Puja Pandals
  for (const p of PANDALS) {
    if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') continue;
    if (isNaN(p.latitude) || isNaN(p.longitude)) continue;

    const distance = calculateDistanceMeters(userLat, userLng, p.latitude, p.longitude);

    if (radiusMeters !== 'all' && distance > radiusMeters) continue;

    const catLabel = p.category && p.category.length > 0 
      ? p.category[0] === 'must-visit' ? 'Must-Visit Pandal' : `${p.category[0]} Pandal`
      : 'Pandal';

    results.push({
      id: p.id,
      name: p.name,
      bengaliName: p.bengaliName,
      type: 'pandal',
      typeLabel: 'Pandal',
      categoryLabel: catLabel,
      region: p.region,
      area: p.area,
      latitude: p.latitude,
      longitude: p.longitude,
      distanceMeters: distance,
      formattedDistance: formatDistance(distance),
      address: p.address,
      description: p.description,
      nearestMetro: p.nearestMetro,
      metroExit: p.metroExit,
      walkingTime: p.walkingTime,
      detailUrl: `/pandal/${p.id}`,
      googleMapsDirectionsUrl: buildDirectionsUrl(p.latitude, p.longitude, userLat, userLng, p.name),
      yearEstablished: p.yearEstablished,
      pandalData: p,
    });
  }

  // 2. Process Bonedi Bari (Heritage Pujas)
  for (const b of BONEDI_BARIS) {
    if (typeof b.latitude !== 'number' || typeof b.longitude !== 'number') continue;
    if (isNaN(b.latitude) || isNaN(b.longitude)) continue;

    const distance = calculateDistanceMeters(userLat, userLng, b.latitude, b.longitude);

    if (radiusMeters !== 'all' && distance > radiusMeters) continue;

    results.push({
      id: b.id,
      name: b.name,
      bengaliName: b.bengaliName,
      type: 'bonedi',
      typeLabel: 'Bonedi Bari',
      categoryLabel: 'Heritage Courtyard',
      region: b.region,
      area: b.area,
      latitude: b.latitude,
      longitude: b.longitude,
      distanceMeters: distance,
      formattedDistance: formatDistance(distance),
      address: b.address,
      description: b.description,
      nearestMetro: b.nearestMetro,
      metroExit: b.metroExit,
      walkingTime: b.walkingTime,
      detailUrl: `/bonedi/${b.id}`,
      googleMapsDirectionsUrl: buildDirectionsUrl(b.latitude, b.longitude, userLat, userLng, b.name),
      image: b.image || b.imageUrl || '/bonedi-mobile.png',
      yearEstablished: b.yearEstablished,
      bonediData: b,
    });
  }

  // 3. Process Metro Stations
  for (const m of METRO_STATIONS) {
    if (!m.coordinates || m.coordinates.length < 2) continue;
    const [mLat, mLng] = m.coordinates;
    if (typeof mLat !== 'number' || typeof mLng !== 'number') continue;
    if (isNaN(mLat) || isNaN(mLng)) continue;

    const distance = calculateDistanceMeters(userLat, userLng, mLat, mLng);

    if (radiusMeters !== 'all' && distance > radiusMeters) continue;

    results.push({
      id: m.id,
      name: `${m.name} Metro Station`,
      bengaliName: m.bengaliName ? `${m.bengaliName} মেট্রো` : undefined,
      type: 'metro',
      typeLabel: 'Metro Station',
      categoryLabel: m.line || 'Metro Station',
      region: m.region,
      area: m.name,
      latitude: mLat,
      longitude: mLng,
      distanceMeters: distance,
      formattedDistance: formatDistance(distance),
      address: m.recommendedExit || `${m.region}, Kolkata`,
      description: m.description || `Metro gateway in ${m.region} connecting nearby pandals and heritage spots.`,
      nearestMetro: m.name,
      detailUrl: `/metro/${m.id}`,
      googleMapsDirectionsUrl: buildDirectionsUrl(mLat, mLng, userLat, userLng, `${m.name} Metro Station`),
      metroData: m,
    });
  }

  // Sort by straight-line distance, closest first
  return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
