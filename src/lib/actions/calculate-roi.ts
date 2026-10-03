'use server';

import type { RoiCalculationResult } from '@/components/calculator/enterprise-roi-calculator';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Artificial delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  const employees = Number(formData.get('employees')) || 100;
  const accessPoints = Number(formData.get('accessPoints')) || 20;

  // Real calculation logic would be more complex
  const totalSavings = (employees * 50) + (accessPoints * 250);
  const amortizationMonths = Math.max(8, 48 - Math.floor(totalSavings / 1200));
  const efficiencyGain = Math.min(95, 15 + (employees / 8));

  return {
    totalSavings,
    amortizationMonths,
    efficiencyGain: Math.round(efficiencyGain)
  };
}
