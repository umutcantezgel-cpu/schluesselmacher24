'use server';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface RiskCalculationResult {
  score: number;
  level: RiskLevel;
}

export async function calculateRisk(prevState: RiskCalculationResult, formData: FormData): Promise<RiskCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const factor = Number(formData.get('riskFactor')) || 3;
  const score = factor * 20;

  let level: RiskLevel = 'MODERATE';
  if (score <= 40) level = 'LOW';
  else if (score <= 60) level = 'MODERATE';
  else if (score <= 80) level = 'HIGH';
  else level = 'CRITICAL';

  return { score, level };
}
