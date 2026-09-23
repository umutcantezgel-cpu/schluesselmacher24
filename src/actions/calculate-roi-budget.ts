'use server';
import type { RoiBudgetCalculationResult } from '@/types/roi-budget';
export async function calculateRoiBudget(
  prevState: RoiBudgetCalculationResult,
  formData: FormData
): Promise<RoiBudgetCalculationResult> {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const costPerDay = 150;
  const totalEstimate = scopeDays * costPerDay;
  const roiTimeMonths = Math.max(1, Math.round(12 - (scopeDays / 5)));
  return {
    totalEstimate,
    breakdown: [{ category: 'Systemkomponenten', amount: totalEstimate * 0.6 }, { category: 'Installation', amount: totalEstimate * 0.4 }],
    tier: totalEstimate > 5000 ? 'ENTERPRISE' : totalEstimate > 2000 ? 'PREMIUM' : 'STANDARD',
    roiTimeMonths
  };
}
