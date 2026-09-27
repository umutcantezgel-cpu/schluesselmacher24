'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const brandGroup = formData.get('brandGroup') as string || 'standard';
  const hasSmartKey = formData.get('hasSmartKey') === 'on';

  // Base calculation specifically for car keys
  let baseRate = 0;
  const breakdown: string[] = [];
  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';

  if (brandGroup === 'premium') {
    baseRate = 250;
    breakdown.push('Premium-Fahrzeugzuschlag (z.B. BMW, Mercedes, Audi)');
    tier = 'PREMIUM';
  } else if (brandGroup === 'luxury') {
    baseRate = 450;
    breakdown.push('Luxus-Fahrzeugzuschlag (z.B. Porsche, Bentley)');
    tier = 'ENTERPRISE';
  } else {
    baseRate = 120;
    breakdown.push('Standard-Fahrzeug');
  }

  let totalEstimate = baseRate;

  if (hasSmartKey) {
    totalEstimate += 150;
    breakdown.push('Smart-Key / Keyless-Go Programmierung');
  } else {
    totalEstimate += 80;
    breakdown.push('Standard-Funkschlüssel Programmierung');
  }

  totalEstimate += scopeDays * 10; // Travel/complexity modifier

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    totalEstimate,
    breakdown,
    tier
  };
}
