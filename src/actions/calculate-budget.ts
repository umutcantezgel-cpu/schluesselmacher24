'use server';

export type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: string[];
  tier: string;
};

export async function calculateServiceBudget(prevState: BudgetCalculationResult, formData: FormData): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays'));
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalEstimate: scopeDays * 150,
    breakdown: ['Grundpauschale', 'Materialkosten'],
    tier: scopeDays > 30 ? 'PREMIUM' : 'STANDARD'
  };
}
