'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-roi';
import type { ROIResult } from '@/lib/actions/calculate-roi';

const initialState: ROIResult = {
  estimatedCost: 0,
  timeSavedHours: 0,
  maintenanceSavings: 0,
  tier: 'STANDARD',
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  // Optimistic updates for ranges
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );
  const [optimisticSavings, setOptimisticSavings] = useOptimistic(
    state.maintenanceSavings,
    (current, update: number) => update
  );

  function handleScopeChange(days: number, cylinders: number) {
    startTransition(() => {
      // rough optimistic calculation
      setOptimisticCost(cylinders * 120 + days * 150);
      setOptimisticSavings(cylinders * 25);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Kalkulator</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
        Berechnen Sie die voraussichtlichen Kosten und Einsparungen Ihrer Schließanlage.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid grid-rows-subgrid gap-6">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Projektumfang (Tage)</span>
            </label>
            <input
              type="range"
              name="scopeDays"
              min="5"
              max="60"
              defaultValue="15"
              onChange={(e) => {
                const days = Number(e.target.value);
                const cylinders = Number(document.querySelector<HTMLInputElement>('input[name="cylinderCount"]')?.value || 50);
                handleScopeChange(days, cylinders);
              }}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Anzahl Schließstellen (Zylinder)</span>
            </label>
            <input
              type="range"
              name="cylinderCount"
              min="10"
              max="500"
              defaultValue="50"
              onChange={(e) => {
                const cylinders = Number(e.target.value);
                const days = Number(document.querySelector<HTMLInputElement>('input[name="scopeDays"]')?.value || 15);
                handleScopeChange(days, cylinders);
              }}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
            <div className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticCost > 0 ? `${optimisticCost.toLocaleString('de-DE')} €` : '---'}
            </div>
          </div>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Wartungsersparnis / Jahr:</span>
            <div className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticSavings > 0 ? `${optimisticSavings.toLocaleString('de-DE')} €` : '---'}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere exakte Werte...' : 'Detaillierte ROI-Berechnung anfordern'}
        </button>
      </form>
    </div>
  );
}
