'use server';

type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: string[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateHomeBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const total = scopeDays * 150;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [`${scopeDays} Tage zu je 150€`],
    tier: scopeDays > 30 ? 'ENTERPRISE' : scopeDays > 15 ? 'PREMIUM' : 'STANDARD'
  };
}
