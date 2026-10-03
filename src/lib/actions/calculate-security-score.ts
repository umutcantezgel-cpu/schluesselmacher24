'use server';

export type SecurityScoreState = {
  score: number;
  recommendations: string[];
  status: 'IDLE' | 'CALCULATING' | 'COMPLETED';
};

export async function calculateSecurityScore(
  prevState: SecurityScoreState,
  formData: FormData
): Promise<SecurityScoreState> {
  const values = {
    doorSecurity: parseInt(formData.get('doorSecurity') as string || '0', 10),
    windowSecurity: parseInt(formData.get('windowSecurity') as string || '0', 10),
    accessControl: parseInt(formData.get('accessControl') as string || '0', 10),
    videoSurveillance: parseInt(formData.get('videoSurveillance') as string || '0', 10),
    alarmSystem: parseInt(formData.get('alarmSystem') as string || '0', 10),
  };

  // Artificial delay for optimistic UI feeling
  await new Promise((resolve) => setTimeout(resolve, 800));

  let totalScore = 0;
  totalScore += values.doorSecurity * 30;
  totalScore += values.windowSecurity * 25;
  totalScore += values.accessControl * 15;
  totalScore += values.alarmSystem * 20;
  totalScore += values.videoSurveillance * 10;

  const finalScore = Math.min(100, Math.max(0, totalScore));

  const recommendations: string[] = [];

  if (values.doorSecurity < 2) {
    recommendations.push('Dringender Handlungsbedarf bei mechanischer Türsicherheit (Mehrfachverriegelung, Zylinder).');
  }
  if (values.windowSecurity < 2) {
    recommendations.push('Sicherung von Fenstern und Fenstertüren im Erdgeschoss prüfen (Zusatzschlösser, Pilzkopfverriegelung).');
  }
  if (values.accessControl < 1) {
    recommendations.push('Erwägen Sie elektronische Zutrittslösungen zur besseren Schlüsselkontrolle.');
  }
  if (values.alarmSystem < 1 && finalScore < 60) {
    recommendations.push('Einbau einer Einbruchmeldeanlage (Alarmanlage) zur Früherkennung und Abschreckung empfohlen.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Ausgezeichneter Grundschutz! Wir empfehlen regelmäßige Wartungsintervalle.');
  }

  return {
    score: finalScore,
    recommendations,
    status: 'COMPLETED',
  };
}
