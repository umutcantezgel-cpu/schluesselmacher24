'use server';

type State = {
  optimizedTotal: number;
  savings: number;
  status: 'IDLE' | 'OPTIMIZED' | 'ERROR';
};

export async function optimizeWarenkorb(prevState: State, formData: FormData): Promise<State> {
  // Simulierte Server-Verzögerung für realistische Interaktion
  await new Promise((resolve) => setTimeout(resolve, 800));

  const currentTotal = Number(formData.get('currentTotal')) || 0;

  if (currentTotal <= 0) {
      return { ...prevState, status: 'ERROR' };
  }

  // 15% Rabatt-Simulation für Enterprise-Kunden auf den Gesamtwert
  const savings = currentTotal * 0.15;
  const optimizedTotal = currentTotal - savings;

  return {
    optimizedTotal,
    savings,
    status: 'OPTIMIZED',
  };
}
