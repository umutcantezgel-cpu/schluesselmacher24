
'use server';

export type SecurityTier = 'BASIC' | 'BUSINESS' | 'HIGH_SECURITY';

export interface SecurityBudgetResult {
  totalEstimate: number;
  tier: SecurityTier;
}

export async function calculateSecurityBudget(prevState: SecurityBudgetResult, formData: FormData): Promise<SecurityBudgetResult> {
  const sqqm = Number(formData.get('sqm')) || 100;
  const doors = Number(formData.get('doors')) || 1;
  const windows = Number(formData.get('windows')) || 4;
  const level = formData.get('level') as SecurityTier || 'BASIC';

  let baseRate = 0;
  if (level === 'BASIC') baseRate = 50;
  if (level === 'BUSINESS') baseRate = 120;
  if (level === 'HIGH_SECURITY') baseRate = 250;

  const total = (sqqm * baseRate) + (doors * 500) + (windows * 300);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    tier: level
  };
}
