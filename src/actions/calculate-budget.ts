'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: unknown,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors') || 10);
  const keys = Number(formData.get('keys') || 20);
  const systemType = formData.get('systemType') as string || 'mechanic';

  const baseDoorCost = systemType === 'electronic' ? 350 : 150;
  const baseKeyCost = systemType === 'electronic' ? 45 : 25;

  const totalEstimate = (doors * baseDoorCost) + (keys * baseKeyCost);

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'BASIC';
  if (totalEstimate > 5000) tier = 'PREMIUM';
  else if (totalEstimate > 2000) tier = 'STANDARD';

  return {
    totalEstimate,
    breakdown: [
      { item: `Zylinder (${doors} Stück)`, cost: doors * baseDoorCost },
      { item: `Schlüssel (${keys} Stück)`, cost: keys * baseKeyCost },
    ],
    tier,
  };
}
