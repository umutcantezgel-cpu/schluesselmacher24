'use server';

export type CodeAnalysisResult = {
  valid: boolean;
  code: string;
  category: 'Low Security' | 'Medium Security' | 'High Security' | 'Unbekannt';
  details: string;
};

export async function analyzeCode(prevState: CodeAnalysisResult, formData: FormData): Promise<CodeAnalysisResult> {
  const code = formData.get('keyCode')?.toString().trim().toUpperCase() ?? '';

  if (!code) {
    return {
      valid: false,
      code: '',
      category: 'Unbekannt',
      details: 'Bitte geben Sie einen Code ein.'
    };
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let category: CodeAnalysisResult['category'] = 'Unbekannt';
  let details = 'Code-Format unbekannt. Bitte vergleichen Sie mit unseren Bildern oder nutzen Sie die manuelle Suche.';

  if (/^\d{3,5}$/.test(code)) {
    category = 'Low Security';
    details = 'Zahlen-Code (3-5 Ziffern). Typisch für Briefkästen (z.B. RENZ, BURG WÄCHTER), Spinde und einfache Möbelschlösser. Fräsung erfolgt als einfaches Zackenprofil.';
  } else if (/^[A-Z]{1,2}\d{3,5}$/.test(code)) {
    category = 'Medium Security';
    details = 'Alphanumerischer Code. Häufig bei Dachboxen (z.B. THULE N-Serie), Fahrradschlössern (z.B. ABUS) und Schreibtischen. Erfordert Präzisionsfräsung.';
  } else if (/^[A-Z0-9]{6,}$/.test(code)) {
    category = 'High Security';
    details = 'Komplexer Code. Typisch für Autoschlüssel oder Bohrmuldenschlüssel. Dieser Code erfordert oft spezielle Laserfräsung (Innenbahn) und unter Umständen Transponder-Programmierung am Fahrzeug.';
  }

  return {
    valid: true,
    code,
    category,
    details
  };
}
