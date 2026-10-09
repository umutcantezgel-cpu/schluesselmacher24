'use server';

export type ThreatCalculationResult = {
  score: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
};

export async function calculateThreatScore(
  prevState: unknown,
  formData: FormData
): Promise<ThreatCalculationResult> {
  // Simulate network delay for realistic transition feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const objectType = formData.get('objectType') as string;
  const areaType = formData.get('areaType') as string;
  const mechanicalSecurity = formData.get('mechanicalSecurity') as string;
  const electronicSecurity = formData.get('electronicSecurity') as string;

  let score = 50; // Base score

  // Object Type
  if (objectType === 'commercial') score += 20;
  else if (objectType === 'industrial') score += 30;

  // Area Type
  if (areaType === 'urban') score += 15;
  else if (areaType === 'isolated') score += 25;

  // Mechanical
  if (mechanicalSecurity === 'high') score -= 20;
  else if (mechanicalSecurity === 'low') score += 10;

  // Electronic
  if (electronicSecurity === 'advanced') score -= 25;
  else if (electronicSecurity === 'none') score += 15;

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  const recommendations: string[] = [];

  if (score < 30) {
    riskLevel = 'LOW';
    recommendations.push('Ihre Basisabsicherung ist gut. Prüfen Sie regelmäßige Wartungsintervalle.');
  } else if (score < 70) {
    riskLevel = 'MEDIUM';
    recommendations.push('Erweitern Sie Ihre mechanische Grundsicherung.');
    if (electronicSecurity === 'none') {
        recommendations.push('Ziehen Sie die Integration einer Alarmanlage in Betracht.');
    }
  } else {
    riskLevel = 'HIGH';
    recommendations.push('Dringender Handlungsbedarf bei mechanischer und elektronischer Sicherung.');
    recommendations.push('Vereinbaren Sie umgehend einen Vor-Ort-Termin für ein ganzheitliches Sicherheitskonzept.');
  }

  return {
    score,
    riskLevel,
    recommendations
  };
}
