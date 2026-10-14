'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/actions/calculate-budget';

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

  function handleCalculate(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors')) || 0;
    const windows = Number(formData.get('windows')) || 0;
    const cameras = Number(formData.get('cameras')) || 0;
    const area = Number(formData.get('area')) || 0;

    startTransition(() => {
        setOptimisticTotal(1200 + (area * 5) + (doors * 350) + (windows * 150) + (cameras * 450));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Investitionsrechner Sicherheitstechnik</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Ermitteln Sie einen ersten Richtwert für Ihr Objekt.</p>
      <form action={formAction} onChange={handleCalculate} className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fläche (m²)</label>
            <input
                type="number"
                name="area"
                min="0"
                defaultValue="80"
                className="w-full mt-1 rounded-md border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] p-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
            <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Zu sichernde Türen</label>
            <input
                type="number"
                name="doors"
                min="1"
                defaultValue="1"
                className="w-full mt-1 rounded-md border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] p-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
            <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Fenster (Erdgeschoss)</label>
            <input
                type="number"
                name="windows"
                min="0"
                defaultValue="4"
                className="w-full mt-1 rounded-md border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] p-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
            <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Kameras</label>
            <input
                type="number"
                name="cameras"
                min="0"
                defaultValue="0"
                className="w-full mt-1 rounded-md border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] p-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? `ca. ${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
          </span>
        </div>

        {state.breakdown.length > 0 && !isPending && (
            <div className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)] bg-[oklch(0.988_0.002_260)] p-4 rounded-lg border border-[oklch(0.89_0.008_260)]">
                {state.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{item.label}</span>
                        <span>{item.cost.toLocaleString('de-DE')} €</span>
                    </div>
                ))}
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
