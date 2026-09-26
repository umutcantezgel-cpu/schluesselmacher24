'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: string[];
  tier: string;
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const estimate = scopeDays * 150;

  return {
    totalEstimate: estimate,
    breakdown: [
      `Projektumfang: ${scopeDays} Tage`,
      `Tagessatz: 150 €`
    ],
    tier: estimate > 5000 ? 'ENTERPRISE' : 'STANDARD'
  };
}
