'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseRoiCalculationResult } from '@/types/enterprise-roi';

const initialState: EnterpriseRoiCalculationResult = {
  estimatedCost: 0,
  estimatedSavings: 0,
  roiMonths: 0,
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<EnterpriseRoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLFormElement>) {
    const doors = Number((e.target.form?.elements.namedItem('doors') as HTMLInputElement)?.value || 10);
    const users = Number((e.target.form?.elements.namedItem('users') as HTMLInputElement)?.value || 20);

    startTransition(() => {
      const estCost = (doors * 120) + (users * 15);
      setOptimisticState({
        estimatedCost: estCost,
        estimatedSavings: estCost * 0.15,
        roiMonths: Math.max(1, Math.round(estCost / (estCost * 0.15 || 1))),
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI & Kosten-Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Berechnen Sie die voraussichtlichen Kosten und den Return on Investment (ROI) für Ihre maßgeschneiderte Schließanlage.
      </p>
      <form action={formAction} onChange={handleScopeChange} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen</label>
              <input
                type="range"
                name="doors"
                min="1"
                max="200"
                defaultValue="10"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Nutzer</label>
              <input
                type="range"
                name="users"
                min="1"
                max="500"
                defaultValue="20"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>
        </div>

        <div className="grid grid-rows-subgrid gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 md:grid-cols-3">
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Kosten:</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedCost.toLocaleString('de-DE')} €
            </span>
          </div>
          <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">Mögliche Ersparnis (p.a.):</span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.estimatedSavings.toLocaleString('de-DE')} €
              </span>
          </div>
          <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">Amortisation (ROI):</span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                ca. {optimisticState.roiMonths} Monate
              </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
