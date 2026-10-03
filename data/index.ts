export * from './types';
export * from './metros';
export * from './pandals';
export * from './routes';
export * from './bonedi';
export * from './categories';
export * from './puja';

import { PANDALS } from './pandals';
import { ROUTES } from './routes';
import { METRO_STATIONS } from './metros';
import { BONEDI_BARIS } from './bonedi';
import { Region, PandalCategory } from './types';

export function getPandalById(id: string) {
  return PANDALS.find((p) => p.id === id);
}

export function getRouteById(id: string) {
  return ROUTES.find((r) => r.id === id);
}

export function getMetroById(id: string) {
  return METRO_STATIONS.find((m) => m.id === id);
}

export function getBonediById(id: string) {
  return BONEDI_BARIS.find((b) => b.id === id);
}

export function getPandalsByMetro(metroId: string) {
  return PANDALS.filter((p) => p.nearestMetroId === metroId);
}

export function getRoutesByMetro(metroId: string) {
  return ROUTES.filter((r) => r.metroStationId === metroId);
}

export function getPandalsByRegion(region: Region) {
  return PANDALS.filter((p) => p.region === region);
}

export function getRoutesByRegion(region: Region) {
  return ROUTES.filter((r) => r.region === region);
}

export function getPandalsByCategory(category: PandalCategory) {
  return PANDALS.filter((p) => p.category.includes(category));
}
