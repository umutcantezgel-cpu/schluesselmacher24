'use server';

type CalculationResult = {
  timeEstimate: string;
  distance: string;
  status: 'SUCCESS' | 'IDLE' | 'ERROR';
  message?: string;
};

// Simulated store coordinates (e.g., Berlin center)
const STORE_LAT = 52.5200;
const STORE_LON = 13.4050;

// Basic mapping of some postal codes to coordinates for simulation
const PLZ_COORDS: Record<string, {lat: number, lon: number}> = {
  '10115': {lat: 52.5323, lon: 13.3846}, // Berlin Mitte
  '10999': {lat: 52.4988, lon: 13.4285}, // Kreuzberg
  '14467': {lat: 52.4034, lon: 13.0573}, // Potsdam
  '20095': {lat: 53.5503, lon: 9.9933},  // Hamburg
  '80331': {lat: 48.1371, lon: 11.5754}, // Munich
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function calculateReactionTime(prevState: CalculationResult, formData: FormData): Promise<CalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const plz = formData.get('plz') as string;

  if (!plz || !/^\d{5}$/.test(plz)) {
    return {
      status: 'ERROR',
      timeEstimate: '',
      distance: '',
      message: 'Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.'
    };
  }

  // Attempt to find coords, if not found generate a deterministic fake distance based on PLZ
  let distanceKm = 0;
  if (PLZ_COORDS[plz]) {
      distanceKm = calculateDistance(STORE_LAT, STORE_LON, PLZ_COORDS[plz].lat, PLZ_COORDS[plz].lon);
  } else {
      // Deterministic fake distance for demo purposes
      const hash = plz.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      distanceKm = 5 + (hash % 100);
  }

  // Estimate time: base 15 mins + 1.5 min per km
  const timeMinutes = Math.round(15 + (distanceKm * 1.5));

  let timeFormatted = '';
  if (timeMinutes < 60) {
      timeFormatted = `ca. ${timeMinutes} Min.`;
  } else {
      const hours = Math.floor(timeMinutes / 60);
      const mins = timeMinutes % 60;
      timeFormatted = `ca. ${hours} Std. ${mins} Min.`;
  }

  return {
    status: 'SUCCESS',
    timeEstimate: timeFormatted,
    distance: `${distanceKm.toFixed(1)} km`,
  };
}
