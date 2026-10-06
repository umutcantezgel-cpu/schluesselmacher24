'use server';

export type SecurityTier = 'BASIC' | 'ENHANCED' | 'MAXIMUM';

export interface SecurityBudgetResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: SecurityTier;
}

export async function calculateSecurityBudget(
  prevState: SecurityBudgetResult,
  formData: FormData
): Promise<SecurityBudgetResult> {
  // Simulate network delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors') || 1);
  const windows = Number(formData.get('windows') || 0);
  const tier = (formData.get('tier') as SecurityTier) || 'BASIC';

  let doorMultiplier = 150;
  let windowMultiplier = 120;
  let baseFee = 200;

  if (tier === 'ENHANCED') {
    doorMultiplier = 350;
    windowMultiplier = 250;
    baseFee = 400;
  } else if (tier === 'MAXIMUM') {
    doorMultiplier = 800;
    windowMultiplier = 500;
    baseFee = 900;
  }

  const doorsCost = doors * doorMultiplier;
  const windowsCost = windows * windowMultiplier;
  const total = doorsCost + windowsCost + baseFee;

  return {
    totalEstimate: total,
    tier,
    breakdown: [
      { label: 'Türenabsicherung', cost: doorsCost },
      { label: 'Fensterabsicherung', cost: windowsCost },
      { label: 'System-Basis / Installation', cost: baseFee },
    ]
  };
}