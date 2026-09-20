'use server';

export type EnterpriseROICalculatorResult = {
  totalEstimate: number;
  timeSavingsEstimate: number; // in hours per year
  breakdown: { label: string; cost: number }[];
  tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE';
};

export async function estimateCost42(
  prevState: EnterpriseROICalculatorResult,
  formData: FormData
): Promise<EnterpriseROICalculatorResult> {
  // Extract inputs from formData
  const doors = Number(formData.get('doors')) || 10;
  const users = Number(formData.get('users')) || 20;
  const systemType = formData.get('systemType') as 'HS' | 'GHS' | 'Z' | 'GS' || 'HS';

  // Base costs
  let costPerDoor = 0;
  let costPerUser = 0;

  switch (systemType) {
    case 'GS':
      costPerDoor = 65;
      costPerUser = 15;
      break;
    case 'Z':
      costPerDoor = 110;
      costPerUser = 25;
      break;
    case 'HS':
      costPerDoor = 160;
      costPerUser = 45;
      break;
    case 'GHS':
      costPerDoor = 220;
      costPerUser = 65;
      break;
  }

  const doorCosts = doors * costPerDoor;
  const userCosts = users * costPerUser;
  const planningBase = systemType === 'GHS' ? 350 : systemType === 'HS' ? 180 : 80;

  const totalEstimate = doorCosts + userCosts + planningBase;

  // Calculate potential time savings (rough estimate of admin hours saved per year compared to mechanical handling without proper system)
  const timeSavingsEstimate = users * 1.5 + (systemType === 'GHS' ? 24 : systemType === 'HS' ? 12 : 0);

  let tier: 'BASIC' | 'STANDARD' | 'ENTERPRISE' = 'BASIC';
  if (totalEstimate > 10000) {
    tier = 'ENTERPRISE';
  } else if (totalEstimate > 3500) {
    tier = 'STANDARD';
  }

  // Simulate network delay for realistic useActionState behavior
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    totalEstimate,
    timeSavingsEstimate,
    breakdown: [
      { label: `Zylinder & Schlösser (${doors} Schließstellen)`, cost: doorCosts },
      { label: `Schlüssel & Berechtigungen (${users} Nutzer)`, cost: userCosts },
      { label: 'Schließplan-Entwurf & Projektierung', cost: planningBase },
    ],
    tier,
  };
}
