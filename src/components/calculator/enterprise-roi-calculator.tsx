'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/types/roi-budget';

const initialState: ROICalculationResult = {
  totalInvestment: 0,
  annualSavings: 0,
  roiMonths: 0,
  efficiencyGain: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: ROICalculationResult) => update
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;
    const doors = Number((form.elements.namedItem('doors') as HTMLInputElement)?.value || 10);
    const users = Number((form.elements.namedItem('users') as HTMLInputElement)?.value || 50);

    const totalInvestment = doors * 250 + users * 15;
    const annualSavings = users * 45;
    const roiMonths = Math.ceil((totalInvestment / annualSavings) * 12);
    const efficiencyGain = Math.min(Math.round((annualSavings / totalInvestment) * 100), 200);

    startTransition(() => {
      setOptimisticState({ totalInvestment, annualSavings, roiMonths, efficiencyGain });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI-Kalkulator</h3>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen</label>
          <input
            type="range"
            name="doors"
            min="5"
            max="200"
            defaultValue="10"
            onChange={handleScopeChange}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Nutzer</label>
          <input
            type="range"
            name="users"
            min="10"
            max="1000"
            defaultValue="50"
            onChange={handleScopeChange}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
            <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">Investment:</span>
              <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.totalInvestment.toLocaleString('de-DE')} €
              </span>
            </div>
            <div>
              <span className="block text-sm text-[oklch(0.52_0.015_260)]">ROI (Monate):</span>
              <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.roiMonths}
              </span>
            </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte ROI-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
