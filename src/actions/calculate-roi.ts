'use server';

export type ROICalculationResult = {
  totalSavings: number;
  timeSaved: number;
  amortizationMonths: number;
  tier: 'BASIC' | 'ENTERPRISE' | 'PRO';
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors')) || 10;
  const employees = Number(formData.get('employees')) || 20;
  const keyLossRate = Number(formData.get('keyLossRate')) || 2;

  // Basic calculation logic
  const costPerLostKey = 250;
  const adminTimePerChange = 2; // hours
  const adminHourlyRate = 50;

  const annualKeyLosses = Math.max(0, employees * (keyLossRate / 100));

  // Mechanische Anlage (Verlust = Zylindertausch)
  const mechanicalCost = annualKeyLosses * (costPerLostKey + (adminTimePerChange * adminHourlyRate) + (doors * 50));

  // Elektronische Anlage (Verlust = Karte sperren)
  const electronicCost = annualKeyLosses * (10 + (0.25 * adminHourlyRate)); // 10 EUR pro Karte, 15 Min Admin

  const totalSavings = Math.round(mechanicalCost - electronicCost);
  const timeSaved = Math.round(annualKeyLosses * (adminTimePerChange - 0.25));

  const setupCostElectronic = doors * 600 + employees * 10;
  const setupCostMechanical = doors * 150 + employees * 15;
  const extraInvestment = setupCostElectronic - setupCostMechanical;

  let amortizationMonths = totalSavings > 0 ? Math.ceil((extraInvestment / totalSavings) * 12) : 999;
  if(amortizationMonths < 0) amortizationMonths = 999;

  let tier: 'BASIC' | 'ENTERPRISE' | 'PRO' = 'BASIC';
  if (doors > 100 || employees > 200) tier = 'ENTERPRISE';
  else if (doors > 30 || employees > 50) tier = 'PRO';

  return {
    totalSavings,
    timeSaved,
    amortizationMonths,
    tier
  };
}
