'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-enterprise-roi';
import type { RoiCalculationResult } from '@/types/roi';

const initialState: RoiCalculationResult = {
  totalSavings: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic<number, number>(
    state.totalSavings,
    (current, update) => update
  );

  function handleDoorsChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 250);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Kalkulator</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
        Berechnen Sie das Einsparpotenzial durch reduzierte Verwaltungs- und Wartungsaufwände einer elektronischen gegenüber einer mechanischen Anlage.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen</label>
          <input
            type="range"
            name="doors"
            min="10"
            max="500"
            defaultValue="50"
            onChange={(e) => handleDoorsChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>10</span>
            <span>500+</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Jährliches Einsparpotenzial:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
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
