'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/estimate-roi';
import type { ROIResult } from '@/lib/actions/estimate-roi';

const initialState: ROIResult = {
  estimatedSavings: 0,
  paybackPeriodMonths: 0,
  efficiencyGainPercentage: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic<ROIResult, Partial<ROIResult>>(
    state,
    (currentState, optimisticValue) => ({ ...currentState, ...optimisticValue })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    const name = e.target.name;

    // Simulate optimistic calculation
    startTransition(() => {
      let savings = optimisticState.estimatedSavings;
      if (name === 'employees') {
        savings = value * 120;
      }
      setOptimisticState({
        estimatedSavings: savings,
        efficiencyGainPercentage: 70
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Enterprise ROI Kalkulator</h3>

      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
            Anzahl der Mitarbeiter
          </label>
          <input
            type="range"
            name="employees"
            min="10"
            max="500"
            defaultValue="50"
            onChange={handleInputChange}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>10</span>
            <span>500+</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
            Verwaltungsaufwand (Stunden/Woche)
          </label>
          <input
            type="number"
            name="adminHoursPerWeek"
            defaultValue="10"
            className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Ersparnis/Jahr</span>
            <span className="block text-2xl font-bold text-[oklch(0.16_0.02_260)] mt-1">
              {optimisticState.estimatedSavings > 0 ? `${optimisticState.estimatedSavings.toLocaleString('de-DE')} €` : '-'}
            </span>
          </div>
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Effizienzsteigerung</span>
            <span className="block text-2xl font-bold text-[oklch(0.52_0.24_260)] mt-1">
              {optimisticState.efficiencyGainPercentage > 0 ? `+${optimisticState.efficiencyGainPercentage}%` : '-'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne ROI...' : 'Detaillierten ROI berechnen'}
        </button>
      </form>
    </div>
  );
}
