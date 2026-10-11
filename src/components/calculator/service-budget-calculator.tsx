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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12 w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">
        Schätzen Sie unverbindlich die Kosten für Ihre Sicherheitsanlage. Bewegen Sie den Slider, um den Umfang anzupassen.
      </p>
      <form action={formAction} className="mt-8 space-y-8">
        <div>
          <label className="text-sm font-medium text-[oklch(0.16_0.02_260)] flex justify-between">
            <span>Projektumfang (Arbeitseinheiten)</span>
            <span className="text-[oklch(0.52_0.24_260)] font-semibold">{optimisticTotal / 150} AE</span>
          </label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="120"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full mt-4 accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex flex-col md:flex-row items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="flex flex-col">
            <span className="text-sm text-[oklch(0.52_0.015_260)] uppercase tracking-wider font-medium">Kalkulierter Richtwert</span>
            <span className="text-[0.65rem] text-[oklch(0.32_0.02_260)] mt-1">*Inkl. MwSt., Material & Anfahrt</span>
          </div>
          <span className="text-4xl md:text-5xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-4 md:mt-0">
            {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] hover:shadow-md active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white motion-reduce:animate-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kalkuliere exakte Aufstellung...
            </span>
          ) : 'Detaillierte Kostenaufstellung anfordern'}
        </button>

        {state.totalEstimate > 0 && (
          <div className="mt-6 p-4 bg-[oklch(0.988_0.002_260)] rounded-lg border border-[oklch(0.89_0.008_260/0.3)] animate-in fade-in duration-300">
            <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-3">Aufschlüsselung (Tier: {state.tier})</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              {state.breakdown.map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-[oklch(0.89_0.008_260/0.3)] pb-2 last:border-0 last:pb-0">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.amount.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
