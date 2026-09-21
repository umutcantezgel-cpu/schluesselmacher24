'use server';

export type EnterpriseRoiResult = {
  estimatedSavings: number;
  amortizationMonths: number;
  systemCost: number;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
};

export async function calculateEnterpriseRoi(
  prevState: EnterpriseRoiResult,
  formData: FormData
): Promise<EnterpriseRoiResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors')) || 10;
  const employees = Number(formData.get('employees')) || 20;

  const systemCost = doors * 250 + employees * 20;
  const estimatedSavings = (employees * 15 * 12) + (doors * 50); // savings per year
  const amortizationMonths = (systemCost / estimatedSavings) * 12;

  let tier: 'BASIC' | 'PRO' | 'ENTERPRISE' = 'BASIC';
  if (doors > 50) tier = 'ENTERPRISE';
  else if (doors > 20) tier = 'PRO';

  return {
    estimatedSavings: Math.round(estimatedSavings),
    amortizationMonths: Math.round(amortizationMonths * 10) / 10,
    systemCost: Math.round(systemCost),
    tier,
  };
}
