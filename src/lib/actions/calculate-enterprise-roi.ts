'use server';

export type EnterpriseRoiResult = {
  doors: number;
  keys: number;
  mechanicalCost: number;
  electronicCost: number;
  breakEvenMonths: number;
  yearlySavings: number;
};

export async function calculateEnterpriseRoi(
  prevState: EnterpriseRoiResult,
  formData: FormData,
): Promise<EnterpriseRoiResult> {
  // Simulate network delay for the server action
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors')) || prevState.doors || 50;
  const keys = Number(formData.get('keys')) || prevState.keys || 100;

  // Mechanische Anlage: Hohe Folgekosten bei Schlüsselverlust (Zylindertausch)
  const mechBasePrice = doors * 120 + keys * 35;
  const mechYearlyMaintenance = 500;
  // Angenommen: 2 verlorene Schlüssel pro Jahr erfordern den Austausch von 5 Zylindern
  const mechKeyLossCostPerYear = 2 * (5 * 120 + 15 * 35);

  // Elektronische Anlage: Höhere Investition, minimale Folgekosten
  const elecBasePrice = doors * 450 + keys * 15;
  const elecYearlyMaintenance = 800; // Software + Batterien
  // Verlorene Transponder einfach löschen, nur Ersatzteilkosten
  const elecKeyLossCostPerYear = 2 * 15;

  const mechanicalCost = mechBasePrice;
  const electronicCost = elecBasePrice;

  const yearlySavings =
    (mechYearlyMaintenance + mechKeyLossCostPerYear) -
    (elecYearlyMaintenance + elecKeyLossCostPerYear);

  const breakEvenMonths = yearlySavings > 0
    ? Math.max(0, Math.ceil(((electronicCost - mechanicalCost) / yearlySavings) * 12))
    : 999;

  return {
    doors,
    keys,
    mechanicalCost,
    electronicCost,
    breakEvenMonths,
    yearlySavings,
  };
}
