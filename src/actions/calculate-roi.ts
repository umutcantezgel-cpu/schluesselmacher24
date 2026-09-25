'use server';

export type ROICalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const doors = Number(formData.get('doors') || 50);
  const users = Number(formData.get('users') || 100);

  const baseCost = 2500;
  const perDoor = doors * 150;
  const perUser = users * 45;

  const totalEstimate = baseCost + perDoor + perUser;
  let tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' = 'STANDARD';

  if (totalEstimate > 50000) tier = 'ENTERPRISE';
  else if (totalEstimate > 15000) tier = 'PREMIUM';

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundsystem', amount: baseCost },
      { label: 'Türen & Schließstellen', amount: perDoor },
      { label: 'Benutzer & Berechtigungen', amount: perUser },
    ],
    tier,
  };
}
