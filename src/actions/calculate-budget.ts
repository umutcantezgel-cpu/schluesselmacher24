// src/actions/calculate-budget.ts
'use server';

import type { BudgetCalculationResult, Tier } from '@/types/budget';

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const objectType = formData.get('objectType') as string || 'wohnung';

  // Base rates and multipliers
  let baseRate = 1200; // Minimal basic mechanics

  if (objectType === 'einfamilienhaus') baseRate = 3500;
  if (objectType === 'gewerbe') baseRate = 8000;

  // Complexity factor based on scope (days of work rough equivalent)
  const complexityCost = scopeDays * 180;

  const total = baseRate + complexityCost;

  let tier: Tier = 'BASIS';
  if (total > 5000) tier = 'STANDARD';
  if (total > 15000) tier = 'PREMIUM';

  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Grundschutz & Komponenten', cost: baseRate },
      { label: 'Installation & Inbetriebnahme', cost: complexityCost }
    ],
    tier
  };
}
