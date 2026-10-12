'use server';

import type { SecurityScoreResult } from '@/components/sicherheitstechnik/security-risk-calculator';

export async function calculateSecurityScore(
  prevState: SecurityScoreResult,
  formData: FormData
): Promise<SecurityScoreResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const objectType = formData.get('objectType') as string;
  const location = formData.get('location') as string;
  const currentSecurity = formData.get('currentSecurity') as string;
  const valuables = formData.get('valuables') as string;

  let score = 20; // Base risk

  if (objectType === 'house') score += 15;
  if (objectType === 'business') score += 25;

  if (location === 'rural') score += 15;
  if (location === 'suburban') score += 10;

  if (currentSecurity === 'none') score += 20;
  if (currentSecurity === 'advanced') score -= 20;

  if (valuables === 'high') score += 15;
  if (valuables === 'very_high') score += 30;

  score = Math.min(Math.max(score, 10), 95);

  let level = 'Basis-Schutz ausreichend';
  let recommendations = [
    'Überprüfung der mechanischen Grundsicherung',
    'Installation von abschließbaren Fenstergriffen'
  ];

  if (score > 40) {
    level = 'Erhöhter Schutzbedarf (VdS Klasse A/B)';
    recommendations = [
      'Einbau einer professionellen Einbruchmeldeanlage',
      'Aufrüstung der Schließzylinder auf höchsten Bohrschutz',
      'Sicherung von Kellerschächten und Nebeneingängen'
    ];
  }

  if (score > 70) {
    level = 'Hochrisiko-Absicherung (VdS Klasse C)';
    recommendations = [
      'Umfassende Videoüberwachung mit intelligenter Analyse',
      'Aufschaltung der Alarmanlage auf eine 24/7 Notrufleitstelle',
      'Zutrittskontrollsystem mit biometrischer Erfassung',
      'Mechatronische Schließanlage für alle Zugänge'
    ];
  }

  return {
    score,
    level,
    recommendations
  };
}
