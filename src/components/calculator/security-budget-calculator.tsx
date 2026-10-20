'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 250); // example multiplier for security
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Schätzen Sie den groben Kostenrahmen für die Absicherung Ihres Objekts ab.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der abzusichernden Zugänge (Türen/Fenster)</label>
          <input
            type="range"
            name="accessPoints"
            min="1"
            max="20"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full mt-2 accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] px-1">
             <span>1</span>
             <span>20</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Gewünschtes Sicherheitsniveau</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 p-3 border border-[oklch(0.89_0.008_260/0.55)] rounded-lg cursor-pointer hover:bg-[oklch(0.988_0.002_260)]">
              <input type="radio" name="level" value="basis" defaultChecked className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm text-[oklch(0.16_0.02_260)]">Basis (Mechanisch)</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-[oklch(0.89_0.008_260/0.55)] rounded-lg cursor-pointer hover:bg-[oklch(0.988_0.002_260)]">
              <input type="radio" name="level" value="premium" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm text-[oklch(0.16_0.02_260)]">Premium (Elektronisch + Mechanisch)</span>
            </label>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
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
