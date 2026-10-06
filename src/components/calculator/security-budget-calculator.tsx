// src/components/calculator/security-budget-calculator.tsx
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIS'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      // Rough optimistic calculation just for immediate UI feedback
      const base = 3500; // Assume house as default for slider preview
      setOptimisticTotal(base + value * 180);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Indikativer Budgetrechner</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Geben Sie Objekttyp und groben Umfang an, um eine erste Kosteneinschätzung für Ihr Sicherheitsprojekt zu erhalten.
      </p>
      <form action={formAction} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2 block">Objekttyp</label>
          <select
            name="objectType"
            className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="wohnung">Wohnung / Etagenbereich</option>
            <option value="einfamilienhaus" defaultValue="einfamilienhaus">Einfamilienhaus / Eigenheim</option>
            <option value="gewerbe">Gewerbeobjekt / Büro</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Umfang / Komplexität (Tage)</span>
          </label>
          <input
            type="range"
            name="scopeDays"
            min="2"
            max="30"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-3"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `ca. ${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown.length > 0 && !isPending && (
           <div className="text-xs text-[oklch(0.32_0.02_260)] space-y-1 bg-white p-3 rounded border border-[oklch(0.89_0.008_260/0.55)]">
             <div className="font-semibold mb-2">Kostenschätzung:</div>
             {state.breakdown.map((item, idx) => (
               <div key={idx} className="flex justify-between">
                 <span>{item.label}</span>
                 <span>{item.cost.toLocaleString('de-DE')} €</span>
               </div>
             ))}
           </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Kalkuliere...' : 'Indikatives Budget berechnen'}
        </button>
      </form>
    </div>
  );
}
