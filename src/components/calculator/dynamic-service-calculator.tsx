'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/lib/actions/calculate-service';
import type { BudgetCalculationResult } from '@/lib/actions/calculate-service';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function DynamicServiceCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150); // Default to standard rate for optimistic UI
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] group transition-all duration-500 hover:shadow-[0_12px_36px_-6px_oklch(0.16_0.02_260/0.08)] hover:border-[oklch(0.85_0.012_260/0.7)]">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight group-hover:text-[oklch(0.12_0.02_260)] transition-colors">Interaktiver Projekt-Kalkulator</h3>
        <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
          Berechnen Sie schnell und transparent den Rahmen für Ihre individuellen Anforderungen.
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
            <span className="text-sm font-mono text-[oklch(0.52_0.24_260)] bg-[oklch(0.988_0.002_260)] px-2 py-1 rounded">15 bis 60</span>
          </div>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full h-2 bg-[oklch(0.89_0.008_260/0.55)] rounded-lg appearance-none cursor-pointer accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="space-y-4">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Service-Level</label>
            <div className="grid grid-cols-3 gap-3">
                {['STANDARD', 'PREMIUM', 'ENTERPRISE'].map((tier) => (
                    <label key={tier} className="relative flex cursor-pointer rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-4 shadow-sm focus:outline-none hover:border-[oklch(0.52_0.24_260)] transition-colors">
                        <input type="radio" name="tier" value={tier} defaultChecked={tier === 'STANDARD'} className="sr-only" />
                        <span className="flex flex-1">
                            <span className="flex flex-col">
                                <span className="block text-sm font-medium text-[oklch(0.16_0.02_260)]">{tier}</span>
                            </span>
                        </span>
                    </label>
                ))}
            </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
            <div className="pt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.32_0.02_260)] mb-3">Kostensplit</h4>
                {state.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span className="text-[oklch(0.42_0.02_260)]">{item.label}</span>
                        <span className="font-mono text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
                    </div>
                ))}
            </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] hover:shadow-md active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kalkuliere...
            </>
          ) : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
