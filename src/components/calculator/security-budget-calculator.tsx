'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/lib/actions/calculate-budget';

type Tier = 'BASIC' | 'STANDARD' | 'PREMIUM';

export interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; amount: number }[];
  tier: Tier;
}

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
      setOptimisticTotal(value * 850); // Rough estimate for client update
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Security Investment Calculator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Estimate the rough budget required for your security upgrade.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Number of Access Points (Doors/Windows)</label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              name="accessPoints"
              min="1"
              max="20"
              defaultValue="5"
              onChange={(e) => handleScopeChange(Number(e.target.value))}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Security Tier</label>
          <select
            name="tier"
            className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="BASIC">Basic (Mechanical Locks)</option>
            <option value="STANDARD">Standard (Mechanical + Alarm)</option>
            <option value="PREMIUM">Premium (Smart Access + CCTV + Alarm)</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Estimated Budget:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ~{optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '4.250'} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="mt-4 space-y-2 rounded-lg bg-[oklch(0.988_0.002_260)] p-4">
             {state.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)]">
                  <span>{item.label}</span>
                  <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
                </div>
             ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Calculating...' : 'Calculate Detailed Breakdown'}
        </button>
      </form>
    </div>
  );
}
