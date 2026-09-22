'use server';

type RoiState = {
  doors: number;
  users: number;
  mechanicalCost: number;
  electronicCost: number;
  timeSavingsPerYear: number;
  roiMonths: number;
  calculatedAt: number;
};

export async function calculateEnterpriseRoi(prevState: RoiState, formData: FormData): Promise<RoiState> {
  const doors = Number(formData.get('doors') || 10);
  const users = Number(formData.get('users') || 20);

  const mechanicalCost = (doors * 150) + (users * 25);
  const electronicCost = (doors * 450) + (users * 10);
  const timeSavingsPerYear = users * 0.5 * 50; // 0.5h per user * 50 EUR

  const roiMonths = Math.round(((electronicCost - mechanicalCost) / (timeSavingsPerYear / 12)) * 10) / 10;

  return {
    doors,
    users,
    mechanicalCost,
    electronicCost,
    timeSavingsPerYear,
    roiMonths: isFinite(roiMonths) && roiMonths > 0 ? roiMonths : 0,
    calculatedAt: Date.now()
  };
}
