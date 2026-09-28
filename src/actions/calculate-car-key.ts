'use server';

export interface CarKeyCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: string;
}

export async function calculateCarKeyBudget(
  prevState: CarKeyCalculationResult,
  formData: FormData
): Promise<CarKeyCalculationResult> {
  const serviceType = formData.get('serviceType') as string;
  const keyType = formData.get('keyType') as string;

  let base = 0;
  if (serviceType === 'kopieren') base += 50;
  if (serviceType === 'programmieren') base += 120;
  if (serviceType === 'verloren') base += 250;

  if (keyType === 'funk') base += 80;
  if (keyType === 'smart') base += 150;
  if (keyType === 'mechanisch') base += 20;

  return {
    totalEstimate: base,
    breakdown: [
      { label: 'Grundgebühr', amount: base },
    ],
    tier: base > 300 ? 'PREMIUM' : 'STANDARD',
  };
}
