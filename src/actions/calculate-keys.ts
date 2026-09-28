'use server';

export type KeyCalculationResult = {
  totalEstimate: number;
  breakdown: { type: string; count: number; cost: number }[];
  tier: string;
};

export async function calculateKeyOrder(
  prevState: KeyCalculationResult,
  formData: FormData
): Promise<KeyCalculationResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  const standardCount = Number(formData.get('standardCount') || 0);
  const securityCount = Number(formData.get('securityCount') || 0);
  const carCount = Number(formData.get('carCount') || 0);

  const standardCost = standardCount * 12.50;
  const securityCost = securityCount * 35.00;
  const carCost = carCount * 85.00;

  const totalEstimate = standardCost + securityCost + carCost;

  let tier = 'STANDARD';
  if (totalEstimate > 500) {
    tier = 'ENTERPRISE';
  } else if (totalEstimate > 150) {
    tier = 'PREMIUM';
  }

  const breakdown = [];
  if (standardCount > 0) breakdown.push({ type: 'Standard (Zylinder)', count: standardCount, cost: standardCost });
  if (securityCount > 0) breakdown.push({ type: 'Sicherheitsschlüssel', count: securityCount, cost: securityCost });
  if (carCount > 0) breakdown.push({ type: 'Kfz-Schlüssel', count: carCount, cost: carCost });

  return {
    totalEstimate,
    breakdown,
    tier
  };
}
