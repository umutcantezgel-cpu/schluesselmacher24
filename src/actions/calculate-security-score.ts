'use server';

export type SecurityScoreResult = {
  score: number;
  recommendations: string[];
  status: 'LOW' | 'MEDIUM' | 'HIGH';
};

export async function calculateSecurityScore(
  prevState: SecurityScoreResult,
  formData: FormData
): Promise<SecurityScoreResult> {
  const mechanical = formData.get('mechanical') === 'yes';
  const electronic = formData.get('electronic') === 'yes';
  const video = formData.get('video') === 'yes';

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let score = 30;
  const recommendations: string[] = [];

  if (mechanical) {
    score += 30;
  } else {
    recommendations.push("Mechanischen Grundschutz ausbauen (Zylinder, Beschläge).");
  }

  if (electronic) {
    score += 25;
  } else {
    recommendations.push("Elektronische Melde- und Schließtechnik ergänzen.");
  }

  if (video) {
    score += 15;
  } else {
    recommendations.push("Videoüberwachung für kritische Außenbereiche prüfen.");
  }

  let status: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 80) status = 'HIGH';
  else if (score >= 50) status = 'MEDIUM';

  return {
    score,
    recommendations,
    status,
  };
}
