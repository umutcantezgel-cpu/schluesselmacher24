'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const serviceType = formData.get('serviceType') as string || 'standard';
  const brandGroup = formData.get('brandGroup') as string || 'standard';

  let baseRate = 0;
  let tier = 'STANDARD';

  if (serviceType === 'basic') {
      baseRate = 60;
      tier = 'BASIC';
  } else if (serviceType === 'standard') {
      baseRate = 180;
      tier = 'STANDARD';
  } else if (serviceType === 'advanced') {
      baseRate = 280;
      tier = 'ADVANCED';
  } else if (serviceType === 'premium') {
      baseRate = 450;
      tier = 'PREMIUM';
  }

  let brandMultiplier = 1.0;
  if (brandGroup === 'premium') brandMultiplier = 1.3;
  if (brandGroup === 'exotic') brandMultiplier = 2.0;

  const total = Math.round(baseRate * brandMultiplier);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [
      `Grundpreis: ${baseRate} €`,
      `Marken-Aufschlag: ${Math.round(total - baseRate)} €`,
    ],
    tier,
  };
}
