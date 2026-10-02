'use server';

export type ROICalculationResult = {
  estimatedBudget: number;
  recommendation: string;
};

export async function calculateSecurityROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const scope = Number(formData.get('scopeValue') || 1);
  const type = formData.get('propertyType') || 'private';

  const baseRate = type === 'commercial' ? 2500 : 800;
  const estimatedBudget = baseRate * scope;

  let recommendation = 'Basisschutz (Mechanik + Melder)';
  if (estimatedBudget > 5000) recommendation = 'Umfassender Schutz (inkl. Video & Alarmaufschaltung)';
  if (estimatedBudget > 10000) recommendation = 'Vollschutz nach VdS-Klasse B/C';

  return { estimatedBudget, recommendation };
}
