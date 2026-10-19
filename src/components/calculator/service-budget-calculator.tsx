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
      setOptimisticTotal(value * 150); // simplified optimistic calculation
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Sicherheitsbudget-Kalkulator</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">
        Schätzen Sie die voraussichtlichen Kosten für Ihr Sicherheitsprojekt basierend auf Umfang und gewünschtem Sicherheitsniveau.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang in Tagen</label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="range"
              name="scopeDays"
              min="1"
              max="60"
              defaultValue="15"
              onChange={(e) => handleScopeChange(Number(e.target.value))}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div>
           <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Sicherheitsniveau</label>
           <select name="securityLevel" defaultValue="STANDARD" className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
             <option value="BASIC">Basisschutz (Mechanisch)</option>
             <option value="STANDARD">Standard (Mechanik + Basis Elektronik)</option>
             <option value="PREMIUM">Premium (Vollintegrierte Systeme)</option>
           </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '--- €'}
          </span>
        </div>

        {state.breakdown.length > 0 && (
            <div className="mt-4 text-sm text-[oklch(0.32_0.02_260)]">
                <p className="font-semibold mb-2">Kostenschätzung nach Bereich:</p>
                <ul className="space-y-1">
                    {state.breakdown.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                            <span>{item.category}</span>
                            <span>{item.cost.toLocaleString('de-DE')} €</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
