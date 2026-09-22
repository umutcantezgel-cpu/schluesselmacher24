'use server';

export type RoiCalculationResult = {
  totalSavings: number;
  paybackPeriodMonths: number;
  tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE';
};

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  const doorsCount = Number(formData.get('doorsCount')) || 50;
  const hourlyRate = Number(formData.get('hourlyRate')) || 65;
  const lostKeys = Number(formData.get('lostKeys')) || 5;

  const cylinderCost = doorsCount * 250;
  const keyReplacementCost = lostKeys * (cylinderCost * 0.1 + hourlyRate * 2);
  const adminTimeSavings = doorsCount * 0.5 * hourlyRate * 12;

  const totalSavings = adminTimeSavings + keyReplacementCost;
  const paybackPeriodMonths = Math.max(1, Math.round((cylinderCost / totalSavings) * 12));

  let tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE' = 'BASIC';
  if (doorsCount > 100) tier = 'ADVANCED';
  if (doorsCount > 300) tier = 'ENTERPRISE';

  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalSavings,
    paybackPeriodMonths,
    tier,
  };
}
