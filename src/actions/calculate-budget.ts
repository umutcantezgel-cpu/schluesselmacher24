'use server';

interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: string;
}

export async function calculateSecurityBudget(prevState: unknown, formData: FormData): Promise<BudgetCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopeSize = Number(formData.get('scopeSize')) || 5;
  const components = formData.getAll('components');

  let basePrice = scopeSize * 350;

  if (components.includes('video')) basePrice += scopeSize * 250;
  if (components.includes('access')) basePrice += scopeSize * 200;

  return {
    totalEstimate: basePrice,
    breakdown: [],
    tier: basePrice > 5000 ? 'PREMIUM' : 'STANDARD'
  };
}
