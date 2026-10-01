'use server';

import type { ROICalculationResult } from '@/components/calculator/enterprise-roi-calculator';

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const employees = Number(formData.get('employees') || 50);
  const incidents = Number(formData.get('incidents') || 5);
  const securityLevel = formData.get('securityLevel') as string;

  let baseCostPerIncident = 2500;
  if (securityLevel === 'HIGH') baseCostPerIncident = 5000;
  if (securityLevel === 'MAXIMUM') baseCostPerIncident = 10000;

  const currentLoss = incidents * baseCostPerIncident;
  const preventionRate = 0.85; // 85% reduction in incidents
  const savings = currentLoss * preventionRate;

  // Base investment logic
  const investment = employees * 120 + 5000;
  const roiMonths = savings > 0 ? investment / (savings / 12) : 0;

  return {
    savings: Math.round(savings),
    investment: Math.round(investment),
    roiMonths: Math.round(roiMonths * 10) / 10,
    status: 'SUCCESS'
  };
}
