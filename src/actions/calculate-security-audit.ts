'use server';

type SecurityAuditResult = {
  estimatedCost: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
};

export async function calculateSecurityAudit(
  prevState: SecurityAuditResult,
  formData: FormData
): Promise<SecurityAuditResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const complexity = Number(formData.get('complexity')) || 3;
  const existingSystem = formData.get('existingSystem') as string;
  const target = formData.get('target') as string;

  let baseCost = complexity * 250;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  const recommendations: string[] = [];

  // Logic for cost and recommendations
  if (target === 'high') {
     baseCost *= 1.5;
     recommendations.push('Erweiterte Risikoanalyse mit Schwachstellen-Penetrationstest empfohlen.');
     recommendations.push('Integration von Zutrittskontrollsystemen mit biometrischer Verifikation.');
  } else if (target === 'advanced') {
     baseCost *= 1.2;
     recommendations.push('Prüfung der Fenster und Türen auf Nachrüstbarkeit nach DIN 18104.');
  } else {
     recommendations.push('Fokus auf soliden mechanischen Grundschutz (Sicherheitsbeschläge, Panzerriegel).');
  }

  if (existingSystem === 'none') {
     riskLevel = 'HIGH';
     recommendations.unshift('Dringender Handlungsbedarf: Umfassende Grundsicherung fehlt.');
  } else if (existingSystem === 'electronic') {
     riskLevel = 'LOW';
     recommendations.push('Überprüfung der Systemkompatibilität und Update-Zyklen der elektronischen Komponenten.');
  }

  return {
    estimatedCost: Math.round(baseCost),
    riskLevel,
    recommendations
  };
}
