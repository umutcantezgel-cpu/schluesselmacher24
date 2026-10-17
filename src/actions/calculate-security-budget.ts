'use server';

import type { SecurityBudgetCalculationResult } from '@/types/security-budget';

export async function calculateSecurityBudget(
  prevState: SecurityBudgetCalculationResult,
  formData: FormData
): Promise<SecurityBudgetCalculationResult> {
  // Simulate network delay for realistic action behavior
  await new Promise((resolve) => setTimeout(resolve, 800));

  const objectType = (formData.get('objectType') as string) || 'wohnung';
  const doorsCount = Number(formData.get('doors') as string) || 1;
  const windowsCount = Number(formData.get('windows') as string) || 0;
  const includeVideo = formData.get('includeVideo') === 'on';
  const includeAlarm = formData.get('includeAlarm') === 'on';

  let basePrice = 0;

  if (objectType === 'wohnung') basePrice += 500;
  if (objectType === 'einfamilienhaus') basePrice += 1200;
  if (objectType === 'gewerbe') basePrice += 2500;

  let totalEstimate = basePrice;
  const breakdown = [];

  breakdown.push({ item: 'Grundabsicherung (Mechanik)', cost: basePrice });

  const doorCost = doorsCount * 250;
  totalEstimate += doorCost;
  breakdown.push({ item: `Zusatzsicherung für ${doorsCount} Türen`, cost: doorCost });

  if (windowsCount > 0) {
    const windowCost = windowsCount * 150;
    totalEstimate += windowCost;
    breakdown.push({ item: `Zusatzsicherung für ${windowsCount} Fenster`, cost: windowCost });
  }

  if (includeVideo) {
    const videoCost = objectType === 'gewerbe' ? 1800 : 800;
    totalEstimate += videoCost;
    breakdown.push({ item: 'Videoüberwachung', cost: videoCost });
  }

  if (includeAlarm) {
    const alarmCost = objectType === 'gewerbe' ? 2500 : 1200;
    totalEstimate += alarmCost;
    breakdown.push({ item: 'Alarmanlage & Meldetechnik', cost: alarmCost });
  }

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'BASIC';
  if (totalEstimate > 1500) tier = 'STANDARD';
  if (totalEstimate > 4000) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown,
    tier
  };
}
