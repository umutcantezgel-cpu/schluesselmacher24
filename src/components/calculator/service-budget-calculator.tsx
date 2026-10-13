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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Nutzen Sie unseren Kalkulator, um eine grobe Kostenschätzung für Ihr Sicherheitstechnik-Projekt zu erhalten.</p>

      <form action={formAction} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Projektumfang (Sensoren/Türen/Kameras)</span>
          </label>
          <div className="mt-2 flex items-center gap-4">
             <input
                type="range"
                name="scopeDays"
                min="5"
                max="100"
                defaultValue="15"
                onChange={(e) => handleScopeChange(Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)]"
              />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.55)]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '— '} €
            </span>
          </div>
          {state.breakdown.length > 0 && !isPending && (
            <div className="mt-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
               <span className="text-xs font-semibold text-[oklch(0.32_0.02_260)] uppercase tracking-wider mb-2 block">Letzte Schätzung</span>
               <ul className="space-y-1">
                 {state.breakdown.map((item, idx) => (
                   <li key={idx} className="text-sm text-[oklch(0.52_0.015_260)] flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-[oklch(0.52_0.24_260)]" />
                     {item}
                   </li>
                 ))}
               </ul>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
