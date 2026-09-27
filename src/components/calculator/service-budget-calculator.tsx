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
      setOptimisticTotal(value * 150); // Simplified optimistic update
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Autoschlüssel Kostenkalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie vorab die voraussichtlichen Kosten für Ihren Ersatzschlüssel oder Ihre Reparatur.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Fahrzeugklasse</label>
          <select
            name="brandGroup"
            className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="standard">Standard (VW, Ford, Opel, etc.)</option>
            <option value="premium">Premium (BMW, Mercedes, Audi)</option>
            <option value="luxury">Luxusklasse (Porsche, Bentley, etc.)</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
           <input
             type="checkbox"
             name="hasSmartKey"
             id="hasSmartKey"
             className="h-5 w-5 rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]"
           />
           <label htmlFor="hasSmartKey" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
             Fahrzeug verfügt über Keyless-Go / Smart-Key System
           </label>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Komplexität / Alter des Fahrzeugs (Jahre)</label>
          <input
            type="range"
            name="scopeDays"
            min="1"
            max="25"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="rounded-lg bg-white/50 p-4 mt-4">
            <h4 className="text-xs font-semibold text-[oklch(0.32_0.02_260)] mb-2 uppercase tracking-wider">Kalkulationsdetails</h4>
            <ul className="space-y-1">
              {state.breakdown.map((item, i) => (
                <li key={i} className="text-xs text-[oklch(0.32_0.02_260)] flex items-start gap-2">
                  <span className="text-[oklch(0.52_0.24_260)] mt-0.5">•</span>
                  {item}
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
