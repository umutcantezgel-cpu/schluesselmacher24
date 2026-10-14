'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateSicherheitBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const systemType = formData.get('systemType') as string;
  const cameras = Number(formData.get('cameras')) || 0;
  const sensors = Number(formData.get('sensors')) || 0;

  let basePrice = 0;

  switch(systemType) {
    case 'BASIC': basePrice = 500; break;
    case 'SMART': basePrice = 1200; break;
    case 'PREMIUM': basePrice = 2500; break;
    default: basePrice = 500;
  }

  const cameraPrice = cameras * 250;
  const sensorPrice = sensors * 80;

  const total = basePrice + cameraPrice + sensorPrice;

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Grundsystem', amount: basePrice },
      { label: `Kameras (${cameras}x)`, amount: cameraPrice },
      { label: `Sensoren (${sensors}x)`, amount: sensorPrice }
    ],
    tier: systemType as BudgetCalculationResult["tier"]
  };
}
