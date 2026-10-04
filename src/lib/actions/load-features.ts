'use server';

export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export async function loadFeatures(category: string): Promise<FeatureData[]> {
  // Simulate loading features based on category
  await new Promise((resolve) => setTimeout(resolve, 500));

  const baseFeatures = [
    { id: '1', title: 'Präzisionsfertigung', description: 'Modernste CNC-Fräsen für exakte Schlüsselkopien nach Herstellervorgaben.', icon: 'Wrench' },
    { id: '2', title: 'Sichere Codierung', description: 'Programmierung von Transpondern und Fernbedienungen für 95% aller Fahrzeugmarken.', icon: 'ShieldCheck' },
    { id: '3', title: 'Schneller Service', description: 'Viele Schlüsselmodelle sind sofort auf Lager und können umgehend angefertigt werden.', icon: 'CalendarClock' },
    { id: '4', title: 'Transparenz', description: 'Vorherige Prüfung und feste Preisrahmen vor Auftragserteilung. Keine Überraschungen.', icon: 'ScanLine' },
  ];

  if (category === 'advanced') {
    return [
      ...baseFeatures,
      { id: '5', title: 'Smart Entry', description: 'Unterstützung für schlüssellose Zugangssysteme.', icon: 'KeyRound' },
      { id: '6', title: 'Reparatur', description: 'Instandsetzung beschädigter Autoschlüssel-Gehäuse und Taster.', icon: 'Wrench' }
    ];
  }

  return baseFeatures;
}
