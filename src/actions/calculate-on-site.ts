'use server';

import type { OnSiteCalculationResult } from '@/types/on-site';

export async function calculateOnSite(
  prevState: unknown,
  formData: FormData
): Promise<OnSiteCalculationResult> {
  const serviceType = formData.get('serviceType') as string;
  const objectSize = Number(formData.get('objectSize'));

  let baseTimeMinutes = 0;
  let baseCost = 0;
  let materials = 0;

  switch (serviceType) {
    case 'AUTOSCHLUESSEL':
      baseTimeMinutes = 45;
      baseCost = 89;
      materials = 0; // Usually brought by customer or pre-ordered
      break;
    case 'ZYLINDERTAUSCH':
      baseTimeMinutes = 30 + (objectSize * 15);
      baseCost = 120 + (objectSize * 45);
      materials = objectSize * 80;
      break;
    case 'SCHLIESSANLAGE':
      baseTimeMinutes = 120 + (objectSize * 25);
      baseCost = 250 + (objectSize * 65);
      materials = objectSize * 150;
      break;
    case 'ZUTRITTSLOESUNG':
      baseTimeMinutes = 180 + (objectSize * 45);
      baseCost = 350 + (objectSize * 120);
      materials = objectSize * 400;
      break;
    case 'SICHERHEITSTECHNIK':
      baseTimeMinutes = 240 + (objectSize * 60);
      baseCost = 450 + (objectSize * 150);
      materials = objectSize * 250;
      break;
    default:
      baseTimeMinutes = 60;
      baseCost = 150;
      break;
  }

  // Simulate network delay for realism in optimistic UI
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    estimatedTimeMinutes: baseTimeMinutes,
    estimatedCostTotal: baseCost + materials,
    breakdown: [
      { label: 'Anfahrt & Grundpauschale', value: 89 },
      { label: 'Geschätzte Arbeitszeit', value: baseCost - 89 },
      { label: 'Material (Richtwert)', value: materials },
    ]
  };
}
