'use server';

import type { RoiCalculationResult } from '@/types/roi-budget';

export async function calculateEnterpriseRoi(
  prevState: unknown,
  formData: FormData
): Promise<RoiCalculationResult> {
  // Artificial delay to simulate complex calculation
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors')) || 10;
  const employees = Number(formData.get('employees')) || 20;
  const systemType = String(formData.get('systemType')) || 'mechanical';

  // Base costs
  let costPerDoor = 0;
  let costPerKey = 0;
  let maintenancePerYear = 0;
  let lifespan = 10;

  if (systemType === 'electronic') {
    costPerDoor = 450;
    costPerKey = 15; // transponder
    maintenancePerYear = doors * 20; // battery changes, software updates
    lifespan = 12;
  } else if (systemType === 'mechatronic') {
    costPerDoor = 650;
    costPerKey = 45;
    maintenancePerYear = doors * 25;
    lifespan = 15;
  } else {
    // mechanical
    costPerDoor = 120;
    costPerKey = 35;
    maintenancePerYear = 0; // nearly zero
    lifespan = 20;
  }

  // Calculate upfront cost
  const upfrontCost = (doors * costPerDoor) + (employees * 1.2 * costPerKey); // 20% spare keys

  // Calculate key loss cost over lifespan (assume 5% loss per year)
  let keyLossCostPerYear = 0;
  if (systemType === 'electronic') {
    // Just replace transponder, maybe a small admin fee
    keyLossCostPerYear = (employees * 0.05) * (costPerKey + 10);
  } else if (systemType === 'mechatronic') {
    // Replace mechatronic key, block in system
    keyLossCostPerYear = (employees * 0.05) * (costPerKey + 25);
  } else {
    // Mechanical: high risk, might need cylinder replacements
    // Simplified: each lost key costs 300€ in cylinder replacements on average
    keyLossCostPerYear = (employees * 0.05) * 300;
  }

  const totalCostOfOwnership = upfrontCost + ((maintenancePerYear + keyLossCostPerYear) * lifespan);

  // Compare to a baseline (e.g., poorly managed mechanical system)
  const baselineUpfront = (doors * 100) + (employees * 1.5 * 25);
  const baselineLossPerYear = (employees * 0.10) * 400; // Higher loss rate and cost
  const baselineTco = baselineUpfront + (baselineLossPerYear * lifespan);

  const savings = Math.max(0, baselineTco - totalCostOfOwnership);
  const roiYears = savings > 0 ? (upfrontCost / (baselineLossPerYear - keyLossCostPerYear - maintenancePerYear)) : 0;

  const actualRoiYears = (roiYears > 0 && roiYears < lifespan) ? roiYears : 0;

  return {
    upfrontCost: Math.round(upfrontCost),
    annualMaintenance: Math.round(maintenancePerYear),
    estimatedSavings10Years: Math.round(savings * (10 / lifespan)), // Normalize savings to 10 years
    amortizationYears: Number(actualRoiYears.toFixed(1)),
    tier: systemType.toUpperCase() as 'MECHANICAL' | 'ELECTRONIC' | 'MECHATRONIC',
  };
}
