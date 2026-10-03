'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-roi';

export type RoiCalculationResult = {
  totalSavings: number;
  amortizationMonths: number;
  efficiencyGain: number;
};

const initialState: RoiCalculationResult = {
  totalSavings: 0,
  amortizationMonths: 0,
  efficiencyGain: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: RoiCalculationResult) => update
  );

  function handleInputChange(employees: number, accessPoints: number) {
    startTransition(() => {
      // Very rough calculation for optimistic update
      const savings = employees * 50 + accessPoints * 200;
      setOptimisticState({
        totalSavings: savings,
        amortizationMonths: Math.max(12, 48 - Math.floor(savings / 1000)),
        efficiencyGain: Math.min(85, 10 + (employees / 10))
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie die Rentabilität und Effizienzsteigerung eines modernen elektronischen Schließsystems für Ihr Unternehmen.</p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Mitarbeiteranzahl</span>
            </label>
            <input
              type="range"
              name="employees"
              min="10"
              max="1000"
              step="10"
              defaultValue="100"
              onChange={(e) => {
                const employees = Number(e.target.value);
                const accessPoints = Number((document.querySelector('input[name="accessPoints"]') as HTMLInputElement)?.value || 20);
                handleInputChange(employees, accessPoints);
              }}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div className="space-y-4">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Zutrittspunkte (Türen)</span>
            </label>
            <input
              type="range"
              name="accessPoints"
              min="5"
              max="200"
              step="5"
              defaultValue="20"
              onChange={(e) => {
                const accessPoints = Number(e.target.value);
                const employees = Number((document.querySelector('input[name="employees"]') as HTMLInputElement)?.value || 100);
                handleInputChange(employees, accessPoints);
              }}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Ersparnis pro Jahr</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalSavings.toLocaleString('de-DE')} €
            </span>
          </div>

          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Amortisation in</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.amortizationMonths} Mon.
            </span>
          </div>

          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <span className="block text-xs font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Effizienzgewinn</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
              +{optimisticState.efficiencyGain}%
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Wird berechnet...' : 'Detaillierte ROI-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
