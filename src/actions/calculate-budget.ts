'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const level = formData.get('securityLevel') as string || 'STANDARD';

  let multiplier = 150;
  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'STANDARD';

  if (level === 'BASIC') {
    multiplier = 100;
    tier = 'BASIC';
  } else if (level === 'PREMIUM') {
    multiplier = 250;
    tier = 'PREMIUM';
  }

  const totalEstimate = scopeDays * multiplier;

  const breakdown = [
    { category: 'Hardware (Schlösser, Kameras, Sensoren)', cost: totalEstimate * 0.4 },
    { category: 'Installation & Inbetriebnahme', cost: totalEstimate * 0.4 },
    { category: 'Wartung & Software (1. Jahr)', cost: totalEstimate * 0.2 },
  ];

  return {
    totalEstimate,
    breakdown,
    tier,
  };
}
