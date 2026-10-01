'use server';

export async function calculateRoi(prevState: unknown, formData: FormData) {
  const investment = Number(formData.get('investment') || 0);
  const timeframe = Number(formData.get('timeframe') || 1);

  // Fake calculation
  const roi = investment * 1.5 * timeframe;
  const breakEvenMonths = Math.max(1, Math.round(12 / (roi / investment)));

  return {
    roi,
    breakEvenMonths,
    timestamp: Date.now()
  };
}
