'use server';

export type ValidateCodeState = {
  success: boolean;
  message: string;
  calculatedPrice: number;
};

export async function validateCodeAction(prevState: ValidateCodeState, formData: FormData): Promise<ValidateCodeState> {
  const code = formData.get('code') as string;
  const quantity = Number(formData.get('quantity') as string) || 1;
  const hasSecurityCard = formData.get('hasSecurityCard') === 'on';

  if (!code || code.length < 3) {
    return {
      success: false,
      message: 'Bitte geben Sie einen gültigen, mindestens 3-stelligen Code ein.',
      calculatedPrice: 0,
    };
  }

  // Simulate complex validation and pricing logic
  const basePrice = code.toUpperCase().startsWith('S') ? 14.50 : 9.90;
  const securitySurcharge = hasSecurityCard ? 5.00 : 0;
  const quantityDiscount = quantity >= 5 ? 0.9 : 1; // 10% discount for 5 or more

  const finalPrice = (basePrice + securitySurcharge) * quantity * quantityDiscount;

  return {
    success: true,
    message: `Code "${code}" erfolgreich validiert.`,
    calculatedPrice: finalPrice,
  };
}
