'use server';

export type TriageResult = {
  estimatedDays: number;
  complexityLevel: 'STANDARD' | 'ERWEITERT' | 'KOMPLEX';
  recommendation: string;
};

export async function calculateProjectTriage(
  prevState: TriageResult,
  formData: FormData
): Promise<TriageResult> {
  // Simulate network delay for realistic interaction
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scope = Number(formData.get('scopeDays')) || 5;
  const isNetworked = formData.get('isNetworked') === 'true';
  const hasCompliance = formData.get('hasCompliance') === 'true';

  let complexityScore = scope;
  if (isNetworked) complexityScore += 10;
  if (hasCompliance) complexityScore += 15;

  let complexityLevel: TriageResult['complexityLevel'] = 'STANDARD';
  let recommendation = 'Standard-Service ausreichend. Kurzfristige Umsetzung möglich.';

  if (complexityScore > 20) {
    complexityLevel = 'KOMPLEX';
    recommendation = 'Umfassende Projektierung erforderlich. Ein Systemarchitekt wird hinzugezogen.';
  } else if (complexityScore > 10) {
    complexityLevel = 'ERWEITERT';
    recommendation = 'Erweiterte Planung notwendig. Abstimmung mit Herstellern erforderlich.';
  }

  // Calculate base estimated days (at least 2 days for any request here, scaling with scope)
  const estimatedDays = Math.max(2, Math.ceil(complexityScore * 0.4));

  return {
    estimatedDays,
    complexityLevel,
    recommendation,
  };
}
