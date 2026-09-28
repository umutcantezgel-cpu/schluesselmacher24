'use server';

export type AuditCalculationResult = {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE';
};

export async function calculateSecurityAudit(
  prevState: AuditCalculationResult,
  formData: FormData
): Promise<AuditCalculationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const doors = Number(formData.get('doors') || '1');
  const windows = Number(formData.get('windows') || '0');
  const propertyType = formData.get('propertyType') as string;

  let baseRate = 250;
  if (propertyType === 'commercial') baseRate = 500;
  if (propertyType === 'industrial') baseRate = 800;

  const doorCost = doors * 150;
  const windowCost = windows * 80;
  const totalEstimate = baseRate + doorCost + windowCost;

  let tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE' = 'BASIC';
  if (totalEstimate > 1500) tier = 'ADVANCED';
  if (totalEstimate > 3000) tier = 'ENTERPRISE';

  return {
    totalEstimate,
    breakdown: [
      { label: 'Grundpauschale (nach Objekttyp)', amount: baseRate },
      { label: `Türen (${doors})`, amount: doorCost },
      { label: `Fenster/Zugänge (${windows})`, amount: windowCost }
    ],
    tier
  };
}
