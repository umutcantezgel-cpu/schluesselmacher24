'use server';
import type { EnterpriseRoiResult, EnterpriseRoiTier } from '@/types/enterprise-roi';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<EnterpriseRoiResult> {
  const doors = Number(formData.get('doors') || 10);
  const users = Number(formData.get('users') || 20);
  const locations = Number(formData.get('locations') || 1);

  const baseCost = doors * 250 + users * 30 + locations * 1000;
  const supportCost = users * 5 * 12; // Yearly support est

  let tier: EnterpriseRoiTier = 'BASIC';
  if (baseCost > 15000) tier = 'PREMIUM';
  else if (baseCost > 5000) tier = 'STANDARD';

  const savingsPerMonth = users * 20; // Estimated admin savings
  const amortizationMonths = savingsPerMonth > 0 ? Math.ceil((baseCost + supportCost) / savingsPerMonth) : 0;

  return {
    totalEstimate: baseCost + supportCost,
    breakdown: [
      { label: 'Hardware & Installation', amount: baseCost },
      { label: 'Jährlicher Support', amount: supportCost },
    ],
    tier,
    amortizationMonths,
  };
}
