'use server';

export type ROICalculationResult = {
  estimatedSavings: number;
  amortizationMonths: number;
  efficiencyGainPercentage: number;
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors')) || 50;
  const employees = Number(formData.get('employees')) || 100;
  const keyLossRate = Number(formData.get('keyLossRate')) || 2; // keys lost per year

  // Calculate costs of mechanical key replacement (cylinder exchange, new keys, labor)
  const costPerLostKeyIncident = 450;
  const annualMechanicalLossCost = keyLossRate * costPerLostKeyIncident;

  // Administration time savings (hours per year)
  const adminTimePerEmployeeMechanical = 0.5;
  const adminTimePerEmployeeElectronic = 0.1;
  const adminHourlyRate = 45;

  const annualAdminSavings = employees * (adminTimePerEmployeeMechanical - adminTimePerEmployeeElectronic) * adminHourlyRate;

  // Total annual savings
  const totalAnnualSavings = annualMechanicalLossCost + annualAdminSavings;

  // Estimated Investment for Electronic System (simplified)
  const baseCost = 2500;
  const costPerDoor = 350;
  const costPerToken = 15;

  const estimatedInvestment = baseCost + (doors * costPerDoor) + (employees * costPerToken);

  // Amortization (Months)
  const amortizationMonths = Math.ceil((estimatedInvestment / (totalAnnualSavings / 12)));

  return {
    estimatedSavings: totalAnnualSavings,
    amortizationMonths: amortizationMonths,
    efficiencyGainPercentage: Math.round(((adminTimePerEmployeeMechanical - adminTimePerEmployeeElectronic) / adminTimePerEmployeeMechanical) * 100),
  };
}
