'use server';

export type EnterpriseRoiResult = {
  roiPercentage: number;
  paybackMonths: number;
  annualSavings: number;
  estimatedCost: number;
};

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<EnterpriseRoiResult> {
  // Simulate network delay for realistic action behavior
  await new Promise(resolve => setTimeout(resolve, 800));

  const doorsCount = Number(formData.get('doorsCount')) || 50;
  const lostKeys = Number(formData.get('lostKeys')) || 5;

  // Extremely simplified baseline calculation
  const hardwareCost = doorsCount * 220; // 220 EUR per door cylinder/fitting
  const installationCost = doorsCount * 30; // 30 EUR install cost per door
  const estimatedCost = hardwareCost + installationCost;

  // Legacy cost without modern system (changing cylinders when key is lost)
  // Assuming a lost key means replacing 5 cylinders on average
  const costPerLostKeyIncident = 5 * 250;
  const annualLegacyCost = lostKeys * costPerLostKeyIncident;

  // Modern system cost (just revoke key, maybe 10 EUR admin overhead)
  const annualModernCost = lostKeys * 10;

  const annualSavings = annualLegacyCost - annualModernCost;

  const roi5Years = ((annualSavings * 5 - estimatedCost) / estimatedCost) * 100;

  const paybackMonths = estimatedCost / (annualSavings / 12);

  return {
    roiPercentage: Math.max(0, roi5Years),
    paybackMonths: Math.max(0, paybackMonths),
    annualSavings,
    estimatedCost
  };
}
