'use server';

import type { RoiCalculationResult } from '@/types/enterprise-roi';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors')) || 10;
  const users = Number(formData.get('users')) || 20;

  // Example calculation logic
  const hardwareCost = doors * 250;
  const userCost = users * 45;
  const integrationCost = doors > 50 ? 1500 : 500;

  const totalEstimate = hardwareCost + userCost + integrationCost;

  let tier: RoiCalculationResult['tier'] = 'STANDARD';
  if (totalEstimate > 10000) tier = 'ENTERPRISE';
  else if (totalEstimate > 5000) tier = 'PREMIUM';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Hardware (Zylinder & Beschläge)', amount: hardwareCost },
      { label: 'Nutzer (Schlüssel & Medien)', amount: userCost },
      { label: 'Integration & Setup', amount: integrationCost },
    ],
    tier,
  };
}
