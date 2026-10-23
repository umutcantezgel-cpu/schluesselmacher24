
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-sicherheits-budget';
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

  function handleScopeChange(value: number, tierForm: string) {
    let m = 1;
    if (tierForm === 'ERWEITERT') m = 1.8;
    if (tierForm === 'HOCHSICHERHEIT') m = 3.5;

    startTransition(() => {
      setOptimisticTotal(value * 150 * m);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Investitions-Kalkulator</h3>
      <p className="text-sm text-[oklch(0.32_0.02_260)] mt-2">Berechnen Sie einen Richtwert für Ihr Sicherheitsprojekt.</p>

      <form action={formAction} className="mt-6 space-y-8">
        <div>
          <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">
            <span>Projektumfang (Manntage)</span>
          </label>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="5"
            onChange={(e) => {
              const form = e.target.form;
              const tier = form ? (form.elements.namedItem('tier') as HTMLSelectElement).value : 'STANDARD';
              handleScopeChange(Number(e.target.value), tier);
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>Kleinprojekt (1-3T)</span>
            <span>Großprojekt (bis 30T)</span>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">Schutzklasse</label>
           <select
             name="tier"
             className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] outline-none"
             onChange={(e) => {
                const form = e.target.form;
                const scope = form ? Number((form.elements.namedItem('scopeDays') as HTMLInputElement).value) : 5;
                handleScopeChange(scope, e.target.value);
             }}
           >
              <option value="STANDARD">Basis-Schutz (Privat)</option>
              <option value="ERWEITERT">Erweitert (Gewerbe / VdS)</option>
              <option value="HOCHSICHERHEIT">Hochsicherheit (KRITIS)</option>
           </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${Math.round(optimisticTotal).toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="pt-4 space-y-2">
            {state.breakdown.map((item, i) => (
               <div key={i} className="flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
                  <span>{item.label}</span>
                  <span>{Math.round(item.cost).toLocaleString('de-DE')} €</span>
               </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere exakte Aufstellung...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
