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
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie schnell einen ersten Richtwert für Ihr Sicherheitsprojekt. Die tatsächlichen Kosten können je nach den exakten Anforderungen vor Ort variieren.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Geschätzte Stunden)</label>
          <input
            type="range"
            name="scopeDays"
            min="2"
            max="40"
            defaultValue="10"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-1">
            <span>Kleinprojekt (2h)</span>
            <span>Großprojekt (40h)</span>
          </div>
        </div>

        <div>
           <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Komplexitätsgrad</label>
           <select name="complexity" className="w-full mt-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)] outline-none focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] transition-all">
             <option value="BASIC">Standard (Mechanik, Zylindertausch)</option>
             <option value="STANDARD">Erweitert (Einfache Elektronik, Schließanlagen)</option>
             <option value="PREMIUM">Komplex (Vernetzte Zutrittskontrolle, Alarmanlagen)</option>
           </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown && state.breakdown.length > 0 && !isPending && (
          <div className="mt-4 rounded-lg bg-white p-4 text-sm border border-[oklch(0.89_0.008_260/0.3)]">
             <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Kostenschätzung Details</h4>
             <ul className="space-y-1">
               {state.breakdown.map((item, i) => (
                 <li key={i} className="flex justify-between text-[oklch(0.32_0.02_260)]">
                   <span>{item.label}</span>
                   <span>{item.amount.toLocaleString('de-DE')} €</span>
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
