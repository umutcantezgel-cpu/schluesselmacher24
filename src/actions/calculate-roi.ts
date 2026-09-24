'use server';

import type { RoiCalculationResult } from '@/types/roi-budget';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<RoiCalculationResult> {
  const doors = Number(formData.get('doors')) || 50;
  const employees = Number(formData.get('employees')) || 100;
  const keyLossRate = Number(formData.get('keyLossRate')) || 5;

  // Mock calculation logic
  const costPerDoor = 120;
  const costPerEmployee = 15;
  const totalInvestment = doors * costPerDoor + employees * costPerEmployee;

  // Assume savings from not having to replace locks due to lost keys
  const costOfLostKeyIncident = 300; // e.g. rekeying a few doors
  const annualSavings = (employees * (keyLossRate / 100)) * costOfLostKeyIncident;

  const paybackMonths = annualSavings > 0 ? (totalInvestment / annualSavings) * 12 : 0;
  const roiPercentage = totalInvestment > 0 ? ((annualSavings * 3) - totalInvestment) / totalInvestment * 100 : 0;

  return {
    roiPercentage,
    paybackMonths,
    annualSavings,
    totalInvestment
  };
}
