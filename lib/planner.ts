import { PANDALS } from '@/data/pandals';
import { METRO_STATIONS } from '@/data/metros';
import { ROUTES } from '@/data/routes';
import { PandalCategory, PlannedStop, PujaPlan, Region } from '@/data/types';

export interface PlannerInput {
  metroId: string;
  durationHours: number;
  startTime: string; // e.g. "17:00" or "5:00 PM"
  preferredCategories: PandalCategory[];
  walkingPreference: 'light' | 'moderate' | 'dont-mind';
}

function parseTime(timeStr: string): Date {
  const date = new Date();
  if (timeStr.includes(':')) {
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const isPM = timeStr.toLowerCase().includes('pm');
    const isAM = timeStr.toLowerCase().includes('am');
    const minutes = parseInt(minutesStr.replace(/[^0-9]/g, ''), 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
  } else {
    date.setHours(17, 0, 0, 0); // default 5:00 PM
  }
  return date;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesFormatted} ${ampm}`;
}

export function generatePujaPlan(input: PlannerInput): { plan: PujaPlan | null; error?: string; suggestions?: string[] } {
  const metro = METRO_STATIONS.find((m) => m.id === input.metroId);
  if (!metro) {
    return {
      plan: null,
      error: 'We couldn’t find the specified Metro starting point.',
      suggestions: ['Select an active Metro station like Kalighat, Sovabazar, or MG Road.'],
    };
  }

  // 1. Check if there are curated routes for this metro
  const matchingRoutes = ROUTES.filter((r) => r.metroStationId === input.metroId);
  
  // 2. Identify candidate pandals
  // Prefer pandals associated with this metro first, then adjacent in the same region
  let candidates = PANDALS.filter((p) => p.nearestMetroId === input.metroId);

  // If few pandals directly on this metro, expand to region pandals
  if (candidates.length < 3) {
    const regionPandals = PANDALS.filter((p) => p.region === metro.region && p.nearestMetroId !== input.metroId);
    candidates = [...candidates, ...regionPandals];
  }

  // Filter or prioritize based on categories if specified
  if (input.preferredCategories.length > 0) {
    const filtered = candidates.filter((p) =>
      p.category.some((c) => input.preferredCategories.includes(c))
    );
    if (filtered.length >= 2) {
      candidates = filtered;
    }
  }

  // Determine target number of stops based on duration & walking preference
  // light: ~35 min visit + 10 min walk per pandal = ~45 min per stop
  // moderate: ~25 min visit + 8 min walk = ~33 min per stop
  // dont-mind: ~20 min visit + 7 min walk = ~27 min per stop
  const paceMinutes = input.walkingPreference === 'light' ? 45 : input.walkingPreference === 'moderate' ? 35 : 28;
  const maxPossibleStops = Math.max(2, Math.min(8, Math.floor((input.durationHours * 60) / paceMinutes)));

  // If we have a curated route for this metro, use its ordered stops
  let orderedPandalIds: string[] = [];
  if (matchingRoutes.length > 0) {
    const primaryRoute = matchingRoutes[0];
    orderedPandalIds = primaryRoute.stops.map((s) => s.pandalId);

    // If maxPossibleStops is larger than the single route, append other matching candidates from the same region
    if (orderedPandalIds.length < maxPossibleStops) {
      const extraCandidates = candidates
        .filter((c) => !orderedPandalIds.includes(c.id))
        .slice(0, maxPossibleStops - orderedPandalIds.length);
      orderedPandalIds.push(...extraCandidates.map((c) => c.id));
    } else {
      orderedPandalIds = orderedPandalIds.slice(0, maxPossibleStops);
    }
  } else {
    // If no exact curated route, sequence the candidate pandals
    orderedPandalIds = candidates.slice(0, maxPossibleStops).map((c) => c.id);
  }

  if (orderedPandalIds.length === 0) {
    return {
      plan: null,
      error: "We couldn't build a reliable route from the available Puja data.",
      suggestions: [
        'Try another starting Metro station (e.g. Kalighat, Sovabazar–Sutanuti, or Shyambazar).',
        'Try increasing your available duration.',
        'Try broadening your preferred categories.',
      ],
    };
  }

  // Build the time itinerary
  let currentTime = parseTime(input.startTime);
  const plannedStops: PlannedStop[] = [];
  let totalWalkingMeters = 0;

  orderedPandalIds.forEach((pandalId, index) => {
    const pandal = PANDALS.find((p) => p.id === pandalId);
    if (!pandal) return;

    // Time from metro to 1st pandal or from previous pandal
    let travelMins = 5;
    let distanceStr = '300 m';

    if (index === 0) {
      // First stop: from metro exit
      travelMins = pandal.walkingTime ? parseInt(pandal.walkingTime.replace(/[^0-9]/g, ''), 10) || 5 : 5;
      distanceStr = pandal.walkingDistance || '350 m';
    } else {
      // Subsequent stops: check if there's a route stop instruction
      const matchingRoute = matchingRoutes.find((r) =>
        r.stops.some((s) => s.pandalId === pandalId)
      );
      const routeStop = matchingRoute?.stops.find((s) => s.pandalId === pandalId);
      if (routeStop && routeStop.walkingTime) {
        travelMins = parseInt(routeStop.walkingTime.replace(/[^0-9]/g, ''), 10) || 5;
        distanceStr = routeStop.walkingDistance || '300 m';
      } else {
        travelMins = 6;
        distanceStr = '400 m';
      }
    }

    // Add travel time to arrive
    currentTime = new Date(currentTime.getTime() + travelMins * 60 * 1000);
    const arrivalTimeStr = formatTime(currentTime);

    // Visit duration based on significance
    const isMustVisit = pandal.category.includes('must-visit');
    const isBusy = pandal.crowdLevel === 'Very Crowded' || pandal.crowdLevel === 'Busy';
    const visitDurationMins = isMustVisit && isBusy ? 35 : isMustVisit ? 30 : 25;

    // Advance time for the visit
    currentTime = new Date(currentTime.getTime() + visitDurationMins * 60 * 1000);

    const distMeters = parseInt(distanceStr.replace(/[^0-9]/g, ''), 10) || 300;
    totalWalkingMeters += distMeters;

    plannedStops.push({
      pandalId: pandal.id,
      name: pandal.name,
      area: pandal.area,
      visitTime: arrivalTimeStr,
      duration: `${visitDurationMins} min visit`,
      travelTime: `${travelMins} min walk`,
      distance: distanceStr,
      instruction: pandal.directions || `Walk from ${index === 0 ? metro.name + ' Metro' : 'previous pandal'}`,
    });
  });

  const totalDistanceKm = (totalWalkingMeters / 1000).toFixed(1);
  const planId = `plan_${Date.now()}`;
  const title = `${metro.name} • ${plannedStops.length} Pandals Itinerary`;

  const newPlan: PujaPlan = {
    id: planId,
    title,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    preferences: {
      duration: `${input.durationHours} hours`,
      area: metro.region,
      startTime: input.startTime,
      categories: input.preferredCategories,
      walkingPreference: input.walkingPreference,
    },
    stops: plannedStops,
    totalDuration: `${input.durationHours} hours`,
    estimatedDistance: `${totalDistanceKm} km walking`,
  };

  return { plan: newPlan };
}
