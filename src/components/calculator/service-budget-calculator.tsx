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
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie unverbindlich den Rahmen für Ihr Sicherheitstechnik-Projekt.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang in Tagen (geschätzt)</label>
            <span className="text-sm font-bold text-[oklch(0.16_0.02_260)]">15 Tage</span>
          </div>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] transition-all motion-reduce:transition-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Kameras</label>
              <input
                type="number"
                name="cameras"
                min="0"
                max="20"
                defaultValue="0"
                className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[oklch(0.52_0.24_260)] focus:border-transparent transition-shadow motion-reduce:transition-none text-[oklch(0.16_0.02_260)]"
              />
            </div>

            <div className="flex items-center space-x-3 mt-7">
                <input
                    type="checkbox"
                    name="alarm"
                    id="alarm"
                    className="w-5 h-5 rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)] accent-[oklch(0.52_0.24_260)]"
                />
                <label htmlFor="alarm" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alarmanlage</label>
            </div>
        </div>

        {state.breakdown.length > 0 && (
           <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 space-y-2">
             {state.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                   <span className="text-[oklch(0.32_0.02_260)]">{item.label}</span>
                   <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
                </div>
             ))}
           </div>
        )}

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
