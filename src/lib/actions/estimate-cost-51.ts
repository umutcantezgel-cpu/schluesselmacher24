'use server';

import type { RoiCalculationResult } from '@/types/roi-budget';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<RoiCalculationResult> {
  const doors = Number(formData.get('doors') || 0);
  const users = Number(formData.get('users') || 0);
  const complexity = formData.get('complexity') || 'low';

  const baseDoorCost = doors * 150;
  const baseUserCost = users * 50;
  let multiplier = 1;
  let tier: 'STANDARD' | 'ENTERPRISE' | 'PREMIUM' = 'STANDARD';

  if (complexity === 'medium') {
    multiplier = 1.3;
    tier = 'PREMIUM';
  } else if (complexity === 'high') {
    multiplier = 1.8;
    tier = 'ENTERPRISE';
  }

  if (doors > 50 || users > 100) {
     tier = 'ENTERPRISE';
  }

  const totalEstimate = (baseDoorCost + baseUserCost) * multiplier;
  const savingsPerYear = doors * 15 + users * 5; // Theoretical savings

  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    totalEstimate: Math.round(totalEstimate),
    breakdown: [
      { label: 'Türen & Schließstellen', value: Math.round(baseDoorCost * multiplier) },
      { label: 'Schlüssel & Berechtigungen', value: Math.round(baseUserCost * multiplier) },
    ],
    tier,
    savingsPerYear: Math.round(savingsPerYear * multiplier),
  };
}
