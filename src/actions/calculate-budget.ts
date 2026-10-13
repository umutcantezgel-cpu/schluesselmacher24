'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const complexity = String(formData.get('complexity') || 'STANDARD');

  // Artificial delay to simulate calculation/backend processing
  await new Promise((resolve) => setTimeout(resolve, 800));

  let multiplier = 150;
  if (complexity === 'HIGH') multiplier = 200;
  if (complexity === 'PREMIUM') multiplier = 250;

  const totalEstimate = scopeDays * multiplier;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Basis-Service', amount: totalEstimate * 0.4 },
      { label: 'Material & Komponenten', amount: totalEstimate * 0.4 },
      { label: 'Dokumentation & Abnahme', amount: totalEstimate * 0.2 },
    ],
    tier: complexity as "STANDARD" | "HIGH" | "PREMIUM",
  };
}
