'use server';

export type ROIResult = {
  estimatedSavings: number;
  paybackPeriodMonths: number;
  efficiencyGainPercentage: number;
};

export async function calculateEnterpriseROI(prevState: ROIResult, formData: FormData): Promise<ROIResult> {
  const employees = Number(formData.get('employees')) || 50;
  const currentKeyCost = Number(formData.get('currentKeyCost')) || 5000;
  const adminHoursPerWeek = Number(formData.get('adminHoursPerWeek')) || 10;

  // Calculate basic ROI based on inputs
  const adminCostPerYear = adminHoursPerWeek * 52 * 40; // Assuming 40€/hour


  // Enterprise system saves approx 70% of admin time and 40% of key replacement costs
  const savedAdminCost = adminCostPerYear * 0.7;
  const savedKeyCost = currentKeyCost * 0.4;

  const estimatedSavings = Math.round(savedAdminCost + savedKeyCost);

  // Assuming a base system cost depending on employees
  const systemCost = employees * 150 + 5000;

  const paybackPeriodMonths = Math.max(1, Math.round((systemCost / estimatedSavings) * 12));

  return {
    estimatedSavings,
    paybackPeriodMonths,
    efficiencyGainPercentage: 70
  };
}
