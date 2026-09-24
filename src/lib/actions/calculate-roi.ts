'use server';

export async function calculateRoi(prevState: unknown, formData: FormData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors') || 50);
  const employees = Number(formData.get('employees') || 100);

  return {
    roiEstimate: doors * 120 + employees * 45,
    paybackMonths: Math.max(6, 36 - (doors * 0.1)),
    maintenanceSavings: doors * 85,
    doors,
    employees
  };
}
