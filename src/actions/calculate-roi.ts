'use server';

import type { ROICalculationResult } from '@/types/roi-budget';

export async function calculateEnterpriseROI(
  prevState: unknown,
  formData: FormData
): Promise<ROICalculationResult> {
  const doors = Number(formData.get('doors') || 10);
  const users = Number(formData.get('users') || 50);

  const totalInvestment = doors * 250 + users * 15;
  const annualSavings = users * 45;
  const roiMonths = Math.ceil((totalInvestment / annualSavings) * 12);
  const efficiencyGain = Math.min(Math.round((annualSavings / totalInvestment) * 100), 200);

  return {
    totalInvestment,
    annualSavings,
    roiMonths,
    efficiencyGain
  };
}
