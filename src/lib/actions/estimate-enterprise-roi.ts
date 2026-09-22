'use server';

export type ROICalculationResult = {
  estimatedSavings: number;
  breakdown: { label: string; value: number }[];
  tier: 'STANDARD' | 'COMPLEX' | 'ENTERPRISE';
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const users = Number(formData.get('users')) || 50;
  const doors = Number(formData.get('doors')) || 20;

  const estimatedSavings = (users * 15) + (doors * 50);

  let tier: 'STANDARD' | 'COMPLEX' | 'ENTERPRISE' = 'STANDARD';
  if (doors > 50) tier = 'COMPLEX';
  if (doors > 150) tier = 'ENTERPRISE';

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    estimatedSavings,
    breakdown: [
      { label: 'Zeitersparnis Verwaltung', value: estimatedSavings * 0.4 },
      { label: 'Reduzierte Schlüsselverluste', value: estimatedSavings * 0.6 }
    ],
    tier,
  };
}
