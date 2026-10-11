'use server';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: string;
}

export async function calculateServiceBudget(
  state: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const rate = 150; // Daily rate approximation
  const totalEstimate = scopeDays * rate;

  return {
    totalEstimate,
    breakdown: [
      `Basispaket: ${scopeDays} Tage`,
      'Material & Komponenten',
      'Systemintegration'
    ],
    tier: totalEstimate > 5000 ? 'ENTERPRISE' : 'STANDARD'
  };
}
