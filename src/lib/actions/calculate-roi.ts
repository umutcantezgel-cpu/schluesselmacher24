'use server';

export type RoiCalculationResult = {
  estimatedSavings: number;
  timeSavingsHours: number;
  securityScoreIncrease: number;
  tierRecommended: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM';
};

export async function calculateRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  const doors = Number(formData.get('doors')) || 10;
  const employees = Number(formData.get('employees')) || 50;
  const turnoverRate = Number(formData.get('turnoverRate')) || 10;

  // Simulate delay to show loading states and optimistic updates
  await new Promise(resolve => setTimeout(resolve, 800));

  // Calculation logic based on assumptions
  const lostKeyCostPerIncident = 250;
  const timePerKeyHandover = 0.5; // hours

  const incidentsPerYear = Math.max(1, Math.round(employees * (turnoverRate / 100) * 0.15));
  const estimatedSavings = incidentsPerYear * lostKeyCostPerIncident;
  const timeSavingsHours = Math.round(employees * (turnoverRate / 100) * timePerKeyHandover);

  let tierRecommended: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM' = 'STANDARD';
  let securityScoreIncrease = 15;

  if (doors > 50 || employees > 200) {
    tierRecommended = 'CUSTOM';
    securityScoreIncrease = 45;
  } else if (doors > 15 || employees > 50) {
    tierRecommended = 'ENTERPRISE';
    securityScoreIncrease = 30;
  }

  return {
    estimatedSavings,
    timeSavingsHours,
    securityScoreIncrease,
    tierRecommended
  };
}
