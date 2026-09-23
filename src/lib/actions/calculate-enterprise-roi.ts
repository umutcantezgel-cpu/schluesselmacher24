'use server';

import type { EnterpriseRoiCalculationResult } from '@/types/enterprise-roi';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<EnterpriseRoiCalculationResult> {
  const doors = Number(formData.get('doors') || 10);
  const users = Number(formData.get('users') || 20);

  const baseCostPerDoor = 120;
  const costPerUser = 15;
  const totalCost = (doors * baseCostPerDoor) + (users * costPerUser);

  const estimatedSavings = totalCost * 0.15;
  const roiMonths = Math.max(1, Math.round(totalCost / (estimatedSavings || 1)));

  let tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE' = 'BASIC';
  if (doors > 50 || users > 100) tier = 'ENTERPRISE';
  else if (doors > 20 || users > 40) tier = 'ADVANCED';

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    estimatedCost: totalCost,
    estimatedSavings,
    roiMonths,
    tier,
  };
}
