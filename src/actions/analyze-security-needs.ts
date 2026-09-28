'use server';

export type SecurityLevel = 'BASIS' | 'ERWEITERT' | 'MAXIMAL';

export interface SecurityNeedsResult {
  level: SecurityLevel;
  recommendations: string[];
}

export async function analyzeSecurityNeeds(
  state: SecurityNeedsResult,
  formData: FormData
): Promise<SecurityNeedsResult> {
  const propertyType = formData.get('propertyType') as string;
  const areaSize = Number(formData.get('areaSize'));
  const userCount = Number(formData.get('userCount'));

  // Simulate complex analysis delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let level: SecurityLevel = 'BASIS';
  let recommendations: string[] = [
    'VdS-zertifizierte mechanische Schließzylinder',
    'Massive Schutzbeschläge'
  ];

  if (propertyType === 'gewerbe' || userCount > 5) {
      level = 'ERWEITERT';
      recommendations.push('Elektronische Zutrittskontrolle für Hauptzugänge');
      recommendations.push('Schließanlage mit Matrix-Verwaltung');
  }

  if (propertyType === 'industrie' || areaSize > 1000) {
      level = 'MAXIMAL';
      recommendations = [
          'Vollständige elektronische Schließanlage (RFID/Bluetooth)',
          'Integration in Einbruchmeldeanlage (EMA)',
          'Videoüberwachung kritischer Zonen',
          'Audit-Trail und Echtzeit-Protokollierung'
      ];
  }

  return { level, recommendations };
}
