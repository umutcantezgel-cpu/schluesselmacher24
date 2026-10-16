'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateAnlagenBudget(prevState: BudgetCalculationResult, formData: FormData): Promise<BudgetCalculationResult> {
  const doors = Number(formData.get('doors')) || 0;
  const users = Number(formData.get('users')) || 0;
  const complexity = (formData.get('complexity') as string) || 'Z'; // Z, HS, GHS

  let basePrice = 45; // Base cylinder price
  let keyPrice = 12;

  if (complexity === 'HS') {
    basePrice = 75;
    keyPrice = 18;
  } else if (complexity === 'GHS') {
    basePrice = 120;
    keyPrice = 25;
  }

  const cylinderCost = doors * basePrice;
  const keysCost = users * keyPrice;
  const totalEstimate = cylinderCost + keysCost;

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate,
    breakdown: [
      { label: `Zylinder (${doors} Stk.)`, value: cylinderCost },
      { label: `Schlüssel (${users} Stk.)`, value: keysCost }
    ],
    tier: complexity
  };
}
