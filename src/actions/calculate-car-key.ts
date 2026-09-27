'use server';

import type { CarKeyCalculationResult } from '@/types/car-key';

export async function calculateCarKeyCost(
  prevState: CarKeyCalculationResult,
  formData: FormData
): Promise<CarKeyCalculationResult> {
  const serviceType = formData.get('serviceType') as string;
  const keyType = formData.get('keyType') as string;
  const brandGroup = formData.get('brandGroup') as string;

  // Dummy delay for visual feedback
  await new Promise(resolve => setTimeout(resolve, 800));

  let basePrice = 0;

  if (serviceType === 'copy') {
    basePrice = 80;
  } else if (serviceType === 'programming') {
    basePrice = 120;
  } else if (serviceType === 'repair') {
    basePrice = 50;
  }

  if (keyType === 'remote') {
    basePrice += 40;
  } else if (keyType === 'smart') {
    basePrice += 100;
  }

  if (brandGroup === 'premium') {
    basePrice *= 1.3;
  } else if (brandGroup === 'luxury') {
    basePrice *= 1.6;
  }

  const roundedTotal = Math.round(basePrice);

  let tier = 'STANDARD';
  if (roundedTotal > 150) tier = 'PREMIUM';
  if (roundedTotal > 250) tier = 'COMPLEX';

  return {
    totalEstimate: roundedTotal,
    tier,
    breakdown: [
      { label: 'Grundleistung', cost: Math.round(basePrice * 0.6) },
      { label: 'Elektronik/Teile', cost: Math.round(basePrice * 0.4) }
    ]
  };
}
