'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 2250,
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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Nutzen Sie unseren Kalkulator, um eine unverbindliche erste Schätzung für Ihre Schließanlage oder Sicherheitstechnik zu erhalten.</p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-1">
            <span>Kleinprojekt (5 Tage)</span>
            <span>Großprojekt (60 Tage)</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
