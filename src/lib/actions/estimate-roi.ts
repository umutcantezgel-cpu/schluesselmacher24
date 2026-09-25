'use server';

export type RoiResult = {
  savings: number;
  roiYears: number;
};

export async function calculateRoi(state: RoiResult, formData: FormData): Promise<RoiResult> {

  const employees = Number(formData.get('employees')) || 20;
  const turnoverRate = Number(formData.get('turnoverRate')) || 5;

  const costPerLostKey = 1500;
  const annualLostKeys = Math.max(1, (employees * (turnoverRate / 100)) * 0.1);
  const annualSavings = annualLostKeys * costPerLostKey;

  return {
    savings: annualSavings,
    roiYears: Math.max(0.5, 10000 / annualSavings)
  };
}
