'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateSecurityBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const doors = Number(formData.get('doors')) || 1;
  const windows = Number(formData.get('windows')) || 0;
  const cameras = Number(formData.get('cameras')) || 0;
  const area = Number(formData.get('area')) || 50;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doorCost = doors * 350;
  const windowCost = windows * 150;
  const cameraCost = cameras * 450;
  const baseSystemCost = 1200 + (area * 5); // Base panel + installation overhead

  const totalEstimate = doorCost + windowCost + cameraCost + baseSystemCost;

  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';
  if (totalEstimate > 5000) tier = 'PREMIUM';
  if (totalEstimate > 12000) tier = 'ENTERPRISE';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Zentraleinheit & Installation', cost: baseSystemCost },
      { label: 'Türabsicherung', cost: doorCost },
      { label: 'Fensterabsicherung', cost: windowCost },
      { label: 'Kamerasysteme', cost: cameraCost }
    ].filter(item => item.cost > 0),
    tier
  };
}
