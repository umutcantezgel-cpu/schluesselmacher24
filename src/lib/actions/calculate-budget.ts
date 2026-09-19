'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData,
): Promise<BudgetCalculationResult> {
  // Simulate network latency for realism in Server Action
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const securityLevel = formData.get('securityLevel') as string || 'basic';
  const doorCount = Number(formData.get('doorCount')) || 1;

  let baseRate = 150; // Daily rate base
  if (securityLevel === 'high') baseRate = 220;
  if (securityLevel === 'maximum') baseRate = 350;

  const laborCost = scopeDays * baseRate;
  const hardwareCost = doorCount * (securityLevel === 'basic' ? 250 : securityLevel === 'high' ? 600 : 1200);

  const totalEstimate = laborCost + hardwareCost;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (totalEstimate > 5000) tier = 'PREMIUM';
  if (totalEstimate > 15000) tier = 'ENTERPRISE';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Planung & Arbeitsleistung', cost: laborCost },
      { label: 'Sicherheitstechnik & Hardware', cost: hardwareCost }
    ],
    tier
  };
}
