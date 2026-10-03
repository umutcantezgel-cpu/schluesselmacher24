'use server';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const totalEstimate = scopeDays * 150;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (totalEstimate > 5000) {
    tier = 'PREMIUM';
  }
  if (totalEstimate > 10000) {
    tier = 'ENTERPRISE';
  }

  return {
    totalEstimate,
    breakdown: [
      `${scopeDays} Tage Projektumfang`,
      'Inklusive Basis-Beratung',
      'Zzgl. Materialkosten'
    ],
    tier
  };
}
