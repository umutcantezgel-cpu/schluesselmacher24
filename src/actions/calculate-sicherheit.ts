'use server';

import type { SicherheitCalculationResult } from '@/components/calculator/sicherheit-rechner';

export async function calculateSicherheit(
  prevState: SicherheitCalculationResult,
  formData: FormData
): Promise<SicherheitCalculationResult> {
  const scope = Number(formData.get('scopeDays')) || 15;
  const cameras = Number(formData.get('cameras')) || 0;

  // Base daily rate logic
  const dailyRate = 150;
  const cameraPrice = 450;

  const baseEstimate = scope * dailyRate;
  const cameraEstimate = cameras * cameraPrice;
  const total = baseEstimate + cameraEstimate;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate: total,
    breakdown: [
      { name: 'Planung & Umsetzung', value: baseEstimate },
      { name: 'Kameratechnik', value: cameraEstimate }
    ],
    tier: total > 5000 ? 'PREMIUM' : 'STANDARD'
  };
}
