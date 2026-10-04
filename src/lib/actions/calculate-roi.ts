'use server';

export type EnterpriseRoiState = {
  estimatedSavings: number;
  amortizationMonths: number;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
};

export async function calculateEnterpriseRoi(
  prevState: EnterpriseRoiState,
  formData: FormData
): Promise<EnterpriseRoiState> {
  // Fake some delay to simulate DB/calculation
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors') || '10');
  const userCount = Number(formData.get('users') || '50');

  // Logic:
  // Savings = doors * 120 + userCount * 15;
  const estimatedSavings = doors * 120 + userCount * 15;

  // Amortization
  const amortizationMonths = Math.max(1, Math.floor(5000 / (estimatedSavings || 1)));

  let tier: EnterpriseRoiState['tier'] = 'BASIC';
  if (doors > 50) tier = 'PRO';
  if (doors > 150) tier = 'ENTERPRISE';

  return {
    estimatedSavings,
    amortizationMonths,
    tier,
  };
}
