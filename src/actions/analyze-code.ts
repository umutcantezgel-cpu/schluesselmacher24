'use server';

export async function analyzeCodeFormat(prevState: unknown, formData: FormData) {
  const code = formData.get('code') as string;
  const manufacturer = formData.get('manufacturer') as string;

  if (!code || !manufacturer) {
    return {
      isValid: false,
      message: 'Bitte Code und Hersteller eingeben.',
      type: 'error'
    };
  }

  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let isValid = false;
  let message = '';
  let format = '';

  const cleanCode = code.trim().toUpperCase();

  switch (manufacturer) {
    case 'ABUS':
      // Basic check for ABUS: usually 4-6 digits or a letter followed by digits
      isValid = /^[A-Z]?[0-9]{4,6}$/.test(cleanCode);
      format = 'Buchstabe + 4-6 Ziffern oder nur 4-6 Ziffern';
      break;
    case 'BKS':
      isValid = /^[0-9A-Z]{4,8}$/.test(cleanCode);
      format = '4-8 alphanumerische Zeichen';
      break;
    case 'DOM':
      isValid = /^[A-Z]{1,2}[0-9]{4,6}$/.test(cleanCode);
      format = '1-2 Buchstaben + 4-6 Ziffern';
      break;
    case 'CES':
      isValid = /^[0-9]{4,7}[A-Z]?$/.test(cleanCode);
      format = '4-7 Ziffern + optional ein Buchstabe';
      break;
    case 'THULE':
      isValid = /^N[0-9]{3}$/.test(cleanCode);
      format = 'N + 3 Ziffern (z.B. N123)';
      break;
    default:
      // Generic fallback
      isValid = cleanCode.length >= 3 && cleanCode.length <= 10;
      format = '3-10 Zeichen (generisch)';
      break;
  }

  if (isValid) {
    message = `Das Format erscheint gültig für ${manufacturer}.`;
  } else {
    message = `Das Format passt nicht zum typischen ${manufacturer} Muster. Erwartet: ${format}. Bitte prüfen Sie Ihre Eingabe.`;
  }

  return {
    isValid,
    message,
    type: isValid ? 'success' : 'warning',
    analyzedCode: cleanCode
  };
}
