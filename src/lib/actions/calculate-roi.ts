'use server';

export type EnterpriseROICalculationResult = {
  roiPercent: number;
  paybackMonths: number;
  annualSavings: number;
  timeSavedHours: number;
  totalInvestment: number;
};

export async function calculateEnterpriseROI(
  _prevState: EnterpriseROICalculationResult,
  formData: FormData
): Promise<EnterpriseROICalculationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors') || 50);
  const users = Number(formData.get('users') || 150);
  const turnoverPercent = Number(formData.get('turnoverPercent') || 10);

  // Base costs and assumptions
  const costPerElectronicCylinder = 450;

  // Current mechanical system costs (annual)
  const annualLostKeys = Math.ceil(users * (turnoverPercent / 100) * 0.5); // Assume 50% of turnover results in lost keys
  const costPerLostKeyReplacement = 1500; // Replacement of cylinder + new keys for a group
  const annualMechanicalKeyManagementHours = users * 1.5; // 1.5 hours per user per year for key management
  const hourlyRateAdmin = 45;

  const annualCostMechanical = (annualLostKeys * costPerLostKeyReplacement) + (annualMechanicalKeyManagementHours * hourlyRateAdmin);

  // Electronic system costs
  const totalInvestment = (doors * costPerElectronicCylinder) + (users * 15) + 2500; // Cylinders, transponders, software

  // Future electronic system costs (annual)
  const annualElectronicManagementHours = users * 0.2; // Only 12 mins per user per year
  const annualCostElectronic = annualElectronicManagementHours * hourlyRateAdmin; // No cost for lost keys (just block them)

  // Savings
  const annualSavings = annualCostMechanical - annualCostElectronic;
  const timeSavedHours = annualMechanicalKeyManagementHours - annualElectronicManagementHours;

  // ROI and Payback
  const paybackMonths = annualSavings > 0 ? (totalInvestment / annualSavings) * 12 : 999;
  const roiPercent = annualSavings > 0 ? (annualSavings / totalInvestment) * 100 : 0;

  return {
    roiPercent: Math.round(roiPercent),
    paybackMonths: Math.ceil(paybackMonths),
    annualSavings: Math.round(annualSavings),
    timeSavedHours: Math.round(timeSavedHours),
    totalInvestment: Math.round(totalInvestment),
  };
}
