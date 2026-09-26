'use server';

export type CodeResult = {
  status: 'IDLE' | 'SEARCHING' | 'FOUND' | 'NOT_FOUND';
  message: string;
};

export async function findCodeAction(
  prevState: CodeResult,
  formData: FormData
): Promise<CodeResult> {
  const code = formData.get('code') as string;
  if (!code) return { status: 'NOT_FOUND', message: 'Bitte geben Sie einen Code ein.' };

  // Dummy delay for simulation
  await new Promise(resolve => setTimeout(resolve, 800));

  if (code.length > 3) {
    return { status: 'FOUND', message: `Code ${code} wurde in unserer Datenbank gefunden. Machbarkeit bestätigt.` };
  }
  return { status: 'NOT_FOUND', message: `Code ${code} konnte nicht eindeutig zugeordnet werden.` };
}
