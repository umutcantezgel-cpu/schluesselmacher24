'use server';

import type { RoiCalculationResult } from '../types/roi';

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const usersCount = Number(formData.get('usersCount')) || 10;
  const doorsCount = Number(formData.get('doorsCount')) || 20;

  // Simple heuristic calculation
  const traditionalCost = (usersCount * 45) + (doorsCount * 120) + 1500;
  const digitalCost = (usersCount * 85) + (doorsCount * 350) + 2500;

  const savedTimeHours = Math.round(usersCount * 1.5 + doorsCount * 0.5);
  const costSavings = Math.max(0, traditionalCost - digitalCost * 0.8); // ROI example
  const roiPercentage = traditionalCost > 0 ? Math.round((costSavings / traditionalCost) * 100) : 0;

  return {
    traditionalCost,
    digitalCost,
    savedTimeHours,
    costSavings,
    roiPercentage,
    breakdown: [
      { label: 'Schlüssel/Transponder', value: usersCount * 85 },
      { label: 'Zylinder/Leser', value: doorsCount * 350 },
      { label: 'Infrastruktur & Setup', value: 2500 }
    ],
    tier: doorsCount > 50 ? 'ENTERPRISE' : 'PROFESSIONAL'
  };
}
