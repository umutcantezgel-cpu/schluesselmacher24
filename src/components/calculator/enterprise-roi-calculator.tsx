'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic<number, number>(
    state.totalEstimate,
    (current: number, update: number) => update
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const scopeDays = Number(e.target.value);
    const doorsElement = (e.target.form?.elements.namedItem('doors') as HTMLInputElement);
    const doors = doorsElement ? Number(doorsElement.value) : 20;

    startTransition(() => {
      setOptimisticTotal(scopeDays * 150 + doors * 80);
    });
  }

  function handleDoorsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const doors = Number(e.target.value);
    const scopeElement = (e.target.form?.elements.namedItem('scopeDays') as HTMLInputElement);
    const scopeDays = scopeElement ? Number(scopeElement.value) : 5;

    startTransition(() => {
      setOptimisticTotal(scopeDays * 150 + doors * 80);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI & Aufwandskalkulator</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie direkt einen Richtwert für Ihre geplante Schließanlage. Bewegen Sie die Regler, um die Kostenschätzung in Echtzeit zu aktualisieren.
      </p>
      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Projektumfang (Beratung & Planung in Tagen)</label>
            </div>
            <input
              type="range"
              name="scopeDays"
              min="1"
              max="60"
              defaultValue="5"
              onChange={handleScopeChange}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="flex justify-between mt-1 text-xs text-[oklch(0.52_0.015_260)]">
              <span>1 Tag</span>
              <span>60 Tage</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Schließstellen (Türen, Zylinder)</label>
            </div>
            <input
              type="range"
              name="doors"
              min="5"
              max="500"
              defaultValue="20"
              onChange={handleDoorsChange}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="flex justify-between mt-1 text-xs text-[oklch(0.52_0.015_260)]">
              <span>5 Türen</span>
              <span>500 Türen</span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-8">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (netto):</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
            {state.breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.label}:</span>
                <span className="font-medium">{item.cost.toLocaleString('de-DE')} €</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto mt-6 rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
