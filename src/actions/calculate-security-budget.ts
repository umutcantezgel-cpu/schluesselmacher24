'use server';

export type SecurityTier = 'BASIC' | 'ADVANCED' | 'HIGH_END';

export interface SecurityBudgetResult {
  totalEstimate: number;
  tier: SecurityTier;
  breakdown: { label: string; cost: number }[];
}

export async function calculateSecurityBudget(
  prevState: SecurityBudgetResult,
  formData: FormData
): Promise<SecurityBudgetResult> {
  // Artificial delay for realism
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors') || 1);
  const windows = Number(formData.get('windows') || 0);
  const includeVideo = formData.get('video') === 'on';
  const includeAlarm = formData.get('alarm') === 'on';
  const tier = (formData.get('tier') as SecurityTier) || 'BASIC';

  let multiplier = 1;
  if (tier === 'ADVANCED') multiplier = 1.5;
  if (tier === 'HIGH_END') multiplier = 2.5;

  const doorsCost = doors * 300 * multiplier;
  const windowsCost = windows * 150 * multiplier;
  const videoCost = includeVideo ? 800 * multiplier : 0;
  const alarmCost = includeAlarm ? 1200 * multiplier : 0;

  const totalEstimate = doorsCost + windowsCost + videoCost + alarmCost;

  return {
    totalEstimate,
    tier,
    breakdown: [
      { label: `Türen (${doors})`, cost: doorsCost },
      { label: `Fenster (${windows})`, cost: windowsCost },
      ...(includeVideo ? [{ label: 'Videoüberwachung', cost: videoCost }] : []),
      ...(includeAlarm ? [{ label: 'Alarmanlage', cost: alarmCost }] : []),
    ],
  };
}
