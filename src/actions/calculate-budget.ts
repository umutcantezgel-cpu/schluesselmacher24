'use server';

export type Tier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: Tier;
}

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeStr = formData.get('scopeDays') as string;
  const scopeDays = scopeStr ? parseInt(scopeStr, 10) : 15;

  const total = scopeDays * 150;

  return {
    totalEstimate: total,
    breakdown: [{ label: 'Installation & Material', cost: total }],
    tier: 'STANDARD',
  };
}
