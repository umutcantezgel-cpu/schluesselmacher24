import { z } from 'zod';

export const securityCheckSchema = z.object({
  doorType: z.enum(['WOHNUNG', 'HAUSTUER', 'GEWERBE']),
  lockType: z.enum(['EINFACH', 'MEHRFACH', 'ELEKTRONISCH']),
  urgency: z.enum(['STANDARD', 'HOCH']),
});

export type SecurityCheckInput = z.infer<typeof securityCheckSchema>;

export interface SecurityCheckResult {
  totalEstimate: number;
  breakdown: { label: string; value: number }[];
  tier: 'BASIC' | 'RECOMMENDED' | 'PREMIUM';
  message: string;
}

export async function calculateDoorSecurity(
  prevState: SecurityCheckResult,
  formData: FormData
): Promise<SecurityCheckResult> {
  // Simulate processing delay for optimistic UI updates
  await new Promise((resolve) => setTimeout(resolve, 600));

  const parsed = securityCheckSchema.safeParse({
    doorType: formData.get('doorType'),
    lockType: formData.get('lockType'),
    urgency: formData.get('urgency'),
  });

  if (!parsed.success) {
    return {
      ...prevState,
      message: 'Ungültige Eingabe',
    };
  }

  const { doorType, lockType, urgency } = parsed.data;

  let basePrice = 0;
  const breakdown: { label: string; value: number }[] = [];

  // 1. Tür-Basis
  if (doorType === 'WOHNUNG') {
    basePrice += 150;
    breakdown.push({ label: 'Wohnungseingangstür (Grundabsicherung)', value: 150 });
  } else if (doorType === 'HAUSTUER') {
    basePrice += 300;
    breakdown.push({ label: 'Hauseingangstür (Erhöhte Absicherung)', value: 300 });
  } else if (doorType === 'GEWERBE') {
    basePrice += 500;
    breakdown.push({ label: 'Gewerbeobjekt (Gewerbestandard)', value: 500 });
  }

  // 2. Schloss-Art
  if (lockType === 'EINFACH') {
    basePrice += 80;
    breakdown.push({ label: 'Einsteckschloss & Standard-Zylinder', value: 80 });
  } else if (lockType === 'MEHRFACH') {
    basePrice += 250;
    breakdown.push({ label: 'Mehrfachverriegelung (VdS anerkannt)', value: 250 });
  } else if (lockType === 'ELEKTRONISCH') {
    basePrice += 450;
    breakdown.push({ label: 'Elektronischer Zutrittsbeschlag', value: 450 });
  }

  // 3. Dringlichkeit
  if (urgency === 'HOCH') {
    const surcharge = Math.round(basePrice * 0.2);
    basePrice += surcharge;
    breakdown.push({ label: 'Priorisierte Bearbeitung (+20%)', value: surcharge });
  }

  let tier: SecurityCheckResult['tier'] = 'BASIC';
  if (basePrice > 600) tier = 'PREMIUM';
  else if (basePrice > 300) tier = 'RECOMMENDED';

  return {
    totalEstimate: basePrice,
    breakdown,
    tier,
    message: 'Erfolgreich berechnet.',
  };
}
