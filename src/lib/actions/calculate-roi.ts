'use server';

export type ROIResult = {
  estimatedCost: number;
  timeSavedHours: number;
  maintenanceSavings: number;
  tier: 'STANDARD' | 'ENTERPRISE';
};

export async function calculateEnterpriseROI(
  prevState: ROIResult,
  formData: FormData
): Promise<ROIResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const cylinderCount = Number(formData.get('cylinderCount')) || 50;

  // Simulate complex enterprise calculation
  const baseCost = cylinderCount * 120;
  const implementationCost = scopeDays * 150;

  const estimatedCost = baseCost + implementationCost;
  const timeSavedHours = cylinderCount * 1.5 + scopeDays * 0.5;
  const maintenanceSavings = cylinderCount * 25; // per year

  return {
    estimatedCost,
    timeSavedHours: Math.round(timeSavedHours),
    maintenanceSavings: Math.round(maintenanceSavings),
    tier: cylinderCount > 100 || scopeDays > 30 ? 'ENTERPRISE' : 'STANDARD',
  };
}
