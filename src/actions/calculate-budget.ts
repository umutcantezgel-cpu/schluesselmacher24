'use server';

type Tier = 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';

interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: Tier;
}

export async function calculateServiceBudget(
  prevState: BudgetCalculationResult,
  formData: FormData
): Promise<BudgetCalculationResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const scopePoints = Number(formData.get('scopePoints') || 15);
  const tier = (formData.get('tier') as Tier) || 'STANDARD';

  let basePerPoint = 250;
  let setupFee = 850;

  if (tier === 'PROFESSIONAL') {
    basePerPoint = 380;
    setupFee = 1450;
  } else if (tier === 'ENTERPRISE') {
    basePerPoint = 650;
    setupFee = 2800;
  }

  const hardwareAndLabor = scopePoints * basePerPoint;
  const total = setupFee + hardwareAndLabor;

  return {
    totalEstimate: total,
    breakdown: [
      `Grundinbetriebnahme & Projektierung (${tier}): ${setupFee.toLocaleString('de-DE')} €`,
      `Hardware & Montage (${scopePoints} Punkte á ${basePerPoint} €): ${hardwareAndLabor.toLocaleString('de-DE')} €`,
      'Systemeinweisung und Übergabeprotokoll inklusiv'
    ],
    tier
  };
}
