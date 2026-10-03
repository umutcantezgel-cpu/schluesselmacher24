'use server';

export type SecurityCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: 'BASIC' | 'ADVANCED' | 'COMPREHENSIVE';
};

export async function calculateSecurity(
  prevState: SecurityCalculationResult,
  formData: FormData
): Promise<SecurityCalculationResult> {
  const doors = Number(formData.get('doors') || 1);
  const windows = Number(formData.get('windows') || 0);
  const includeAlarm = formData.get('includeAlarm') === 'on';
  const includeCamera = formData.get('includeCamera') === 'on';

  let baseCost = (doors * 250) + (windows * 150);
  const breakdown = [
    { label: `Mechanische Sicherung (${doors} Türen, ${windows} Fenster)`, cost: baseCost }
  ];

  if (includeAlarm) {
    baseCost += 800;
    breakdown.push({ label: 'Basis-Alarmsystem', cost: 800 });
  }

  if (includeCamera) {
    baseCost += 1200;
    breakdown.push({ label: 'Videoüberwachung', cost: 1200 });
  }

  let tier: 'BASIC' | 'ADVANCED' | 'COMPREHENSIVE' = 'BASIC';
  if (baseCost > 2500) tier = 'COMPREHENSIVE';
  else if (baseCost > 1000) tier = 'ADVANCED';

  // Simuliere Ladezeit für Action
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: baseCost,
    breakdown,
    tier
  };
}
