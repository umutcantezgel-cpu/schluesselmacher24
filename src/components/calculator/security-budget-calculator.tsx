'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';

interface BudgetCalculationResult {
  totalEstimate: number;
  breakdown: { label: string; cost: number }[];
  tier: string;
}

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 350);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Schätzen Sie das Budget für Ihre Sicherheitslösung.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
            <span>Anzahl der zu sichernden Zugänge / Räume</span>
            <span className="font-semibold">{Math.max(1, Math.round(optimisticTotal / 350))}</span>
          </label>
          <input
            type="range"
            name="scopeSize"
            min="1"
            max="20"
            defaultValue="5"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Gewünschte Systemkomponenten</label>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="alarm" name="components" value="alarm" defaultChecked className="accent-[oklch(0.52_0.24_260)] w-4 h-4 rounded border-[oklch(0.89_0.008_260/0.55)]" />
            <label htmlFor="alarm" className="text-sm text-[oklch(0.32_0.02_260)]">Einbruchmeldeanlage (Alarm)</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="video" name="components" value="video" className="accent-[oklch(0.52_0.24_260)] w-4 h-4 rounded border-[oklch(0.89_0.008_260/0.55)]" />
            <label htmlFor="video" className="text-sm text-[oklch(0.32_0.02_260)]">Videoüberwachung</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="access" name="components" value="access" className="accent-[oklch(0.52_0.24_260)] w-4 h-4 rounded border-[oklch(0.89_0.008_260/0.55)]" />
            <label htmlFor="access" className="text-sm text-[oklch(0.32_0.02_260)]">Elektronische Zutrittskontrolle</label>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '1.750'} €
          </span>
        </div>

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
