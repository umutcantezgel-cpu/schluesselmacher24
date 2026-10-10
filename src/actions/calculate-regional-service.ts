'use server';

export type RegionalCalculationResult = {
  estimatedCost: number;
  travelTime: number;
  availability: 'HIGH' | 'MEDIUM' | 'LOW';
};

export async function calculateRegionalService(
  prevState: RegionalCalculationResult,
  formData: FormData
): Promise<RegionalCalculationResult> {
  // Simulate network delay for realistic action behavior
  await new Promise((resolve) => setTimeout(resolve, 500));

  const distanceStr = formData.get('distance') as string;
  const distance = parseInt(distanceStr || '10', 10);
  const urgency = formData.get('urgency') as string;

  let baseCost = 80;
  const time = distance * 2;

  baseCost += distance * 1.5;

  if (urgency === 'immediate') {
    baseCost *= 1.5;
  } else if (urgency === 'scheduled') {
    baseCost *= 1.0;
  }

  let availability: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  if (distance > 50) availability = 'LOW';
  else if (distance > 20) availability = 'MEDIUM';

  return {
    estimatedCost: Math.round(baseCost),
    travelTime: time,
    availability,
  };
}
