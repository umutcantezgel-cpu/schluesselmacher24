'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/lib/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic<number, number>(
    state.totalEstimate,
    (current, update) => update
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const scopeDays = Number(e.target.value);
    const form = e.target.form;
    const doors = Number((form?.elements.namedItem('doors') as HTMLInputElement)?.value || 10);

    startTransition(() => {
      setOptimisticTotal((scopeDays * 150) + (doors * 85));
    });
  }

  function handleDoorsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const doors = Number(e.target.value);
    const form = e.target.form;
    const scopeDays = Number((form?.elements.namedItem('scopeDays') as HTMLInputElement)?.value || 15);

    startTransition(() => {
      setOptimisticTotal((scopeDays * 150) + (doors * 85));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Kalkulieren Sie die ungefähren Kosten für Ihre geplante Schließanlage. Die genauen Kosten hängen von spezifischen Anpassungen ab.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Zylinder/Schlösser)</label>
              <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">15 - 60</span>
            </div>
            <input
              type="range"
              name="scopeDays"
              min="5"
              max="60"
              defaultValue="15"
              onChange={handleScopeChange}
              className="w-full accent-[oklch(0.52_0.24_260)] h-2 bg-[oklch(0.89_0.008_260/0.55)] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen</label>
              <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">10 - 100</span>
            </div>
            <input
              type="range"
              name="doors"
              min="10"
              max="100"
              defaultValue="10"
              onChange={handleDoorsChange}
              className="w-full accent-[oklch(0.52_0.24_260)] h-2 bg-[oklch(0.89_0.008_260/0.55)] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-4">
          <div>
            <span className="text-sm text-[oklch(0.52_0.015_260)] block">Kalkulierter Richtwert:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '3.100'} €
            </span>
            {state.tier === 'ENTERPRISE' && (
              <span className="ml-3 inline-flex items-center rounded-full bg-[oklch(0.968_0.004_260)] px-2.5 py-0.5 text-xs font-semibold text-[oklch(0.52_0.24_260)] border border-[oklch(0.52_0.24_260/0.3)]">
                Enterprise
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto px-8 rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
          </button>
        </div>
      </form>
    </div>
  );
}
