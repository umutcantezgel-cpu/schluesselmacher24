'use server';

export type EnterpriseROICalculationResult = {
  roiPercent: number;
  amortizationMonths: number;
  savedHoursPerYear: number;
  totalCostEstimate: number;
};

export async function calculateEnterpriseROI(
  _prevState: EnterpriseROICalculationResult,
  formData: FormData
): Promise<EnterpriseROICalculationResult> {
  // Simulate processing time for realistic UI interaction
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors') || 50);
  const users = Number(formData.get('users') || 100);
  const hourlyRate = Number(formData.get('hourlyRate') || 45);

  // Simplified logic for ROI calculation
  const baseSystemCost = 2500;
  const costPerDoor = 350;
  const costPerUser = 25;

  const totalCostEstimate = baseSystemCost + doors * costPerDoor + users * costPerUser;

  // Assuming digital/modern systems save time on key handovers, replacements, and administration.
  // E.g., 10 minutes saved per user per year + 20 minutes per door.
  const savedMinutesPerYear = users * 10 + doors * 20;
  const savedHoursPerYear = savedMinutesPerYear / 60;
  const savedCostPerYear = savedHoursPerYear * hourlyRate;

  // Return realistic estimations
  const amortizationMonths = totalCostEstimate / (savedCostPerYear / 12);
  const roiPercent = ((savedCostPerYear - totalCostEstimate) / totalCostEstimate) * 100;

  return {
    roiPercent: Math.max(-100, Math.round(roiPercent)),
    amortizationMonths: Math.max(1, Math.round(amortizationMonths)),
    savedHoursPerYear: Math.round(savedHoursPerYear),
    totalCostEstimate: Math.round(totalCostEstimate),
  };
}
