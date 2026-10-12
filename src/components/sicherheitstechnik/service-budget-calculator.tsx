'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';

type Tier = 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';

interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: string[];
  tier: Tier;
}

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
      setOptimisticTotal(value * 250); // Basic logic for optimistic update
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">Richtwert-Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-8">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Geschätzter Umfang (Sicherungspunkte / Melder)</label>
          <input
            type="range"
            name="scopePoints"
            min="5"
            max="100"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>Wohnung (ca. 5)</span>
            <span>EFH (ca. 25)</span>
            <span>Gewerbe (&gt;50)</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schutzniveau & Zertifizierung</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="cursor-pointer">
              <input type="radio" name="tier" value="STANDARD" className="peer sr-only" defaultChecked />
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 text-center peer-checked:border-[oklch(0.52_0.24_260)] peer-checked:bg-[oklch(0.52_0.24_260)/0.05] peer-checked:text-[oklch(0.16_0.02_260)] font-medium text-[oklch(0.32_0.02_260)] transition-colors">
                Grundschutz
                <span className="block text-xs font-normal text-[oklch(0.52_0.015_260)] mt-1">DIN EN 50131 Grad 2</span>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="tier" value="PROFESSIONAL" className="peer sr-only" />
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 text-center peer-checked:border-[oklch(0.52_0.24_260)] peer-checked:bg-[oklch(0.52_0.24_260)/0.05] peer-checked:text-[oklch(0.16_0.02_260)] font-medium text-[oklch(0.32_0.02_260)] transition-colors">
                Erweitert
                <span className="block text-xs font-normal text-[oklch(0.52_0.015_260)] mt-1">VdS Klasse A/B</span>
              </div>
            </label>
             <label className="cursor-pointer">
              <input type="radio" name="tier" value="ENTERPRISE" className="peer sr-only" />
              <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 text-center peer-checked:border-[oklch(0.52_0.24_260)] peer-checked:bg-[oklch(0.52_0.24_260)/0.05] peer-checked:text-[oklch(0.16_0.02_260)] font-medium text-[oklch(0.32_0.02_260)] transition-colors">
                Hochrisiko
                <span className="block text-xs font-normal text-[oklch(0.52_0.015_260)] mt-1">VdS Klasse C</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (Hardware + Montage):</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '3.750'} €
          </span>
        </div>

        {state.totalEstimate > 0 && (
           <div className="mt-4 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 text-sm text-[oklch(0.32_0.02_260)]">
             <p className="font-semibold mb-2">Exakte Kalkulation auf Basis Ihrer Angaben:</p>
             <ul className="list-disc pl-5 space-y-1">
               {state.breakdown.map((item, i) => (
                 <li key={i}>{item}</li>
               ))}
             </ul>
           </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne Details...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
