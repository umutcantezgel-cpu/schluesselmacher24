'use server';

export type CodeAnalysisResult = {
  isValid: boolean;
  type: string;
  manufacturer: string;
  estimatedCost: number;
  message: string;
};

export async function analyzeKeycode(prevState: CodeAnalysisResult, formData: FormData): Promise<CodeAnalysisResult> {
  const code = formData.get('keycode') as string;

  if (!code || code.length < 3) {
    return {
      isValid: false,
      type: 'Unbekannt',
      manufacturer: 'Nicht ermittelbar',
      estimatedCost: 0,
      message: 'Bitte geben Sie einen gültigen Code mit mindestens 3 Zeichen ein.'
    };
  }

  let type = 'Standard-Profilzylinder';
  let manufacturer = 'Diverse';
  let estimatedCost = 25;
  let message = 'Standardcode erkannt. Eine Fertigung ist in der Regel innerhalb von 24 Stunden möglich.';

  if (code.toUpperCase().startsWith('AB')) {
    manufacturer = 'ABUS';
    type = 'Sicherheits-Profilzylinder';
    estimatedCost = 35;
    message = 'ABUS Systemcode erkannt. Die Fertigung erfolgt als Hochsicherheitsschlüssel.';
  } else if (code.toUpperCase().startsWith('BKS')) {
    manufacturer = 'BKS';
    type = 'Schließanlagen-Schlüssel';
    estimatedCost = 45;
    message = 'BKS Anlagencode erkannt. Bitte prüfen Sie, ob eine Sicherungskarte erforderlich ist.';
  } else if (code.toUpperCase().startsWith('KES')) {
    manufacturer = 'KESO';
    type = 'Wendeschlüsselsystem';
    estimatedCost = 55;
    message = 'KESO System erkannt. Höchste Präzision durch Schweizer Maßfertigung.';
  }

  return {
    isValid: true,
    type,
    manufacturer,
    estimatedCost,
    message
  };
}
