'use server';

export async function estimateRoiAction(
  prevState: unknown,
  formData: FormData
) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const cylinders = Number(formData.get('cylinders')) || 50;
  const turnover = Number(formData.get('turnover')) || 5;

  const estimatedSavings = cylinders * 45 + turnover * 200;
  const maintenanceReduction = cylinders * 15;
  const breakEvenMonths = Math.max(12, 60 - turnover * 2);

  return {
    estimatedSavings,
    breakEvenMonths,
    maintenanceReduction,
  };
}
