'use server';

import type { ProvisionCalculationResult } from '@/types/provision';

export async function calculateProvision(
  prevState: ProvisionCalculationResult,
  formData: FormData
): Promise<ProvisionCalculationResult> {
  const auftraegeProMonat = Number(formData.get('auftraegeProMonat') || 10);
  const durchschnittlicherAuftragswert = Number(formData.get('durchschnittlicherAuftragswert') || 150);

  const umsatz = auftraegeProMonat * durchschnittlicherAuftragswert;

  // Staffelprovision:
  // bis 2.000 € -> 15%
  // 2.000 - 5.000 € -> 12%
  // ab 5.000 € -> 10%

  let provisionProzent = 15;
  if (umsatz > 5000) {
    provisionProzent = 10;
  } else if (umsatz > 2000) {
    provisionProzent = 12;
  }

  const provisionBetrag = (umsatz * provisionProzent) / 100;
  const nettoGewinn = umsatz - provisionBetrag;

  // Simulate network delay for realistic loading state
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    auftraegeProMonat,
    durchschnittlicherAuftragswert,
    umsatz,
    provisionProzent,
    provisionBetrag,
    nettoGewinn,
  };
}
