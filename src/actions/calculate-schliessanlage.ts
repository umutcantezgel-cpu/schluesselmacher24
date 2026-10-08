'use server';

export type SchliessanlagenCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM';
};

export async function calculateSchliessanlage(
  prevState: SchliessanlagenCalculationResult,
  formData: FormData
): Promise<SchliessanlagenCalculationResult> {
  const doors = Number(formData.get('doors') || 10);
  const keys = Number(formData.get('keys') || 20);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const basePricePerDoor = 150;
  const basePricePerKey = 25;
  const planningFee = 250;

  const totalEstimate = doors * basePricePerDoor + keys * basePricePerKey + planningFee;

  let tier: 'BASIC' | 'STANDARD' | 'PREMIUM' = 'STANDARD';
  if (totalEstimate < 2000) tier = 'BASIC';
  if (totalEstimate > 5000) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Zylinder & Türen', value: doors * basePricePerDoor },
      { label: 'Schlüssel', value: keys * basePricePerKey },
      { label: 'Planung & Dokumentation', value: planningFee },
    ],
    tier,
  };
}
