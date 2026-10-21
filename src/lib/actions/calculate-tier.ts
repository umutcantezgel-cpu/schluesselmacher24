'use server';

export type TierCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateServiceTier(
  prevState: TierCalculationResult,
  formData: FormData
): Promise<TierCalculationResult> {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const complexity = String(formData.get('complexity')) || 'standard';

  let multiplier = 1;
  let tier: TierCalculationResult['tier'] = 'STANDARD';

  if (complexity === 'premium') {
    multiplier = 1.5;
    tier = 'PREMIUM';
  } else if (complexity === 'enterprise') {
    multiplier = 2.5;
    tier = 'ENTERPRISE';
  }

  const baseRate = 850;
  const totalEstimate = scopeDays * baseRate * multiplier;

  return {
    totalEstimate,
    tier,
    breakdown: [
      { label: 'Basis-Tagessatz', cost: baseRate },
      { label: 'Komplexitäts-Faktor', cost: multiplier }
    ]
  };
}
