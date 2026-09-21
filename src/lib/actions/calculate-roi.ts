'use server';

export type RoiCalculationResult = {
  estimatedSavings: number;
  amortizationMonths: number;
  tier: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM';
  details: string[];
};

export async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors')) || 0;
  const users = Number(formData.get('users')) || 0;
  const keyLossRate = Number(formData.get('keyLossRate')) || 0;
  const hourlyRate = Number(formData.get('hourlyRate')) || 65;

  // Extremely basic logic just to have numbers
  const savingsPerDoor = doors * 25; // Admin savings
  const savingsPerLostKey = keyLossRate * (hourlyRate * 3 + 150); // Cylinder replace time + hardware cost
  const totalSavings = savingsPerDoor + savingsPerLostKey;

  let tier: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM' = 'STANDARD';
  if (doors > 200 || users > 500) {
    tier = 'CUSTOM';
  } else if (doors > 50 || users > 100) {
    tier = 'ENTERPRISE';
  }

  const amortizationMonths = totalSavings > 0 ? Math.max(6, Math.round(50000 / totalSavings)) : 36;

  return {
    estimatedSavings: totalSavings,
    amortizationMonths,
    tier,
    details: [
      `Einsparungen durch reduzierte Verwaltung: ${savingsPerDoor.toLocaleString('de-DE')} €/Jahr`,
      `Einsparungen durch vermiedene Zylinderwechsel bei Schlüsselverlust: ${savingsPerLostKey.toLocaleString('de-DE')} €/Jahr`
    ]
  };
}
