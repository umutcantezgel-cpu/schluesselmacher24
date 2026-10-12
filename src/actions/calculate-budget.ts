'use server';

import type { BudgetCalculationResult } from '@/types/budget';

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const cameras = Number(formData.get('cameras')) || 0;
  const alarm = formData.get('alarm') === 'on';

  // Base calculation
  let totalEstimate = scopeDays * 150;

  const breakdown: { label: string; amount: number }[] = [];
  breakdown.push({ label: 'Grundinstallation', amount: totalEstimate });

  if (cameras > 0) {
    const cameraCost = cameras * 350;
    totalEstimate += cameraCost;
    breakdown.push({ label: `Kameras (${cameras})`, amount: cameraCost });
  }

  if (alarm) {
    totalEstimate += 800;
    breakdown.push({ label: 'Alarmanlage (Grundpaket)', amount: 800 });
  }

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'STANDARD';
  if (totalEstimate < 2000) tier = 'BASIC';
  else if (totalEstimate > 5000) tier = 'PREMIUM';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    totalEstimate,
    breakdown,
    tier,
  };
}
