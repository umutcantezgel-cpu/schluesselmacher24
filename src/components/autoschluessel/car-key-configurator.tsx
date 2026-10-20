'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateCarKeyAction, type CarKeyCalculationResult } from '@/lib/actions/car-key-configurator';

const initialState: CarKeyCalculationResult = {
  estimatedCost: 0,
  durationMins: 0,
  feasibility: 'HIGH',
  breakdown: [],
};

export function CarKeyConfigurator() {
  const [state, formAction, isPending] = useActionState(calculateCarKeyAction, initialState);
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );

  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
      const formData = new FormData(e.currentTarget);
      const serviceType = formData.get('serviceType') as string;
      const hasOriginalKey = formData.get('hasOriginalKey') === 'yes';
      const vehicleType = formData.get('vehicleType') as string;

      let est = 0;
      if (serviceType === 'copy') est += 80;
      else if (serviceType === 'program') est += 60;
      else if (serviceType === 'repair') est += 40;

      if (serviceType === 'copy' && !hasOriginalKey) est += 120;
      if (vehicleType === 'premium') est += 50;
      if (vehicleType === 'exotic') est += 150;

      startTransition(() => {
          setOptimisticCost(est);
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12" style={{ viewTransitionName: 'car-key-config' }}>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Interaktiver Kalkulator: Autoschlüssel Kosten & Machbarkeit</h3>

      <form action={formAction} onChange={handleFormChange} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Leistungsart</label>
                <select name="serviceType" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
                    <option value="copy">Schlüssel nachmachen/kopieren</option>
                    <option value="program">Nur Programmieren (Transponder)</option>
                    <option value="repair">Gehäuse/Mechanik Reparatur</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Originalschlüssel vorhanden?</label>
                <select name="hasOriginalKey" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
                    <option value="yes">Ja, funktionsfähiger Schlüssel liegt vor</option>
                    <option value="no">Nein, alle Schlüssel verloren/defekt</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Fahrzeugklasse</label>
                <select name="vehicleType" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
                    <option value="standard">Standard (VW, Ford, Opel...)</option>
                    <option value="premium">Premium (Audi, BMW, Mercedes...)</option>
                    <option value="exotic">Exot/Sportwagen/Oldtimer</option>
                </select>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-6">
            <div className="w-full md:w-auto flex-1">
                <div className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Unverbindlicher Richtwert:</div>
                <div className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    ab {optimisticCost.toLocaleString('de-DE')} €
                </div>
                {state.durationMins > 0 && !isPending && (
                    <div className="text-sm text-[oklch(0.32_0.02_260)] mt-2">
                        Geschätzte Dauer: ca. {state.durationMins} Min.
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto min-w-[200px] rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
            >
                {isPending ? 'Berechne...' : 'Detailanalyse anfordern'}
            </button>
        </div>

        {state.breakdown.length > 0 && !isPending && (
            <div className="mt-6 rounded-lg bg-white/50 p-4 border border-[oklch(0.89_0.008_260/0.3)]">
                <h4 className="text-sm font-medium text-[oklch(0.16_0.02_260)] mb-2">Preisstruktur:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-[oklch(0.32_0.02_260)]">
                    {state.breakdown.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-semibold text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Machbarkeit:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                        state.feasibility === 'HIGH' ? 'bg-green-100 text-green-800' :
                        state.feasibility === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {state.feasibility === 'HIGH' ? 'SEHR GUT' :
                         state.feasibility === 'MEDIUM' ? 'MÖGLICH (AUFWAND)' :
                         'INDIVIDUELLE PRÜFUNG'}
                    </span>
                </div>
            </div>
        )}
      </form>
    </div>
  );
}
