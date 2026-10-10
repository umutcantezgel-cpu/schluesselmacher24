'use server';

export type ValidationResult = {
  isValid: boolean;
  message: string;
  manufacturer?: string;
  keyType?: string;
};

export async function validateKeyCode(
  prevState: unknown,
  formData: FormData
): Promise<ValidationResult> {
  const code = formData.get('code') as string;

  if (!code || code.trim() === '') {
    return { isValid: false, message: 'Bitte geben Sie einen Code ein.' };
  }

  const normalized = code.trim().toUpperCase();

  if (normalized.startsWith('AB')) {
    return { isValid: true, message: 'Gültiger Code für ABUS Zylinder erkannt.', manufacturer: 'ABUS', keyType: 'Profilzylinder (Bravus/Vela)' };
  }

  if (normalized.length === 5 && !isNaN(Number(normalized))) {
    return { isValid: true, message: 'Gültiges 5-stelliges Format erkannt.', manufacturer: 'BKS oder ähnlich', keyType: 'Standard-Schließung' };
  }

  if (normalized.startsWith('X') || normalized.startsWith('Y')) {
    return { isValid: true, message: 'Gültiger Code für komplexe Anlagen.', manufacturer: 'DOM / CES', keyType: 'Wendeschlüssel' };
  }

  return { isValid: true, message: 'Format erkannt. Die genaue maschinelle Prüfung erfolgt im Warenkorb.', manufacturer: 'Universelle Prüfung', keyType: 'Verschiedene' };
}
