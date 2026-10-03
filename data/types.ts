export type Region = 
  | 'South Kolkata'
  | 'North Kolkata'
  | 'Central Kolkata'
  | 'Salt Lake + New Town'
  | 'Dum Dum'
  | 'Dum Dum Area'
  | 'East / West Metro';

export type PandalCategory = 
  | 'must-visit'
  | 'best-theme'
  | 'traditional'
  | 'heritage';

export type CrowdLevel = 
  | 'Low'
  | 'Moderate'
  | 'Busy'
  | 'Very Crowded';

export interface MetroExit {
  id: string;
  gateNumber: string;
  landmark: string;
  direction?: string;
}

export interface MetroStation {
  id: string;
  name: string;
  bengaliName?: string;
  line: 'Blue Line (North-South)' | 'Green Line (East-West)' | 'Purple Line' | string;
  region: Region;
  exits: MetroExit[];
  description?: string;
  coordinates: [number, number];
  popularFor?: string[];
  recommendedExit?: string;
  googleMapsUrl?: string;
  totalPandals?: number;
  estimatedWalkingMinutes?: number;
}

export interface Pandal {
  id: string;
  name: string;
  bengaliName?: string;
  area: string;
  neighborhood?: string;
  region: Region;
  category: PandalCategory[];
  description: string;
  theme?: string;
  address: string;
  nearestMetro: string;
  nearestMetroId: string;
  metroExit?: string;
  walkingTime?: string;
  walkingDistance?: string;
  directions?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  crowdLevel?: CrowdLevel;
  crowdUpdatedAt?: string;
  crowdSource?: string;
  bestTimeToVisit?: string;
  yearEstablished?: number | string;
  googleMapsUrl?: string;
  walkingFromPrevious?: {
    from: string;
    distanceMeters: number;
    walkingTimeMinutes: number;
    directions: string;
  };
}

export interface RouteStop {
  order: number;
  pandalId: string;
  walkingTime?: string;
  walkingDistance?: string;
  direction?: string;
  instruction?: string;
  googleMapsUrl?: string;
  walkingFromPrevious?: {
    from: string;
    distanceMeters: number;
    walkingTimeMinutes: number;
    directions: string;
  };
}

export interface Route {
  id: string;
  name: string;
  bengaliName?: string;
  tagline?: string;
  region: Region;
  metroStationId: string;
  metroStationName: string;
  startingExit?: string;
  estimatedDuration: string;
  totalWalkingDistance: string;
  stopsCount: number;
  description: string;
  stops: RouteStop[];
}

export interface BonediBari {
  id: string;
  name: string;
  bengaliName?: string;
  area: string;
  region: Region;
  nearestMetro: string;
  metroExit?: string;
  walkingTime?: string;
  address: string;
  directions?: string;
  description: string;
  heritageNote?: string;
  yearEstablished?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
}

export interface SavedPandal {
  id: string;
  savedAt: string;
}

export interface PlannedStop {
  pandalId: string;
  name: string;
  area: string;
  visitTime: string;
  duration: string;
  travelTime: string;
  distance: string;
  instruction?: string;
}

export interface PujaPlan {
  id: string;
  title: string;
  createdAt: string;
  preferences: {
    duration: string;
    area: string;
    startTime: string;
    categories: string[];
    walkingPreference: string;
  };
  stops: PlannedStop[];
  totalDuration: string;
  estimatedDistance: string;
}

export interface CulturalRitual {
  id: string;
  name: string;
  bengaliName: string;
  timeframe: string;
  description: string;
  significance: string;
}

export interface CalendarDay {
  tithi: string;
  bengaliTithi: string;
  date2026: string;
  englishDay: string;
  significance: string;
  isMainDay?: boolean;
}
