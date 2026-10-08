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
    <div className="w-full">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Indikativer Budget-Kalkulator für Sicherheitstechnik</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">Nutzen Sie unseren Kalkulator, um eine grobe Einschätzung der Investitionskosten für Ihr Sicherheitsprojekt zu erhalten.</p>

      <form action={formAction} className="mt-8 space-y-8">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Zu sichernde Zugangspunkte (Türen/Fenster)</label>
            <span className="text-sm font-bold text-[oklch(0.52_0.24_260)]">ca. 150€ / Punkt</span>
          </div>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full h-2 bg-[oklch(0.89_0.008_260/0.55)] rounded-lg appearance-none cursor-pointer accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-2">
            <span>1 Punkt (Wohnung)</span>
            <span>30 Punkte (Gewerbe)</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Unverbindlicher Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-[15px] font-bold text-white shadow-[0_4px_12px_-2px_oklch(0.52_0.24_260/0.3)] transition-all hover:bg-[oklch(0.48_0.24_260)] hover:shadow-[0_6px_16px_-2px_oklch(0.52_0.24_260/0.4)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? 'Kalkuliere detailliertes Angebot...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>

      {state.breakdown.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <h4 className="text-sm font-bold text-[oklch(0.16_0.02_260)] mb-4">Kostenschätzung ({state.tier}):</h4>
          <ul className="space-y-3">
            {state.breakdown.map((item, index) => (
              <li key={index} className="flex justify-between text-sm">
                <span className="text-[oklch(0.32_0.02_260)]">{item.name}</span>
                <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
