'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/estimate-enterprise-roi';
import type { ROICalculationResult } from '@/lib/actions/estimate-enterprise-roi';

const initialState: ROICalculationResult = {
  estimatedSavings: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.estimatedSavings,
    (current, update: number) => update
  );

  function handleScopeChange(users: number, doors: number) {
    startTransition(() => {
      setOptimisticTotal((users * 15) + (doors * 50));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Effizienz-Kalkulator</h3>
      <p className="text-[14px] text-[oklch(0.32_0.02_260)] mb-6 mt-2">Berechnen Sie die Einsparpotenziale einer modernen Schließanlage für Ihr Unternehmen.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Anzahl Mitarbeiter</label>
          <input
            type="range"
            name="users"
            min="10"
            max="1000"
            defaultValue="50"
            onChange={(e) => handleScopeChange(Number(e.target.value), Number((e.target.form?.elements.namedItem('doors') as HTMLInputElement)?.value || 20))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Anzahl Türen / Schließstellen</label>
          <input
            type="range"
            name="doors"
            min="5"
            max="500"
            defaultValue="20"
            onChange={(e) => handleScopeChange(Number((e.target.form?.elements.namedItem('users') as HTMLInputElement)?.value || 50), Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzte jährliche Ersparnis:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne...' : 'Detaillierten Report anfordern'}
        </button>
      </form>
    </div>
  );
}
