'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all motion-reduce:transition-none hover:shadow-[0_12px_32px_-4px_oklch(0.52_0.24_260/0.15)] group relative overflow-hidden isolate">
       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[oklch(0.988_0.002_260)] to-[oklch(0.968_0.004_260)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none"></div>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
        Erhalten Sie eine erste Einschätzung der Kosten basierend auf dem erwarteten Projektumfang.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label htmlFor="scopeDays" className="text-sm font-medium text-[oklch(0.16_0.02_260)] block mb-2">Projektumfang (Tage)</label>
          <input
            id="scopeDays"
            type="range"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
          />
           <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-1">
            <span>1 Tag</span>
            <span>30 Tage</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '0 €'}
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all motion-reduce:transition-none hover:bg-[oklch(0.46_0.24_260)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
