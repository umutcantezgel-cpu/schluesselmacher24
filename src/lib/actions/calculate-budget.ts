'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'STANDARD' | 'COMPLEX' | 'ENTERPRISE';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const totalEstimate = scopeDays * 150;

  let tier: 'STANDARD' | 'COMPLEX' | 'ENTERPRISE' = 'STANDARD';
  if (scopeDays > 30) {
    tier = 'COMPLEX';
  }
  if (scopeDays > 45) {
    tier = 'ENTERPRISE';
  }

  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundaufwand & Anfahrt', amount: totalEstimate * 0.2 },
      { label: 'Material & Komponenten', amount: totalEstimate * 0.3 },
      { label: 'Montage & Servicezeit', amount: totalEstimate * 0.5 },
    ],
    tier,
  };
}
