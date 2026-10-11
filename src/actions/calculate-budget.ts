'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate delay for realistic effect
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundleistung', value: totalEstimate * 0.6 },
      { label: 'Material & Komponenten', value: totalEstimate * 0.3 },
      { label: 'Service & Einrichtung', value: totalEstimate * 0.1 },
    ],
    tier: scopeDays > 30 ? 'ENTERPRISE' : scopeDays > 15 ? 'PROFESSIONAL' : 'STANDARD',
  };
}
