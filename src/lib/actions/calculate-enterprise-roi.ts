'use server';

export type EnterpriseROICalculationResult = {
  estimatedCost: number;
  estimatedSavings: number;
  roiMonths: number;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  maintenanceCostPerYear: number;
};

export async function calculateEnterpriseROI(
  _prevState: EnterpriseROICalculationResult,
  formData: FormData
): Promise<EnterpriseROICalculationResult> {
  // Simulate network delay for real-world feel
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors')) || 10;
  const employees = Number(formData.get('employees')) || 20;
  const lostKeysPerYear = Number(formData.get('lostKeys')) || 2;
  const isElectronic = formData.get('systemType') === 'electronic';

  // Constants
  const COST_PER_MECHANICAL_CYLINDER = 120;
  const COST_PER_ELECTRONIC_CYLINDER = 450;
  const COST_PER_MECHANICAL_KEY = 35;
  const COST_PER_TRANSPONDER = 25;
  const COST_CYLINDER_REPLACEMENT_LOST_KEY = 600; // Average cost to replace cylinders when a master key is lost

  // Base Installation Cost
  let cylinderCost = 0;
  let keyCost = 0;

  if (isElectronic) {
    cylinderCost = doors * COST_PER_ELECTRONIC_CYLINDER;
    keyCost = employees * COST_PER_TRANSPONDER;
  } else {
    cylinderCost = doors * COST_PER_MECHANICAL_CYLINDER;
    keyCost = employees * COST_PER_MECHANICAL_KEY;
  }

  const baseCost = cylinderCost + keyCost;

  // Additional Setup/Planning Costs
  const planningCost = doors * 20 + 200;
  const totalCost = baseCost + planningCost;

  // Maintenance & Operational Costs over a year
  let maintenanceCostPerYear = 0;
  let estimatedSavings = 0; // Relative to mechanical baseline if electronic is chosen

  if (isElectronic) {
    maintenanceCostPerYear = 150 + doors * 10; // Software + batteries
    // Savings: No cylinder replacements on lost keys
    estimatedSavings = lostKeysPerYear * COST_CYLINDER_REPLACEMENT_LOST_KEY;
  } else {
    maintenanceCostPerYear = 50 + doors * 5; // Basic lubrication
  }

  // Calculate ROI months (only applicable if Electronic, showing time to recoup vs mechanical losses)
  let roiMonths = 0;
  if (isElectronic && estimatedSavings > 0) {
    const extraCostVsMechanical = totalCost - (doors * COST_PER_MECHANICAL_CYLINDER + employees * COST_PER_MECHANICAL_KEY + planningCost);
    if (extraCostVsMechanical > 0) {
      // savings per month
      const savingsPerMonth = estimatedSavings / 12;
      roiMonths = Math.ceil(extraCostVsMechanical / savingsPerMonth);
    }
  }

  let tier: 'BASIC' | 'PRO' | 'ENTERPRISE' = 'BASIC';
  if (doors > 50 || employees > 100) tier = 'ENTERPRISE';
  else if (doors > 20 || employees > 40) tier = 'PRO';

  return {
    estimatedCost: totalCost,
    estimatedSavings,
    roiMonths,
    tier,
    maintenanceCostPerYear,
  };
}
