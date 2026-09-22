'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-roi';
import type { RoiCalculationResult } from '@/lib/actions/calculate-roi';

const initialState: RoiCalculationResult = {
  totalSavings: 0,
  paybackPeriodMonths: 0,
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doorsCount = Number(formData.get('doorsCount')) || 50;
    const hourlyRate = Number(formData.get('hourlyRate')) || 65;
    const lostKeys = Number(formData.get('lostKeys')) || 5;

    const cylinderCost = doorsCount * 250;
    const keyReplacementCost = lostKeys * (cylinderCost * 0.1 + hourlyRate * 2);
    const adminTimeSavings = doorsCount * 0.5 * hourlyRate * 12;
    const totalSavings = adminTimeSavings + keyReplacementCost;
    const paybackPeriodMonths = Math.max(1, Math.round((cylinderCost / totalSavings) * 12));

    startTransition(() => {
      setOptimisticState({ totalSavings, paybackPeriodMonths });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid-rows-subgrid">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <form action={formAction} onChange={handleChange} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Anzahl der Türen / Schließzylinder</label>
          <input type="range" name="doorsCount" min="10" max="500" defaultValue="50" className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>
         <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Interner Stundensatz (Verwaltung) in €</label>
          <input type="range" name="hourlyRate" min="40" max="150" defaultValue="65" className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>
         <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Schlüsselverluste pro Jahr</label>
          <input type="range" name="lostKeys" min="0" max="50" defaultValue="5" className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
           <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">Jährliche Einsparung:</span>
              <span className="block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.totalSavings.toLocaleString('de-DE')} €
              </span>
           </div>
           <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">Amortisation in:</span>
              <span className="block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.paybackPeriodMonths} Monaten
              </span>
           </div>
        </div>
        <button type="submit" disabled={isPending} className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50">
          {isPending ? 'Berechne...' : 'Detaillierten ROI-Report anfordern'}
        </button>
      </form>
    </div>
  );
}
