'use server';

export type ROICalculationResult = {
  roiPercentage: number;
  paybackMonths: number;
  totalSavings: number;
  efficiencyGain: string;
};

export async function calculateEnterpriseROI(
  previousState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const doors = Number(formData.get('doors') || 0);
  const users = Number(formData.get('users') || 0);
  const lifespan = Number(formData.get('lifespan') || 10);

  // Simulation complex math model for ROI
  const initialCost = doors * 150 + users * 25;
  const standardMaintenanceYearly = doors * 20 + users * 5;
  const optimizedMaintenanceYearly = doors * 5 + users * 1;

  const totalStandardCost = initialCost + (standardMaintenanceYearly * lifespan);
  const totalOptimizedCost = initialCost * 1.3 + (optimizedMaintenanceYearly * lifespan); // Higher initial, lower maintenance

  const totalSavings = Math.max(0, totalStandardCost - totalOptimizedCost);
  const roiPercentage = initialCost > 0 ? (totalSavings / (initialCost * 1.3)) * 100 : 0;

  const yearlySavings = standardMaintenanceYearly - optimizedMaintenanceYearly;
  const paybackMonths = yearlySavings > 0 ? ((initialCost * 0.3) / yearlySavings) * 12 : 0;

  let efficiencyGain = 'Standard';
  if (roiPercentage > 50) efficiencyGain = 'Hoch';
  if (roiPercentage > 150) efficiencyGain = 'Maximal';

  // Simulate network latency for realism
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    roiPercentage: Math.round(roiPercentage),
    paybackMonths: Math.round(paybackMonths),
    totalSavings: Math.round(totalSavings),
    efficiencyGain,
  };
}
