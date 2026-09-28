'use server';

export type KeyType = 'MECHANICAL' | 'REMOTE' | 'SMART_KEY';
export type KeyBrandGroup = 'PREMIUM' | 'STANDARD' | 'BUDGET';

export interface KeyPriceCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: string;
}

export async function calculateKeyPrice(
  prevState: KeyPriceCalculationResult,
  formData: FormData
): Promise<KeyPriceCalculationResult> {
  const brandGroup = formData.get('brandGroup') as KeyBrandGroup;
  const keyType = formData.get('keyType') as KeyType;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let basePrice = 0;
  let programmingCost = 0;
  const millingCost = 35; // Standard milling cost

  switch (brandGroup) {
    case 'PREMIUM':
      basePrice += 80;
      programmingCost += 120;
      break;
    case 'STANDARD':
      basePrice += 50;
      programmingCost += 80;
      break;
    case 'BUDGET':
      basePrice += 30;
      programmingCost += 50;
      break;
  }

  switch (keyType) {
    case 'MECHANICAL':
      basePrice += 20;
      programmingCost = 0; // No programming for purely mechanical
      break;
    case 'REMOTE':
      basePrice += 60;
      break;
    case 'SMART_KEY':
      basePrice += 120;
      programmingCost += 40; // Extra complex programming
      break;
  }

  const totalEstimate = basePrice + programmingCost + millingCost;

  return {
    totalEstimate,
    breakdown: [
      { label: 'Rohling & Elektronik', amount: basePrice },
      { label: 'Mechanisches Fräsen', amount: millingCost },
      { label: 'Programmierung (OBD/EEPROM)', amount: programmingCost },
    ],
    tier: brandGroup,
  };
}
