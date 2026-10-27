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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Schätzen Sie den Umfang Ihres Sicherheitsprojekts grob ab. Die finale Berechnung erfolgt nach der Bestandsaufnahme.
      </p>
      <form action={formAction} className="mt-8 space-y-8">
        <div>
          <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-4">
            <span>Projektumfang (Tage)</span>
            <span className="font-mono bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded text-[oklch(0.16_0.02_260)]">15</span>
          </label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => {
              const val = Number(e.target.value);
              e.target.previousElementSibling!.lastElementChild!.textContent = val.toString();
              handleScopeChange(val);
            }}
            className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer h-2 bg-[oklch(0.89_0.008_260/0.55)] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-xs text-foreground-muted mt-2">
            <span>Kleinprojekt (5 Tage)</span>
            <span>Großprojekt (60 Tage)</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)]">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Kalkulierter Richtwert</span>
          <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal === 0 ? '---' : `${optimisticTotal.toLocaleString('de-DE')} €`}
          </span>
          <span className="text-xs text-foreground-muted">Zuzüglich gesetzlicher Mehrwertsteuer und Materialkosten.</span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kalkuliere...
            </>
          ) : (
            'Detaillierte Kostenaufstellung anfordern'
          )}
        </button>
      </form>
    </div>
  );
}
