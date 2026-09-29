'use server';

export type SecurityScoreResult = {
  score: number;
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
};

export async function calculateSecurityScore(
  prevState: SecurityScoreResult,
  formData: FormData
): Promise<SecurityScoreResult> {
  const hasAlarm = formData.get('hasAlarm') === 'on';
  const hasVideo = formData.get('hasVideo') === 'on';
  const hasAccessControl = formData.get('hasAccessControl') === 'on';
  const yearBuilt = parseInt(formData.get('yearBuilt') as string) || 2000;

  let score = 50;
  const recommendations: string[] = [];

  if (hasAlarm) score += 20;
  else recommendations.push('Installation einer VdS-zertifizierten Einbruchmeldeanlage empfohlen.');

  if (hasVideo) score += 15;
  else recommendations.push('Videoüberwachung der Außenbereiche und Zugänge prüfen.');

  if (hasAccessControl) score += 15;
  else recommendations.push('Umrüstung auf elektronische Zutrittskontrolle zur flexiblen Verwaltung.');

  if (yearBuilt < 2010 && !hasAlarm && !hasAccessControl) {
      score -= 10;
      recommendations.push('Ältere Gebäude weisen oft Schwachstellen in der Mechanik auf. Eine mechanische Grundsicherung ist prioritär.');
  }

  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
  if (score >= 80) riskLevel = 'LOW';
  else if (score >= 50) riskLevel = 'MEDIUM';

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return { score, recommendations, riskLevel };
}
