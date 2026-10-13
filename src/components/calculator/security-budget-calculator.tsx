
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget, type SecurityBudgetResult, type SecurityTier } from '@/actions/calculate-security-budget';

const initialState: SecurityBudgetResult = {
  totalEstimate: 0,
  tier: 'BASIC'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleOptimisticChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const sqqm = Number(formData.get('sqm')) || 100;
    const doors = Number(formData.get('doors')) || 1;
    const windows = Number(formData.get('windows')) || 4;
    const level = formData.get('level') as SecurityTier || 'BASIC';

    let baseRate = 0;
    if (level === 'BASIC') baseRate = 50;
    if (level === 'BUSINESS') baseRate = 120;
    if (level === 'HIGH_SECURITY') baseRate = 250;

    const est = (sqqm * baseRate) + (doors * 500) + (windows * 300);

    startTransition(() => {
      setOptimisticTotal(est);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Investitionsrahmen Kalkulator</h3>
      <form action={formAction} onChange={handleOptimisticChange} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fläche (m²)</label>
            <input
              type="number"
              name="sqm"
              min="10"
              max="5000"
              defaultValue="100"
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Außentüren</label>
            <input
              type="number"
              name="doors"
              min="1"
              max="20"
              defaultValue="1"
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fenster (EG)</label>
            <input
              type="number"
              name="windows"
              min="0"
              max="50"
              defaultValue="4"
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Sicherheitsniveau</label>
          <select
            name="level"
            defaultValue="BASIC"
            className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="BASIC">Klasse A / Home (Grundsicherung)</option>
            <option value="BUSINESS">Klasse B / Business (Erhöhter Schutz)</option>
            <option value="HIGH_SECURITY">Klasse C / High Security (Vollschutz)</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-6">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzter Investitionsrahmen ab:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 mt-4"
        >
          {isPending ? 'Kalkuliere exakten Rahmen...' : 'Richtwert berechnen'}
        </button>
      </form>
    </div>
  );
}
