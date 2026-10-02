'use server';

import type { ROIResult } from '@/types/roi';

export async function calculateEnterpriseROI(prevState: ROIResult, formData: FormData): Promise<ROIResult> {
  const securityLevel = formData.get('securityLevel')?.toString() || 'STANDARD';
  const siteArea = Number(formData.get('siteArea') || 100);
  const incidentFrequency = Number(formData.get('incidentFrequency') || 1);

  // Simulation der Berechnung
  await new Promise(resolve => setTimeout(resolve, 500));

  let baseCost = siteArea * 15; // €15 pro m²
  const riskCost = incidentFrequency * 5000; // €5000 pro Vorfall
  let savings = 0;

  if (securityLevel === 'HIGH') {
    baseCost *= 1.5;
    savings = riskCost * 0.8;
  } else if (securityLevel === 'PREMIUM') {
    baseCost *= 2.5;
    savings = riskCost * 0.95;
  } else {
    savings = riskCost * 0.4;
  }

  const netBenefit = savings - baseCost;

  return {
    investment: baseCost,
    annualSavings: savings,
    netBenefit: netBenefit,
    paybackMonths: baseCost / (savings / 12),
    tier: securityLevel as 'STANDARD' | 'HIGH' | 'PREMIUM'
  };
}
