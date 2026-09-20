'use server';

export type ROICalculationResult = {
  totalInvestment: number;
  annualSavings: number;
  roiMonths: number;
  breakevenYear: number;
  status: 'IDLE' | 'CALCULATED';
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const doors = Number(formData.get('doors')) || 0;
  const users = Number(formData.get('users')) || 0;
  const hourlyRate = Number(formData.get('hourlyRate')) || 0;

  // Simulate calculation delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Baseline costs
  const hardwareCost = doors * 150; // Ø cost per mechanical cylinder
  const keyCost = users * 15; // Ø cost per key
  const totalInvestment = hardwareCost + keyCost;

  // Key management overhead
  const keyLossRate = 0.05; // 5% key loss per year
  const replacementTime = 4; // hours spent managing lost key, reordering, security checks

  // Annual cost of lost keys (replacement + admin time)
  const lostKeysPerYear = users * keyLossRate;
  const replacementCost = lostKeysPerYear * 250; // cost to replace cylinder + key
  const adminCost = lostKeysPerYear * replacementTime * hourlyRate;

  const annualSavings = replacementCost + adminCost;

  // ROI in months
  const roiMonths = annualSavings > 0 ? Math.round((totalInvestment / annualSavings) * 12) : 0;

  // Breakeven year
  const breakevenYear = new Date().getFullYear() + Math.ceil(roiMonths / 12);

  return {
    totalInvestment,
    annualSavings: Math.round(annualSavings),
    roiMonths,
    breakevenYear,
    status: 'CALCULATED',
  };
}
