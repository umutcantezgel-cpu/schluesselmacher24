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
  // Mock calculation
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate async work

  const hasMechanical = formData.get('hasMechanical') === 'on';
  const hasAlarm = formData.get('hasAlarm') === 'on';
  const hasVideo = formData.get('hasVideo') === 'on';
  const propertyType = formData.get('propertyType') as string;

  let score = 0;
  const recommendations: string[] = [];

  if (hasMechanical) score += 40;
  else recommendations.push("Zwingend: Mechanischer Grundschutz (Zylinder, Beschläge)");

  if (hasAlarm) score += 30;
  else recommendations.push("Empfohlen: Alarmtechnik zur Meldung von Einbruchversuchen");

  if (hasVideo) score += 30;
  else recommendations.push("Optional: Videoüberwachung zur Prävention und Dokumentation");

  if (propertyType === 'commercial' && !hasAlarm) {
    recommendations.push("Dringend: Bei Gewerbeobjekten ist eine Alarmanlage essentiell");
  }

  let status: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 80) status = 'HIGH';
  else if (score >= 50) status = 'MEDIUM';

  return {
    score,
    recommendations,
    status
  };
}
