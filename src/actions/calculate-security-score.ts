'use server';

import type { SecurityScoreResult } from '@/types/security-score';

export async function calculateSecurityScore(
  prevState: SecurityScoreResult,
  formData: FormData
): Promise<SecurityScoreResult> {
  const mechanical = Number(formData.get('mechanical') || 0);
  const electronic = Number(formData.get('electronic') || 0);
  const video = Number(formData.get('video') || 0);
  const access = Number(formData.get('access') || 0);
  const monitoring = Number(formData.get('monitoring') || 0);

  const score = Math.round((mechanical * 30 + electronic * 25 + video * 15 + access * 15 + monitoring * 15) / 100);

  let tier: SecurityScoreResult['tier'] = 'BASIC';
  if (score >= 80) tier = 'PRO';
  else if (score >= 50) tier = 'ENHANCED';

  const recommendations: string[] = [];
  if (mechanical < 60) recommendations.push('Mechanischen Grundschutz an Türen und Fenstern verstärken.');
  if (electronic < 50) recommendations.push('Installation einer Außenhautüberwachung prüfen.');
  if (video < 30) recommendations.push('Videoüberwachung für sensible Außenbereiche erwägen.');
  if (access < 40) recommendations.push('Elektronische Zutrittskontrolle für bessere Schlüsselverwaltung nutzen.');
  if (monitoring < 50) recommendations.push('Aufschaltung auf eine zertifizierte Notrufleitstelle (NSL) in Betracht ziehen.');

  if (recommendations.length === 0) {
      recommendations.push('Ihr aktueller Schutz ist auf einem sehr guten Stand. Regelmäßige Wartung nicht vergessen.');
  }

  return {
    score,
    tier,
    recommendations
  };
}
