'use server';

export type ROICalculationResult = {
  estimatedCost: number;
  setupTime: string;
  roiMonths: number;
};

export async function calculateEnterpriseROI(
  prevState: ROICalculationResult,
  formData: FormData
): Promise<ROICalculationResult> {
  const doors = Number(formData.get('doors')) || 10;

  // Simulation einer Berechnung (Server Action)
  // Kosten: Grundpreis + (Türen * Preis pro Zylinder)
  const estimatedCost = 500 + doors * 120;

  // Setup-Zeit in Tagen
  const setupDays = Math.max(1, Math.ceil(doors / 5));
  const setupTime = `${setupDays} ${setupDays === 1 ? 'Tag' : 'Tage'}`;

  // ROI in Monaten (vereinfachtes Modell basierend auf Verwaltungsersparnis)
  // Je mehr Türen, desto schneller der ROI
  const roiMonths = Math.max(6, Math.floor(48 - doors / 2));

  // Kuenstliches Delay fuer UI-Feedback
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    estimatedCost,
    setupTime,
    roiMonths,
  };
}
