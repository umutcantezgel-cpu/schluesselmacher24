'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget, type BudgetCalculationResult, type Tier } from '@/actions/calculate-budget';

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

  function handleScopeChange(value: number, currentTier: Tier) {
    let rate = 150;
    if (currentTier === 'BASIC') rate = 100;
    if (currentTier === 'PREMIUM') rate = 250;

    startTransition(() => {
      setOptimisticTotal(value * rate);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Berechnen Sie einen ersten Richtwert für Ihr Sicherheitsprojekt.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Qualitätsstufe</label>
          <select
            name="tier"
            defaultValue="STANDARD"
            className="mt-2 block w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm"
          >
            <option value="BASIC">Basic (Grundschutz)</option>
            <option value="STANDARD">Standard (Erweiterter Schutz)</option>
            <option value="PREMIUM">Premium (Höchste Sicherheit)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Geschätzte Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="10"
            onChange={(e) => {
              const form = e.target.closest('form');
              const tierSelect = form?.querySelector('select[name="tier"]') as HTMLSelectElement;
              handleScopeChange(Number(e.target.value), (tierSelect?.value || 'STANDARD') as Tier);
            }}
            className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
            <span>1 Tag</span>
            <span>30 Tage</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '--- €'}
          </span>
        </div>

        {state.breakdown && state.breakdown.length > 0 && !isPending && (
          <div className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
            <p className="font-semibold">Geschätzte Aufteilung:</p>
            <ul className="space-y-1">
              {state.breakdown.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{item.cost.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
