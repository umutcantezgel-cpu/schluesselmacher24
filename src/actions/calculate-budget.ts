'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { item: string; cost: number }[];
  tier: 'STANDARD' | 'PRO' | 'ENTERPRISE';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;

  // Base calculation logic: 150 per day as an arbitrary estimate unit
  const baseCost = scopeDays * 150;
  const setupCost = 500; // static base setup

  const totalEstimate = baseCost + setupCost;
  let tier: 'STANDARD' | 'PRO' | 'ENTERPRISE' = 'STANDARD';

  if (totalEstimate > 5000) tier = 'PRO';
  if (totalEstimate > 10000) tier = 'ENTERPRISE';

  return {
    totalEstimate,
    breakdown: [
      { item: 'Grundgebühr & Planung', cost: setupCost },
      { item: 'Systemkomponenten', cost: baseCost }
    ],
    tier
  };
}
