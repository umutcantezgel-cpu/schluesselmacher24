'use server';

export type BudgetTier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: Array<{ label: string; cost: number }>;
  tier: BudgetTier;
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for realistic loading states
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150; // Base rate

  const total = scopeDays * ratePerDay;

  let tier: BudgetTier = 'STANDARD';
  if (total < 3000) tier = 'BASIC';
  else if (total > 6000) tier = 'PREMIUM';

  return {
    totalEstimate: total,
    breakdown: [
      { label: 'Beratung & Konzeption', cost: total * 0.2 },
      { label: 'Hardware & Komponenten', cost: total * 0.4 },
      { label: 'Installation & Einrichtung', cost: total * 0.4 },
    ],
    tier,
  };
}
