'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: unknown[];
  tier: string;
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    totalEstimate,
    breakdown: [],
    tier: 'STANDARD'
  };
}
