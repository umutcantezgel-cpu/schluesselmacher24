'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-roi';
import type { RoiCalculationResult } from '@/types/roi';

const initialState: RoiCalculationResult = {
  estimatedSavings: 0,
  paybackPeriodMonths: 0,
  productivityGain: 0,
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleEmployeesChange(value: number) {
    startTransition(() => {
      setOptimisticState({
        estimatedSavings: Math.round(value * (60000 * 0.05)),
        productivityGain: Math.round(value * 1.5),
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial und den ROI für Ihr Unternehmen.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Mitarbeiter</label>
          <input
            type="range"
            name="employees"
            min="10"
            max="1000"
            step="10"
            defaultValue="50"
            onChange={(e) => handleEmployeesChange(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Durchschnittsgehalt (€/Jahr)</label>
          <input
            type="number"
            name="averageSalary"
            defaultValue="60000"
            className="mt-2 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div>
            <span className="block text-xs text-[oklch(0.52_0.015_260)]">Geschätzte Einsparung/Jahr</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings.toLocaleString('de-DE')} €
            </span>
          </div>
          <div>
             <span className="block text-xs text-[oklch(0.52_0.015_260)]">Produktivitätsgewinn (Std)</span>
             <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticState.productivityGain.toLocaleString('de-DE')}
             </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierten ROI berechnen'}
        </button>
      </form>
    </div>
  );
}
