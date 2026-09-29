'use server';

export type RoiCalculationResult = {
  efficiencyGain: number;
  costSavings: number;
  paybackPeriodMonths: number;
  tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE';
};

export async function calculateEnterpriseRoi(
  state: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate network delay for realistic action behavior
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doorCount = Number(formData.get('doorCount')) || 10;
  const userCount = Number(formData.get('userCount')) || 25;
  const changeFrequency = Number(formData.get('changeFrequency')) || 5;

  // Basic mock calculation logic for ROI
  const baseEfficiency = (doorCount * 0.5) + (userCount * 0.2);
  const efficiencyGain = baseEfficiency + (changeFrequency * 1.5);
  const costSavings = (efficiencyGain * 120); // rough monetary value

  let paybackPeriodMonths = 24;
  let tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE' = 'BASIC';

  if (doorCount > 50 || userCount > 100) {
    tier = 'ENTERPRISE';
    paybackPeriodMonths = 12;
  } else if (doorCount > 20 || userCount > 40) {
    tier = 'ADVANCED';
    paybackPeriodMonths = 18;
  }

  return {
    efficiencyGain: Math.round(efficiencyGain),
    costSavings: Math.round(costSavings),
    paybackPeriodMonths,
    tier
  };
}
