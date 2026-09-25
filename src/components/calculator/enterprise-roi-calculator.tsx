'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRoi, type RoiResult } from '@/lib/actions/estimate-roi';

const initialState: RoiResult = {
  savings: 0,
  roiYears: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic<RoiResult, Partial<RoiResult>>(
    state,
    (current, update) => ({ ...current, ...update })
  );


  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;

    const employees = Number((form.elements.namedItem('employees') as HTMLInputElement)?.value) || 20;
    const turnoverRate = Number((form.elements.namedItem('turnoverRate') as HTMLInputElement)?.value) || 5;

    const costPerLostKey = 1500;
    const annualLostKeys = Math.max(1, (employees * (turnoverRate / 100)) * 0.1);
    const annualSavings = annualLostKeys * costPerLostKey;

    startTransition(() => {
      setOptimisticState({ savings: annualSavings, roiYears: Math.max(0.5, 10000 / annualSavings) });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]" style={{ viewTransitionName: 'enterprise-roi-calculator' }}>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">ROI Kalkulator</h3>
      <form action={formAction} className="mt-6 grid grid-rows-[subgrid] gap-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen / Schließstellen</label>
          <input type="range" name="doors" min="10" max="500" defaultValue="50" onChange={handleScopeChange} className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Mitarbeiter</label>
          <input type="range" name="employees" min="10" max="1000" defaultValue="100" onChange={handleScopeChange} className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mitarbeiterfluktuation (%)</label>
          <input type="range" name="turnoverRate" min="1" max="25" defaultValue="5" onChange={handleScopeChange} className="w-full accent-[oklch(0.52_0.24_260)]" />
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Potenzielle Einsparung p.a.:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticState.savings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
        <button type="submit" disabled={isPending} className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50">
          {isPending ? 'Berechne...' : 'Exakte Kalkulation anfordern'}
        </button>
      </form>
    </div>
  );
}
