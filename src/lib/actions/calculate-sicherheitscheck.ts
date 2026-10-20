'use server';

export type SicherheitscheckResult = {
  score: number;
  recommendations: string[];
  estimatedCost: number;
  tier: 'BASIS' | 'ERWEITERT' | 'VOLLSCHUTZ';
};

export async function calculateSicherheitscheck(
  prevState: SicherheitscheckResult,
  formData: FormData
): Promise<SicherheitscheckResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const objectType = formData.get('objectType') as string;
  const accessPoints = Number(formData.get('accessPoints')) || 1;
  const currentLevel = formData.get('currentLevel') as string;

  let baseScore = 50;
  let estimatedCost = accessPoints * 250;

  if (currentLevel === 'high') baseScore += 30;
  else if (currentLevel === 'medium') baseScore += 10;
  else estimatedCost += accessPoints * 100;

  if (objectType === 'commercial') estimatedCost *= 1.5;

  let tier: 'BASIS' | 'ERWEITERT' | 'VOLLSCHUTZ' = 'BASIS';
  if (baseScore > 75) tier = 'VOLLSCHUTZ';
  else if (baseScore > 50) tier = 'ERWEITERT';

  return {
    score: Math.min(100, baseScore),
    recommendations: [
      `Absicherung von ${accessPoints} Zugangspunkten empfohlen.`,
      objectType === 'commercial' ? 'Erweiterte Zutrittskontrolle für Gewerbeobjekt prüfen.' : 'Mechanischer Grundschutz als Basis.',
      tier === 'BASIS' ? 'Erhebliches Verbesserungspotenzial vorhanden.' : 'Guter Grundschutz, Fokus auf elektronische Ergänzungen.'
    ],
    estimatedCost: Math.round(estimatedCost),
    tier
  };
}
