'use server';

export type EnterpriseRoiState = {
  doors: number;
  employees: number;
  turnoverRate: number;
  maintenanceCostPerDoor: number;
  estimatedMechanicalCost: number;
  estimatedMechatronicCost: number;
  roiYears: number;
  annualSavings: number;
};

export async function calculateEnterpriseRoi(
  prevState: EnterpriseRoiState,
  formData: FormData
): Promise<EnterpriseRoiState> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors') || 50);
  const employees = Number(formData.get('employees') || 100);
  const turnoverRate = Number(formData.get('turnoverRate') || 10);
  const maintenanceCostPerDoor = Number(formData.get('maintenanceCostPerDoor') || 45);

  const estimatedMechanicalCost = doors * 120 + employees * 35;
  const estimatedMechatronicCost = doors * 350 + employees * 20;

  const annualMechCost = doors * maintenanceCostPerDoor + (employees * (turnoverRate / 100)) * 250;
  const annualMechatronicCost = doors * (maintenanceCostPerDoor * 0.5) + (employees * (turnoverRate / 100)) * 10;

  const annualSavings = annualMechCost - annualMechatronicCost;
  const roiYears = annualSavings > 0 ? (estimatedMechatronicCost - estimatedMechanicalCost) / annualSavings : 99;

  return {
    doors,
    employees,
    turnoverRate,
    maintenanceCostPerDoor,
    estimatedMechanicalCost,
    estimatedMechatronicCost,
    roiYears: Math.max(0, roiYears),
    annualSavings: Math.max(0, annualSavings),
  };
}
