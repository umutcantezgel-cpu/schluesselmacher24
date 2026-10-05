'use server';

import type { RoiCalculationResult } from '@/types/roi';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  const employees = Number(formData.get('employees')) || 50;
  const averageSalary = Number(formData.get('averageSalary')) || 60000;

  const estimatedSavings = employees * (averageSalary * 0.05);
  const productivityGain = employees * 1.5;
  const paybackPeriodMonths = 120000 / estimatedSavings;

  return {
    estimatedSavings: Math.round(estimatedSavings),
    paybackPeriodMonths: Number(paybackPeriodMonths.toFixed(1)),
    productivityGain: Math.round(productivityGain),
  };
}
