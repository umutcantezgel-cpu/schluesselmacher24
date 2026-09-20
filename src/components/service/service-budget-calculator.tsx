'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/lib/actions/calculate-budget';
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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie einen ersten Richtwert für komplexere Service-Leistungen und Projekte.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
            <span>Projektumfang (Tage)</span>
          </label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="mt-2 flex justify-between text-[11px] font-semibold tracking-wider text-[oklch(0.52_0.015_260)] uppercase">
            <span>Kleinprojekt</span>
            <span>Großprojekt</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown.length > 0 && !isPending && (
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.3)] bg-[oklch(0.988_0.002_260)] p-4">
            <h4 className="text-[12px] font-bold tracking-wider text-[oklch(0.32_0.02_260)] uppercase mb-3">
              Aufschlüsselung ({state.tier})
            </h4>
            <ul className="space-y-2">
              {state.breakdown.map((item: {item: string; cost: number}, index: number) => (
                <li key={index} className="flex justify-between text-[13px] text-[oklch(0.32_0.02_260)]">
                  <span>{item.item}</span>
                  <span className="font-medium">{item.cost.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
