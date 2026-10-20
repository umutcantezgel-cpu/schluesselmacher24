'use client';

import { useActionState, useOptimistic, startTransition } from 'react';

// Wir verwenden statische Kalkulation, da es nur ein Frontend-Rechner ist
const calculateBudget = async (prevState: unknown, formData: FormData) => {
  const scopeDays = Number(formData.get('scopeDays')) || 15;
  const areaCount = Number(formData.get('areaCount')) || 1;
  const baseValue = scopeDays * 150 + areaCount * 500;
  return {
    totalEstimate: baseValue,
    breakdown: [],
    tier: 'STANDARD',
  };
};

const initialState = {
  totalEstimate: 15 * 150 + 500, // Default 15 Tage + 1 Bereich
  breakdown: [],
  tier: 'STANDARD',
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number, area: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150 + area * 500);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Zu sichernde Bereiche (Türen/Fenster/Flächen)</label>
          <input
            type="range"
            name="areaCount"
            min="1"
            max="20"
            defaultValue="1"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                const days = Number((form.elements.namedItem('scopeDays') as HTMLInputElement).value);
                handleScopeChange(days, Number(e.target.value));
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Installationsaufwand (Geschätzte Stunden)</label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => {
              const form = e.target.form;
              if (form) {
                const areas = Number((form.elements.namedItem('areaCount') as HTMLInputElement).value);
                handleScopeChange(Number(e.target.value), areas);
              }
            }}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
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
