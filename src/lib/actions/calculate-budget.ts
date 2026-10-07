'use server';

import type { BudgetCalculationResult } from '@/components/calculator/security-budget-calculator';

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const accessPoints = Number(formData.get('accessPoints') || 5);
  const tier = formData.get('tier') as BudgetCalculationResult['tier'] || 'STANDARD';

  let basePricePerPoint = 0;
  let breakdown: { label: string; amount: number }[] = [];

  switch (tier) {
    case 'BASIC':
      basePricePerPoint = 250;
      breakdown = [
        { label: 'High-Security Mechanical Cylinders', amount: accessPoints * 150 },
        { label: 'Security Fittings & Installation', amount: accessPoints * 100 },
      ];
      break;
    case 'STANDARD':
      basePricePerPoint = 850;
      breakdown = [
        { label: 'Advanced Mechanical Protection', amount: accessPoints * 300 },
        { label: 'Alarm System Components', amount: accessPoints * 400 },
        { label: 'Configuration & Testing', amount: accessPoints * 150 },
      ];
      break;
    case 'PREMIUM':
      basePricePerPoint = 1500;
      breakdown = [
        { label: 'Smart Access Control Units', amount: accessPoints * 600 },
        { label: 'CCTV Integration', amount: accessPoints * 500 },
        { label: 'Alarm & Notification Setup', amount: accessPoints * 400 },
      ];
      break;
  }

  const totalEstimate = basePricePerPoint * accessPoints;

  return {
    totalEstimate,
    breakdown,
    tier,
  };
}
