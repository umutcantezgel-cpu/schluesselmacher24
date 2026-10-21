'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceTier, type TierCalculationResult } from '@/lib/actions/calculate-tier';


const initialState: TierCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function ServiceTierCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceTier, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number, complexity: string) {
    startTransition(() => {
      let multiplier = 1;
      if (complexity === 'premium') multiplier = 1.5;
      if (complexity === 'enterprise') multiplier = 2.5;
      setOptimisticTotal(value * 850 * multiplier);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Kalkulator (Tier)</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                const complexity = (form.elements.namedItem('complexity') as HTMLSelectElement).value;
                handleScopeChange(Number(e.target.value), complexity);
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Komplexität</label>
          <select
            name="complexity"
            defaultValue="standard"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                const scopeDays = Number((form.elements.namedItem('scopeDays') as HTMLInputElement).value);
                handleScopeChange(scopeDays, e.target.value);
              }
            }}
            className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[oklch(0.32_0.02_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4" style={{ viewTransitionName: 'total-estimate' }}>
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
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
