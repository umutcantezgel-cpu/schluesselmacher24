'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget, type BudgetCalculationResult } from '@/actions/calculate-budget';

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
      const complexity = (document.querySelector('select[name="complexity"]') as HTMLSelectElement)?.value || 'STANDARD';
      let multiplier = 150;
      if (complexity === 'BASIC') multiplier = 100;
      if (complexity === 'PREMIUM') multiplier = 250;
      setOptimisticTotal((value * multiplier) + 500);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">Berechnen Sie einen ersten Richtwert für Ihre neue Sicherheitstechnik basierend auf Projekttagen und Komplexität.</p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Tage)</label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>5 Tage</span>
            <span>60 Tage</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Komplexitätsgrad</label>
          <select
            name="complexity"
            className="w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.32_0.02_260)]"
            defaultValue="STANDARD"
            onChange={(e) => {
              const val = e.target.value;
              const rangeVal = Number((document.querySelector('input[name="scopeDays"]') as HTMLInputElement)?.value || 15);
              let multiplier = 150;
              if (val === 'BASIC') multiplier = 100;
              if (val === 'PREMIUM') multiplier = 250;
              startTransition(() => {
                setOptimisticTotal((rangeVal * multiplier) + 500);
              });
            }}
          >
            <option value="BASIC">Grundabsicherung (Basic)</option>
            <option value="STANDARD">Erweiterter Schutz (Standard)</option>
            <option value="PREMIUM">Hochsicherheit (Premium)</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown && state.breakdown.length > 0 && (
          <div className="text-xs text-[oklch(0.52_0.015_260)] space-y-1">
            {state.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.label}:</span>
                <span>{item.cost.toLocaleString('de-DE')} €</span>
              </div>
            ))}
          </div>
        )}

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
