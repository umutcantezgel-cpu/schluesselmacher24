'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateKeyOrder } from '@/actions/calculate-keys';
import type { KeyCalculationResult } from '@/actions/calculate-keys';

const initialState: KeyCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function KeyCodeCalculator() {
  const [state, formAction, isPending] = useActionState(calculateKeyOrder, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  const [counts, setCounts] = useState({ standardCount: 0, securityCount: 0, carCount: 0 });

  function handleChange(type: 'standardCount' | 'securityCount' | 'carCount', value: number) {
    const newCounts = { ...counts, [type]: value };
    setCounts(newCounts);

    startTransition(() => {
      const calcTotal = (newCounts.standardCount * 12.50) +
                        (newCounts.securityCount * 35.00) +
                        (newCounts.carCount * 85.00);
      setOptimisticTotal(calcTotal);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Bedarfsrechner: Schließanlagen & Ersatz</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie die ungefähren Kosten für Ihr Projekt anhand der benötigten Schlüsseltypen.
      </p>

      <form action={formAction} className="mt-8 space-y-8">

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block">
              Standard-Zylinder (ca. 12,50€)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="standardCount"
                min="0"
                max="50"
                value={counts.standardCount}
                onChange={(e) => handleChange('standardCount', Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <span className="text-sm font-semibold w-8 text-right text-[oklch(0.16_0.02_260)]">{counts.standardCount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block">
              Sicherheits-Profil (ca. 35,00€)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="securityCount"
                min="0"
                max="20"
                value={counts.securityCount}
                onChange={(e) => handleChange('securityCount', Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <span className="text-sm font-semibold w-8 text-right text-[oklch(0.16_0.02_260)]">{counts.securityCount}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block">
              Kfz-Schlüssel (ca. 85,00€)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="carCount"
                min="0"
                max="10"
                value={counts.carCount}
                onChange={(e) => handleChange('carCount', Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <span className="text-sm font-semibold w-8 text-right text-[oklch(0.16_0.02_260)]">{counts.carCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
            <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] mt-1">
              {optimisticTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending || optimisticTotal === 0}
            className="w-full md:w-auto rounded-xl bg-[oklch(0.52_0.24_260)] px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100"
          >
            {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
          </button>
        </div>

        {state.breakdown.length > 0 && !isPending && (
          <div className="mt-6 p-4 rounded-xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)]">
            <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-3">Zusammenfassung ({state.tier}-Tarif)</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              {state.breakdown.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.count}x {item.type}</span>
                  <span className="font-medium">{item.cost.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
