
'use server';

import { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(prevState: BudgetCalculationResult, formData: FormData): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const tier = (formData.get('tier') as 'STANDARD' | 'ERWEITERT' | 'HOCHSICHERHEIT') || 'STANDARD';

  let multiplier = 1;
  if (tier === 'ERWEITERT') multiplier = 1.8;
  if (tier === 'HOCHSICHERHEIT') multiplier = 3.5;

  const baseRate = 150; // Base rate per day for standard
  const estimatedCost = scopeDays * baseRate * multiplier;

  return {
    totalEstimate: estimatedCost,
    breakdown: [
      { label: 'Mechanischer Grundschutz', cost: estimatedCost * 0.3 },
      { label: 'Elektronik & Sensorik', cost: estimatedCost * 0.5 },
      { label: 'Installation & Inbetriebnahme', cost: estimatedCost * 0.2 }
    ],
    tier
  };
}
