'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateVehicleKeyBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function VehicleKeyBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateVehicleKeyBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleTypeChange(value: string) {
    startTransition(() => {
      let base = 50;
      if (value === 'smart') base = 250;
      if (value === 'transponder') base = 150;
      setOptimisticTotal(base);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Autoschlüssel-Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schlüsselart</label>
          <select
            name="keyType"
            defaultValue="mechanic"
            onChange={(e) => handleTypeChange(e.target.value)}
            className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2 text-[oklch(0.16_0.02_260)] bg-[oklch(0.988_0.002_260)]"
          >
            <option value="mechanic">Nur mechanischer Schlüssel</option>
            <option value="transponder">Schlüssel mit Transponder</option>
            <option value="smart">Smart Key / Keyless Go</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[oklch(0.32_0.02_260)]">
            <input type="checkbox" name="programmingNeeded" className="accent-[oklch(0.52_0.24_260)] w-4 h-4" />
            Programmierung am Fahrzeug notwendig
          </label>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        {state.breakdown.length > 0 && (
           <div className="text-sm text-[oklch(0.32_0.02_260)] space-y-1 bg-white p-4 rounded-lg border border-[oklch(0.89_0.008_260/0.55)]">
             <div className="font-semibold mb-2">Aufschlüsselung:</div>
             {state.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{item.amount} €</span>
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
