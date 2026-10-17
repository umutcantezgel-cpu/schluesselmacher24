'use server';

export type SecurityRiskResult = {
  score: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
};

export async function calculateSecurityRisk(
  prevState: SecurityRiskResult,
  formData: FormData
): Promise<SecurityRiskResult> {
  const age = Number(formData.get('buildingAge') as string) || 0;
  const area = formData.get('areaType') as string || 'suburban';
  const doors = Number(formData.get('doorCount') as string) || 1;
  const hasAlarm = formData.get('hasAlarm') === 'on';

  let score = 50;
  if (age > 20) score -= 15;
  if (area === 'urban') score -= 10;
  if (area === 'rural') score -= 5;
  if (doors > 2) score -= 5;
  if (hasAlarm) score += 30;

  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
  if (score > 80) riskLevel = 'LOW';
  else if (score > 50) riskLevel = 'MEDIUM';
  else if (score > 20) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  const recommendations = [];
  if (age > 20) recommendations.push('Mechanischen Grundschutz an Fenstern und Türen nachrüsten.');
  if (!hasAlarm) recommendations.push('Installation einer Einbruchmeldeanlage erwägen.');
  if (doors > 2) recommendations.push('Elektronische Schließanlage zur besseren Kontrolle der Zugänge implementieren.');
  if (recommendations.length === 0) recommendations.push('Ihr aktueller Sicherheitsstandard ist sehr gut. Regelmäßige Wartung empfohlen.');

  return {
    score,
    riskLevel,
    recommendations,
  };
}
