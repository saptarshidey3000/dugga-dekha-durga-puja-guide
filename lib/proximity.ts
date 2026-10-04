import { Route, Pandal, BonediBari } from '@/data/types';
import { PANDALS } from '@/data/pandals';
import { BONEDI_BARIS, BONEDI_AREAS } from '@/data/bonedi';
import { ROUTES } from '@/data/routes';

export interface NearbyBonediItem {
  bonedi: BonediBari;
  distanceMeters: number;
  walkingMinutes: number;
  directionInstruction: string;
  fromPandalName: string;
}

export interface NearbyPandalItem {
  pandal: Pandal;
  distanceMeters: number;
  walkingMinutes: number;
  directionInstruction: string;
  fromBonediName: string;
  routeId?: string;
  routeName?: string;
}

/**
 * Calculates distance in meters between two lat/lng points using Haversine formula
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Curated walking connection descriptions from route endpoints to Bonedi Baris
 */
const ROUTE_TO_BONEDI_DIRECTIONS: Record<string, Record<string, string>> = {
  // Sovabazar / Kumartuli trail to Sovabazar Rajbaris
  'sovabazar-kumartuli-trail': {
    'shobhabazar-boro-rajbari':
      'From Ahiritola/Beniatola, head 350 meters east along BK Paul Avenue connector into Raja Nabakrishna Street to enter the grand Thakurdalan.',
    'shobhabazar-choto-rajbari':
      'Cross Raja Nabakrishna Street directly opposite Boro Rajbari into the European colonnaded Choto Rajbari.',
    'darjipara-mitra-bari':
      'Head south 500 meters from BK Paul Avenue into Nilmoni Mitra Street to reach the historic silver throne courtyard.',
    'chhatu-babu-latu-babu-bari':
      'Stroll south along Central Avenue corridor into Beadon Street (Ramdulal Nibas).',
  },
  // Girish Park route to Girish Park Baris
  'girish-park-ram-mandir-circuit': {
    'bholanath-dham-dutta-bari':
      'From Simla Vyayam Samiti, walk 350 meters south on Central Avenue and turn into Beadon Street.',
    'shyamal-dhone-dutta-bari':
      'Walk 300 meters southeast into Balaram Dey Street behind Girish Park to see the Victorian stained-glass thakurdalan.',
    'laha-bari':
      'Stroll 450 meters south towards Bidhan Sarani / Brindaban Bose Lane to see the Shib-Krore pratima.',
    'maniktala-saha-bari':
      'Walk 400 meters east along Vivekananda Road connector into Manicktala Street.',
  },
  // MG Road / College Square to Central Baris
  'college-square-heritage-trail': {
    'thanthania-dutta-bari':
      'From College Square, walk 300 meters north along Bidhan Sarani to Thanthania Dutta Bari.',
    'chorbagon-sil-bari':
      'Walk 400 meters north into Muktaram Babu Street to reach the heritage marble courtyard of Sil Bari.',
    'chorbagon-mitra-bari':
      'Continue 100 meters further west along Muktaram Babu Street for Mitra Bari.',
    'badan-chand-roy-bari':
      'Head 500 meters south towards Colootola / Gopal Chandra Lane.',
  },
  // Central Bowbazar
  'central-bowbazar-trail': {
    'ramgopal-saha-bari':
      'Walk 350 meters east along BB Ganguly Street into Thakur Das Chakraborty Lane.',
    'nilmoni-dutta-thakur-bari':
      'Stroll 400 meters into Hidaram Banerjee Lane in Bowbazar.',
    'rani-rashmoni-bari':
      'Take a 5-minute auto or 10-minute walk south along SN Banerjee Road into Janbazar.',
  },
  // Bhowanipore
  'bhowanipore-heritage-walk': {
    'mallick-bari-bhowanipore':
      'From Chakraberia/75 Palli, walk 400 meters west into Mohini Mohan Road to visit the iconic Mallick family estate.',
  },
  // Behala / Tollygunge
  'tollygunge-haridevpur-behala-trail': {
    'sabarna-roy-chowdhury-atchala-bari':
      'From Barisha Club, take a quick 5-minute auto or 700m walk south along Sakher Bazar to Kolkata’s oldest Durgotsav (1610).',
    'amarendra-bhavan-roy-bari':
      'Walk 500 meters from Barisha Club along Roy Bahadur Road to Amarendra Bhavan.',
  },
  // Shyambazar
  'shyambazar-bagbazar-corridor': {
    'shobhabazar-boro-rajbari':
      'Head 600 meters south along Rabindra Sarani into Raja Nabakrishna Street.',
    'darjipara-mitra-bari':
      'Walk 700 meters south into Nilmoni Mitra Street.',
  },
  // Hazra / Maddox
  'hazra-maddox-adda': {
    'mallick-bari-bhowanipore':
      'Walk 600 meters north via Ashutosh Mukherjee Road connector into Mohini Mohan Road.',
  },
  // Kalighat
  'kalighat-chetla-trail': {
    'mallick-bari-bhowanipore':
      'Take a quick 5-minute auto or 1 metro stop to Netaji Bhavan / Mohini Mohan Road.',
  },
};

/**
 * Curated walking connection descriptions from Bonedi Baris to nearby Pandals
 */
const BONEDI_TO_PANDAL_DIRECTIONS: Record<string, Record<string, string>> = {
  'shobhabazar-boro-rajbari': {
    'kumartuli-park':
      'Walk 350 meters west from Raja Nabakrishna Street towards Rabindra Sarani to Kumartuli Park.',
    'ahiritola-sarbojanin':
      'Head 450 meters west toward Ahiritola Ghat to experience Ahiritola Sarbojanin.',
    'bagbazar-sarbojanin':
      'Walk 650 meters north along Rabindra Sarani to Bagbazar Sarbojanin at Girish Mancha.',
  },
  'chhatu-babu-latu-babu-bari': {
    'kumartuli-park':
      'Head 600 meters northwest via Beadon Street into Rabindra Sarani for Kumartuli Park.',
    'simla-vyayam-samiti':
      'Walk 450 meters south along Central Avenue to Simla Vyayam Samiti.',
  },
  'darjipara-mitra-bari': {
    'kumartuli-sarbojanin':
      'Walk 400 meters northwest through the clay artisan lanes of Kumartuli.',
    'ahiritola-sarbojanin':
      'Head 500 meters west into BK Paul Avenue connector for Ahiritola.',
  },
  'bholanath-dham-dutta-bari': {
    'simla-vyayam-samiti':
      'Walk 350 meters south on Central Avenue to Simla Vyayam Samiti.',
    'vivekananda-sporting-club':
      'Walk 400 meters north into Vivekananda Road for Vivekananda Sporting Club.',
  },
  'shyamal-dhone-dutta-bari': {
    'simla-vyayam-samiti':
      'Walk 250 meters west onto Central Avenue to reach Simla Vyayam Samiti.',
    'kashi-bose-lane':
      'Walk 600 meters northeast via Bidhan Sarani toward Kashi Bose Lane.',
  },
  'laha-bari': {
    'simla-vyayam-samiti':
      'Walk 400 meters northwest to Central Avenue.',
    'college-square':
      'Walk 650 meters south along Bidhan Sarani toward College Square.',
  },
  'thanthania-dutta-bari': {
    'college-square':
      'Walk 350 meters south along Bidhan Sarani straight into College Square.',
    'mohammad-ali-park':
      'Walk 450 meters south along Central Avenue into Mohammad Ali Park.',
  },
  'chorbagon-sil-bari': {
    'college-square':
      'Walk 400 meters south through Muktaram Babu Street to College Square.',
    'mohammad-ali-park':
      'Walk 500 meters south on Central Avenue into Mohammad Ali Park.',
  },
  'mallick-bari-bhowanipore': {
    'bhowanipur-75-palli':
      'Walk 380 meters east along Mohini Mohan Road into 75 Palli.',
    'chakraberia-sarbojanin':
      'Walk 450 meters northeast towards Chakraberia Road North.',
    'bhawanipur-abasar':
      'Walk 500 meters south into Townshend Road for Abasar Sarbojanin.',
  },
  'sabarna-roy-chowdhury-atchala-bari': {
    'barisha-club':
      'Walk 650 meters north along Diamond Harbour Road / Sakher Bazar into Barisha Club.',
    'behala-nutan-dal':
      'Head 850 meters north into Behala Nutan Dal.',
  },
  'amarendra-bhavan-roy-bari': {
    'barisha-club':
      'Walk 500 meters north into Roy Bahadur Road for Barisha Club.',
    'behala-nutan-dal':
      'Walk 750 meters into Behala Nutan Dal.',
  },
};

/**
 * Finds nearby Bonedi Baris for a given Metro Route
 */
export function getNearbyBonediForRoute(route: Route): NearbyBonediItem[] {
  if (!route.stops || route.stops.length === 0) return [];

  // Get the last stop of the route
  const lastStop = route.stops[route.stops.length - 1];
  const lastPandal = PANDALS.find((p) => p.id === lastStop.pandalId);

  const routeCustomMap = ROUTE_TO_BONEDI_DIRECTIONS[route.id] || {};

  const candidates: NearbyBonediItem[] = [];

  BONEDI_BARIS.forEach((bari) => {
    let distanceMeters = 800; // default estimate
    let directionInstruction =
      routeCustomMap[bari.id] ||
      `Head towards ${bari.address} (approx ~${bari.walkingTime || '8 min'} walk from ${lastPandal?.name || 'the last stop'}).`;

    if (lastPandal?.latitude && lastPandal?.longitude && bari.latitude && bari.longitude) {
      distanceMeters = calculateDistanceMeters(
        lastPandal.latitude,
        lastPandal.longitude,
        bari.latitude,
        bari.longitude
      );
    } else if (bari.commute?.distanceMeters) {
      distanceMeters = bari.commute.distanceMeters;
    }

    // Walking minutes: ~75 meters per minute in congested lanes, minimum 3 mins
    const walkingMinutes = Math.max(3, Math.round(distanceMeters / 75));

    // Priority criteria:
    // 1) Explicitly curated route mapping
    // 2) Distance < 1600m
    // 3) Or same region / adjacent neighborhood
    const isCurated = !!routeCustomMap[bari.id];
    const isClose = distanceMeters <= 1600;
    const sameRegion =
      bari.region === route.region ||
      (route.region === 'North Kolkata' && bari.region === 'North Kolkata') ||
      (route.region === 'Central Kolkata' && bari.region === 'Central Kolkata') ||
      (route.region === 'South Kolkata' && bari.region === 'South Kolkata');

    if (isCurated || (isClose && sameRegion)) {
      candidates.push({
        bonedi: bari,
        distanceMeters,
        walkingMinutes,
        directionInstruction,
        fromPandalName: lastPandal?.name || 'Last Pandal Stop',
      });
    }
  });

  // Sort candidates by curated priority first, then by closest distance
  return candidates.sort((a, b) => {
    const aCurated = !!routeCustomMap[a.bonedi.id];
    const bCurated = !!routeCustomMap[b.bonedi.id];
    if (aCurated && !bCurated) return -1;
    if (!aCurated && bCurated) return 1;
    return a.distanceMeters - b.distanceMeters;
  }).slice(0, 3);
}

/**
 * Finds nearby Sarbojanin Pandals for a given Bonedi Bari or Bonedi Area
 */
export function getNearbyPandalsForBonedi(
  bonediId: string,
  areaId?: string
): NearbyPandalItem[] {
  const currentBari = BONEDI_BARIS.find((b) => b.id === bonediId);
  const customMap = BONEDI_TO_PANDAL_DIRECTIONS[bonediId] || {};

  const candidates: NearbyPandalItem[] = [];

  PANDALS.forEach((pandal) => {
    let distanceMeters = 800;
    let directionInstruction =
      customMap[pandal.id] ||
      `Head towards ${pandal.name} (${pandal.address}), a short stroll from ${currentBari?.name || 'the heritage courtyard'}.`;

    if (currentBari?.latitude && currentBari?.longitude && pandal.latitude && pandal.longitude) {
      distanceMeters = calculateDistanceMeters(
        currentBari.latitude,
        currentBari.longitude,
        pandal.latitude,
        pandal.longitude
      );
    }

    const walkingMinutes = Math.max(3, Math.round(distanceMeters / 75));
    const isCurated = !!customMap[pandal.id];
    const isClose = distanceMeters <= 1500;
    const sameRegion = currentBari && pandal.region === currentBari.region;

    // Find if this pandal is part of a curated route
    const associatedRoute = ROUTES.find((r) =>
      r.stops.some((s) => s.pandalId === pandal.id)
    );

    if (isCurated || (isClose && sameRegion)) {
      candidates.push({
        pandal,
        distanceMeters,
        walkingMinutes,
        directionInstruction,
        fromBonediName: currentBari?.name || 'Heritage Estate',
        routeId: associatedRoute?.id,
        routeName: associatedRoute?.name,
      });
    }
  });

  return candidates.sort((a, b) => {
    const aCurated = !!customMap[a.pandal.id];
    const bCurated = !!customMap[b.pandal.id];
    if (aCurated && !bCurated) return -1;
    if (!aCurated && bCurated) return 1;
    return a.distanceMeters - b.distanceMeters;
  }).slice(0, 3);
}
