'use server';

import type { SecurityCalculationResult } from '@/types/security';

export async function calculateSecuritySystem(
  prevState: SecurityCalculationResult,
  formData: FormData
): Promise<SecurityCalculationResult> {
  // Simulate network delay for Server Action
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors') || 1);
  const windows = Number(formData.get('windows') || 0);
  const includeVideo = formData.get('includeVideo') === 'on';
  const includeAlarm = formData.get('includeAlarm') === 'on';

  let totalEstimate = 0;
  const breakdown: { item: string; cost: number }[] = [];

  // Base mechanical security
  const doorCost = doors * 250;
  totalEstimate += doorCost;
  breakdown.push({ item: `Mechanische Sicherung für ${doors} Tür(en)`, cost: doorCost });

  if (windows > 0) {
    const windowCost = windows * 150;
    totalEstimate += windowCost;
    breakdown.push({ item: `Zusatzsicherungen für ${windows} Fenster`, cost: windowCost });
  }

  // Electronic components
  if (includeAlarm) {
    const alarmCost = 850 + (doors + windows) * 80;
    totalEstimate += alarmCost;
    breakdown.push({ item: 'Gefahrenwarnanlage / Alarmtechnik (Basissystem inkl. Melder)', cost: alarmCost });
  }

  if (includeVideo) {
    const videoCost = 1200 + (doors > 2 ? 600 : 0);
    totalEstimate += videoCost;
    breakdown.push({ item: 'Videoüberwachungssystem (inkl. Rekorder und 1-2 Kameras)', cost: videoCost });
  }

  const tier = totalEstimate < 1500 ? 'BASIC' : totalEstimate < 3500 ? 'ADVANCED' : 'PREMIUM';

  return {
    totalEstimate,
    breakdown,
    tier,
  };
}
