'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 600));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const ratePerDay = 150;
  const totalEstimate = scopeDays * ratePerDay;

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'STANDARD';
  if (scopeDays < 10) tier = 'BASIC';
  else if (scopeDays > 40) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Beratung & Konzeption', amount: totalEstimate * 0.2 },
      { label: 'Material & Hardware (Schätzwert)', amount: totalEstimate * 0.5 },
      { label: 'Installation & Inbetriebnahme', amount: totalEstimate * 0.3 },
    ],
    tier,
  };
}
