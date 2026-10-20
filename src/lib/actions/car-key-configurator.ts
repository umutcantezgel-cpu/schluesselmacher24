'use server';

export type CarKeyCalculationResult = {
  estimatedCost: number;
  durationMins: number;
  feasibility: 'HIGH' | 'MEDIUM' | 'LOW';
  breakdown: string[];
};

export async function calculateCarKeyAction(prevState: CarKeyCalculationResult, formData: FormData): Promise<CarKeyCalculationResult> {
  const serviceType = formData.get('serviceType') as string;
  const hasOriginalKey = formData.get('hasOriginalKey') === 'yes';
  const vehicleType = formData.get('vehicleType') as string;

  let estimatedCost = 0;
  let durationMins = 0;
  let feasibility: 'HIGH' | 'MEDIUM' | 'LOW' = 'HIGH';
  const breakdown: string[] = [];

  // Base logic based on user input
  if (serviceType === 'copy') {
    estimatedCost += 80;
    durationMins += 30;
    breakdown.push('Schlüsselkopie Basispreis');
    if (!hasOriginalKey) {
        estimatedCost += 120;
        durationMins += 60;
        feasibility = 'MEDIUM';
        breakdown.push('Zuschlag für fehlenden Originalschlüssel (Code-Ermittlung)');
    }
  } else if (serviceType === 'program') {
    estimatedCost += 60;
    durationMins += 20;
    breakdown.push('Programmierung Transponder/Wegfahrsperre');
  } else if (serviceType === 'repair') {
    estimatedCost += 40;
    durationMins += 15;
    breakdown.push('Reparatur/Gehäusewechsel');
  }

  if (vehicleType === 'premium') {
      estimatedCost += 50;
      breakdown.push('Premium-Fahrzeug Zuschlag');
  } else if (vehicleType === 'exotic') {
      estimatedCost += 150;
      feasibility = 'LOW';
      breakdown.push('Exotisches Fahrzeug (Sonderaufwand/Spezialwerkzeug)');
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    estimatedCost,
    durationMins,
    feasibility,
    breakdown,
  };
}
