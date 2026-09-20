'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-roi';

export type RoiCalculationResult = {
  savingsPerYear: number;
  estimatedSetupCost: number;
  breakEvenMonths: number;
  tier: 'STANDARD' | 'ENTERPRISE';
};

const initialState: RoiCalculationResult = {
  savingsPerYear: 0,
  estimatedSetupCost: 0,
  breakEvenMonths: 0,
  tier: 'STANDARD',
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic<RoiCalculationResult, Partial<RoiCalculationResult>>(
    state,
    (current, update) => ({ ...current, ...update })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;

    const lockingPoints = Number(form.lockingPoints.value);
    const userCount = Number(form.userCount.value);

    startTransition(() => {
      // Optimistic simple calculation
      const mechanicalCostPerYear = lockingPoints * 15 + userCount * 5;
      const electronicCostPerYear = lockingPoints * 5 + userCount * 2 + 150;
      const savingsPerYear = Math.max(0, mechanicalCostPerYear - electronicCostPerYear);
      const estimatedSetupCost = lockingPoints * 120;
      const breakEvenMonths = savingsPerYear > 0 ? Math.round((estimatedSetupCost / savingsPerYear) * 12) : 0;

      setOptimisticState({
        savingsPerYear,
        estimatedSetupCost,
        breakEvenMonths,
        tier: lockingPoints > 50 ? 'ENTERPRISE' : 'STANDARD',
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] view-transition-roi-calculator">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Enterprise ROI & Ladezeit Kalkulator
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial und die Amortisationszeit (Break-Even) beim Umstieg auf moderne Schließanlagen-Verwaltung.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Schließstellen (Türen)</span>
              <span className="text-[oklch(0.16_0.02_260)] font-bold">{optimisticState.estimatedSetupCost > 0 ? (optimisticState.estimatedSetupCost / 120).toFixed(0) : '10'}</span>
            </label>
            <input
              type="range"
              name="lockingPoints"
              min="5"
              max="200"
              defaultValue="10"
              onChange={handleInputChange}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Nutzer (Schlüssel)</span>
              <span className="text-[oklch(0.16_0.02_260)] font-bold">{optimisticState.estimatedSetupCost > 0 ? ((optimisticState.estimatedSetupCost / 120) * 1.5).toFixed(0) : '10'}</span>
            </label>
            <input
              type="range"
              name="userCount"
              min="5"
              max="500"
              defaultValue="10"
              onChange={handleInputChange}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 sm:grid-cols-3">
          <div className="flex flex-col border-b border-[oklch(0.89_0.008_260/0.55)] pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Initiale Kosten
            </span>
            <span className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSetupCost.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="flex flex-col border-b border-[oklch(0.89_0.008_260/0.55)] pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:px-4">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Ersparnis / Jahr
            </span>
            <span className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
              {optimisticState.savingsPerYear.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="flex flex-col pt-4 sm:pt-0 sm:pl-4">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Amortisation
            </span>
            <span className="mt-1 text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.breakEvenMonths > 0 ? `${optimisticState.breakEvenMonths} Monate` : 'N/A'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne Detaillierte Analyse...' : 'Detaillierten ROI-Report anfordern'}
        </button>
      </form>
    </div>
  );
}
