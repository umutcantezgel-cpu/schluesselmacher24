'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSicherheitBudget } from '@/actions/calculate-sicherheit-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SicherheitstechnikBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSicherheitBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleCalculateChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const systemType = formData.get('systemType') as string;
    const cameras = Number(formData.get('cameras')) || 0;
    const sensors = Number(formData.get('sensors')) || 0;

    let basePrice = 0;
    switch(systemType) {
      case 'BASIC': basePrice = 500; break;
      case 'SMART': basePrice = 1200; break;
      case 'PREMIUM': basePrice = 2500; break;
      default: basePrice = 500;
    }

    startTransition(() => {
      setOptimisticTotal(basePrice + (cameras * 250) + (sensors * 80));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheitstechnik Budgetrechner</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Kalkulieren Sie einen ersten Richtwert für Ihre Sicherheitsausstattung.</p>

      <form action={formAction} onChange={handleCalculateChange} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Systemtyp</label>
          <select
            name="systemType"
            className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] p-2.5 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="BASIC">Basis-Absicherung (Mechanik & Grundmelder)</option>
            <option value="SMART">Smart Security (Vernetzte Alarmanlage)</option>
            <option value="PREMIUM">Premium (Vollschutz mit Video & Aufschaltung)</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Außenkameras</label>
            <input
              type="range"
              name="cameras"
              min="0"
              max="8"
              defaultValue="0"
              className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>0</span><span>8</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Tür-/Fenstersensoren</label>
            <input
              type="range"
              name="sensors"
              min="0"
              max="20"
              defaultValue="2"
              className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>0</span><span>20</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `${optimisticTotal.toLocaleString('de-DE')} €` : 'ab 500 €'}
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="mt-4 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 text-sm">
            <h4 className="font-semibold mb-2">Ihre Auswahl:</h4>
            <ul className="space-y-1">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between text-[oklch(0.32_0.02_260)]">
                  <span>{item.label}</span>
                  <span>{item.amount} €</span>
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
          {isPending ? 'Berechne Details...' : 'Detaillierte Aufschlüsselung anfordern'}
        </button>
      </form>
    </div>
  );
}
