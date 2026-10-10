'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import type { RiskCalculationResult } from '@/actions/calculate-risk';
import { calculateRisk } from '@/actions/calculate-risk';

const initialState: RiskCalculationResult = {
  score: 0,
  level: 'MODERATE'
};

export function SicherheitsMatrix() {
  const [state, formAction, isPending] = useActionState(calculateRisk, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleRiskChange(value: number) {
    startTransition(() => {
      setOptimisticScore(value * 20);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Sicherheits-Matrix</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Gefährdungspotenzial (Faktor 1-5)</label>
          <input
            type="range"
            name="riskFactor"
            min="1"
            max="5"
            defaultValue="3"
            onChange={(e) => handleRiskChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Risiko-Score:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticScore} / 100
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {isPending ? 'Analysiere...' : 'Detaillierte Matrix berechnen'}
        </button>
      </form>
    </div>
  );
}
