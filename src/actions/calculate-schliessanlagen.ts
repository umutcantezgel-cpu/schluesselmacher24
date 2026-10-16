'use server';

interface CalculationState {
  doors: number;
  users: number;
  systemType: 'gleichschliessend' | 'zentral' | 'hauptschluessel' | 'generalhauptschluessel';
  estimatedCost: number;
  securityLevel: 'standard' | 'hoch' | 'maximal';
}

export async function calculateSchliessanlagenAction(prevState: CalculationState, formData: FormData): Promise<CalculationState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const doors = Number(formData.get('doors'));
  const users = Number(formData.get('users'));
  const systemType = formData.get('systemType') as CalculationState['systemType'];
  const securityLevel = formData.get('securityLevel') as CalculationState['securityLevel'];

  let basePrice = 0;
  if (systemType === 'gleichschliessend') basePrice = 80;
  else if (systemType === 'zentral') basePrice = 150;
  else if (systemType === 'hauptschluessel') basePrice = 200;
  else if (systemType === 'generalhauptschluessel') basePrice = 350;

  let securityMultiplier = 1;
  if(securityLevel === 'hoch') securityMultiplier = 1.3;
  if(securityLevel === 'maximal') securityMultiplier = 1.8;

  const estimatedCost = Math.round((doors * basePrice * securityMultiplier) + (users * 25 * securityMultiplier));

  return { doors, users, systemType, estimatedCost, securityLevel };
}
