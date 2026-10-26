'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateHomeBudget } from '@/actions/home-action';

type BudgetCalculationResult = {
  totalEstimate: number;
  breakdown: string[];
  tier: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
};

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function HomeInteractiveModule() {
  const [state, formAction, isPending] = useActionState(calculateHomeBudget, initialState);
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
    <div className="group rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_16px_40px_-8px_oklch(0.16_0.02_260/0.12)]">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[oklch(0.968_0.004_260)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none mix-blend-overlay"></div>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6 relative z-10">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
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
