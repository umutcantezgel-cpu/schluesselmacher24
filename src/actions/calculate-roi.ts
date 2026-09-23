'use server';

import type { RoiCalculationResult } from '@/types/roi-budget';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const users = Number(formData.get('users')) || 50;
  const doors = Number(formData.get('doors')) || 20;

  // Simple arbitrary calculation for demo
  const totalEstimate = doors * 150 + users * 25;
  const timeSaved = users * 1.5;
  const roiFactor = ((timeSaved * 50) / totalEstimate) * 100;

  return {
    totalEstimate,
    timeSaved,
    roiFactor,
    breakdown: [
      { label: 'Zylinder & Hardware', value: doors * 150 },
      { label: 'Schlüssel & Rechte', value: users * 25 },
    ],
  };
}
