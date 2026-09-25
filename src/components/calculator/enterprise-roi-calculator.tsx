'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/actions/calculate-roi';

const initialState: ROICalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic<number, number>(
    state.totalEstimate,
    (current, update) => update
  );

  function handleScopeChange(doors: number, users: number) {
    startTransition(() => {
      const baseCost = 2500;
      setOptimisticTotal(baseCost + doors * 150 + users * 45);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI-Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Schließstellen</label>
          <input
            type="range"
            name="doors"
            min="10"
            max="500"
            defaultValue="50"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                handleScopeChange(Number(e.target.value), Number((form.elements.namedItem('users') as HTMLInputElement).value));
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Nutzer</label>
          <input
            type="range"
            name="users"
            min="10"
            max="2000"
            defaultValue="100"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                handleScopeChange(Number((form.elements.namedItem('doors') as HTMLInputElement).value), Number(e.target.value));
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzter Investitionsrahmen:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="grid gap-4 mt-6 sm:grid-cols-3">
            {state.breakdown.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm text-center flex flex-col items-center justify-center">
                <span className="block text-xs font-medium text-[oklch(0.32_0.02_260)] mb-1">{item.label}</span>
                <span className="block text-lg font-bold text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
