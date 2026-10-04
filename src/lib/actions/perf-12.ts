'use server';

export async function calculateSecurityBudget(
  prevState: unknown,
  formData: FormData
): Promise<{totalEstimate: number; breakdown: unknown[]; tier: string}> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const result = scopeDays * 150;
  return {
    totalEstimate: result,
    breakdown: [],
    tier: 'STANDARD'
  };
}
