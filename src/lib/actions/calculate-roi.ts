'use server';

import type { RoiCalculationResult } from '@/lib/types/roi';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  const doorCount = formData.has('doorCount') ? Number(formData.get('doorCount')) : 10;
  const employeeCount = formData.has('employeeCount') ? Number(formData.get('employeeCount')) : 20;
  const keyReplacementsPerYear = formData.has('keyReplacementsPerYear') ? Number(formData.get('keyReplacementsPerYear')) : 2;

  // Simulate complex backend calculation
  const mechanicalBaseCost = doorCount * 120 + employeeCount * 15;
  const electronicBaseCost = doorCount * 350 + employeeCount * 5;

  const mechanicalMaintenancePerYear = keyReplacementsPerYear * 250; // New locks/keys
  const electronicMaintenancePerYear = keyReplacementsPerYear * 25 + doorCount * 10; // New tags, battery

  const mechanicalCost = mechanicalBaseCost + mechanicalMaintenancePerYear;
  const electronicCost = electronicBaseCost + electronicMaintenancePerYear;

  const mechanicalCost3Years = mechanicalBaseCost + mechanicalMaintenancePerYear * 3;
  const electronicCost3Years = electronicBaseCost + electronicMaintenancePerYear * 3;

  const savingsYear1 = mechanicalCost - electronicCost;
  const savingsYear3 = mechanicalCost3Years - electronicCost3Years;

  let recommendation: 'MECHANICAL' | 'ELECTRONIC' | 'HYBRID' = 'MECHANICAL';
  let breakEvenMonths = 0;

  if (savingsYear3 > 0) {
    recommendation = 'ELECTRONIC';
    const monthlySavings = (mechanicalMaintenancePerYear - electronicMaintenancePerYear) / 12;
    if (monthlySavings > 0) {
        breakEvenMonths = Math.ceil((electronicBaseCost - mechanicalBaseCost) / monthlySavings);
        if (breakEvenMonths < 0) breakEvenMonths = 0;
    }
  } else if (doorCount > 20 && employeeCount > 50) {
    recommendation = 'HYBRID';
  }

  return {
    mechanicalCost,
    electronicCost,
    savingsYear1,
    savingsYear3,
    breakEvenMonths,
    recommendation,
  };
}
