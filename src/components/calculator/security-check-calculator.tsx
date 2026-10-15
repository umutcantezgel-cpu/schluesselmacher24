'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import type { SecurityCalculationResult } from '@/types/security';

const initialState: SecurityCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

function calculateSecurityBudget(prevState: SecurityCalculationResult, formData: FormData): SecurityCalculationResult {
  const doors = Number(formData.get('doors') || 0);
  const windows = Number(formData.get('windows') || 0);
  const total = (doors * 350) + (windows * 250);

  return {
    totalEstimate: total,
    breakdown: [
      { name: 'Türen', cost: doors * 350 },
      { name: 'Fenster', cost: windows * 250 }
    ],
    tier: total > 2000 ? 'PREMIUM' : 'STANDARD'
  };
}

export function SecurityCheckCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(doors: number, windows: number) {
    startTransition(() => {
      setOptimisticTotal((doors * 350) + (windows * 250));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Investitionsrechner Sicherheitstechnik</h3>
      <p className="text-[oklch(0.32_0.02_260)] mt-2">Berechnen Sie einen ersten Richtwert für die Absicherung Ihres Objekts.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der abzusichernden Türen</label>
          <input
            type="range"
            name="doors"
            min="1"
            max="10"
            defaultValue="1"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                  const windows = Number((form.elements.namedItem('windows') as HTMLInputElement).value);
                  handleScopeChange(Number(e.target.value), windows);
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der abzusichernden Fenster</label>
          <input
            type="range"
            name="windows"
            min="0"
            max="20"
            defaultValue="0"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                  const doors = Number((form.elements.namedItem('doors') as HTMLInputElement).value);
                  handleScopeChange(doors, Number(e.target.value));
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
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
