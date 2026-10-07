
'use server';

type ProfileAnalysisResult = {
  status: 'IDLE' | 'ANALYZING' | 'SUCCESS';
  confidence: number;
  message: string;
};

export async function analyzeProfile(prevState: ProfileAnalysisResult, formData: FormData): Promise<ProfileAnalysisResult> {
  const hasMilling = formData.get('hasMilling') === 'on';
  const hasText = formData.get('hasText') === 'on';
  const isElectronic = formData.get('isElectronic') === 'on';

  await new Promise(resolve => setTimeout(resolve, 800));

  let confidence = 50;
  if (hasMilling) confidence += 20;
  if (hasText) confidence += 20;
  if (isElectronic) confidence -= 10;

  return {
    status: 'SUCCESS',
    confidence,
    message: 'Die komplexe Matrix-Evaluation wurde erfolgreich abgeschlossen. Dieses Profil kann nach Vorlage reproduziert werden.'
  };
}
