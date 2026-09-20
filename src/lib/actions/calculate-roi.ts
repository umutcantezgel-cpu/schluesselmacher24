'use server';

import type { RoiCalculationResult } from '@/components/calculator/enterprise-roi-calculator';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate network latency for pending state demonstration
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lockingPoints = Number(formData.get('lockingPoints') || 10);
  const userCount = Number(formData.get('userCount') || 10);

  // Simplified logic for ROI calculation based on mechanical vs electronic management
  const mechanicalCostPerYear = lockingPoints * 15 + userCount * 5;
  const electronicCostPerYear = lockingPoints * 5 + userCount * 2 + 150; // base fee

  const savingsPerYear = Math.max(0, mechanicalCostPerYear - electronicCostPerYear);
  const estimatedSetupCost = lockingPoints * 120; // initial investment

  // Calculate Break Even (in months), handling 0 division
  const breakEvenMonths = savingsPerYear > 0 ? Math.round((estimatedSetupCost / savingsPerYear) * 12) : 0;

  return {
    savingsPerYear,
    estimatedSetupCost,
    breakEvenMonths,
    tier: lockingPoints > 50 ? 'ENTERPRISE' : 'STANDARD',
  };
}
