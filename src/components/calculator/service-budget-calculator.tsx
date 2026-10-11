'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 2250,
  breakdown: [
    { label: 'Grundleistung', value: 1350 },
    { label: 'Material & Komponenten', value: 675 },
    { label: 'Service & Einrichtung', value: 225 }
  ],
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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all motion-reduce:transition-none hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.988_0.002_260)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity motion-reduce:transition-none pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
        <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Nutzen Sie unseren Kalkulator, um eine erste, unverbindliche Kostenschätzung für komplexe Service- und Projektanforderungen zu erhalten.</p>
        <form action={formAction} className="mt-6 space-y-6">
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
              <span className="text-sm text-[oklch(0.52_0.015_260)] font-semibold">{optimisticTotal / 150 || 15} Tage</span>
            </div>
            <input
              type="range"
              name="scopeDays"
              min="5"
              max="60"
              defaultValue="15"
              onChange={(e) => handleScopeChange(Number(e.target.value))}
              className="w-full mt-3 accent-[oklch(0.52_0.24_260)] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
              <span>Klein</span>
              <span>Umfangreich</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
            </span>
          </div>

          {state.breakdown.length > 0 && (
             <div className="space-y-2 mt-4 pt-4 border-t border-[oklch(0.89_0.008_260/0.2)]">
                <p className="text-xs font-semibold text-[oklch(0.32_0.02_260)] mb-3">Detaillierte Aufschlüsselung:</p>
                {state.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-[oklch(0.52_0.015_260)]">{item.label}</span>
                    <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.value.toLocaleString('de-DE')} €</span>
                  </div>
                ))}
                <div className="mt-3 inline-flex items-center rounded-full bg-[oklch(0.92_0.01_260)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.32_0.02_260)]">
                   Service-Tier: {state.tier}
                </div>
             </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all motion-reduce:transition-none hover:bg-[oklch(0.48_0.24_260)] hover:shadow-md active:scale-[0.99] motion-reduce:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
          </button>
        </form>
      </div>
    </div>
  );
}
