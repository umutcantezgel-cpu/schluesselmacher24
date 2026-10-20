'use server';

export type SecurityScoreResult = {
  score: number;
  recommendations: string[];
  tier: 'BASIC' | 'ENHANCED' | 'MAXIMUM';
};

export async function calculateSecurityScore(
  prevState: SecurityScoreResult,
  formData: FormData
): Promise<SecurityScoreResult> {
  const q1 = parseInt(formData.get('q1') as string || '0', 10);
  const q2 = parseInt(formData.get('q2') as string || '0', 10);
  const q3 = parseInt(formData.get('q3') as string || '0', 10);
  const q4 = parseInt(formData.get('q4') as string || '0', 10);

  const totalScore = q1 + q2 + q3 + q4;
  let tier: 'BASIC' | 'ENHANCED' | 'MAXIMUM' = 'BASIC';
  const recommendations: string[] = [];

  if (totalScore < 10) {
    tier = 'BASIC';
    recommendations.push('Ihre mechanische Grundsicherung sollte umgehend überprüft werden.');
    recommendations.push('Erwägen Sie die Nachrüstung von Pilzkopfverriegelungen an Fenstern und Terrassentüren.');
  } else if (totalScore < 16) {
    tier = 'ENHANCED';
    recommendations.push('Ihre mechanische Grundsicherung ist solide.');
    recommendations.push('Eine elektronische Meldetechnik (Alarmanlage) wäre eine sinnvolle Ergänzung.');
  } else {
    tier = 'MAXIMUM';
    recommendations.push('Ihr Objekt ist sehr gut abgesichert.');
    recommendations.push('Regelmäßige Wartung der Systeme wird empfohlen.');
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    score: totalScore,
    recommendations,
    tier
  };
}
