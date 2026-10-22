'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const total = scopeDays * 150;

  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate calculation

  return {
    totalEstimate: total,
    breakdown: [
      `Planung & Konzeption: ${(total * 0.2).toFixed(2)} €`,
      `Installation & Setup: ${(total * 0.6).toFixed(2)} €`,
      `Abnahme & Dokumentation: ${(total * 0.2).toFixed(2)} €`
    ],
    tier: total > 5000 ? 'PREMIUM' : total > 2000 ? 'STANDARD' : 'BASIC'
  };
}
