'use server';

export type SecurityBudgetCalculationResult = {
  totalEstimate: number;
  breakdown: Array<{label: string, amount: number}>;
  tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
};

export async function calculateSecurityBudget(state: SecurityBudgetCalculationResult, formData: FormData): Promise<SecurityBudgetCalculationResult> {
  const scope = Number(formData.get('scopeDays')) || 15;

  // Simulated server delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEstimate: scope * 150,
    breakdown: [
      { label: 'Hardware', amount: scope * 50 },
      { label: 'Installation', amount: scope * 100 }
    ],
    tier: scope > 30 ? 'ENTERPRISE' : 'STANDARD'
  };
}
