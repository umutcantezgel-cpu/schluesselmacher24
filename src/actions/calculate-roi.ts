'use server';

export type ROICalculationResult = {
  estimatedROI: number;
  timeSavingsHours: number;
  financialImpact: number;
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const employees = Number(formData.get('employees') || 50);
  const currentProcessTime = Number(formData.get('currentProcessTime') || 10);
  const averageHourlyRate = Number(formData.get('averageHourlyRate') || 45);

  // Simulate server processing
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simple calculation logic for demonstration
  const newProcessTime = currentProcessTime * 0.4; // 60% reduction
  const timeSavingsPerWeek = (currentProcessTime - newProcessTime) * employees;
  const timeSavingsHours = timeSavingsPerWeek * 52; // per year
  const financialImpact = timeSavingsHours * averageHourlyRate;

  // Calculate ROI percentage based on an arbitrary investment of €25,000
  const investment = 25000;
  const estimatedROI = Math.round(((financialImpact - investment) / investment) * 100);

  return {
    estimatedROI: Math.max(0, estimatedROI),
    timeSavingsHours: Math.round(timeSavingsHours),
    financialImpact: Math.round(financialImpact),
  };
}
