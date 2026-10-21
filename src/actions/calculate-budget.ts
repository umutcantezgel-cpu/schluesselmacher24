'use server';

interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: unknown[];
  tier: string;
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    totalEstimate: scopeDays * 150,
    breakdown: [],
    tier: 'STANDARD',
  };
}
