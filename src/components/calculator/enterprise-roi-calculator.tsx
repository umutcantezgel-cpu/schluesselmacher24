'use client';
import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRoiBudget } from '@/actions/calculate-roi-budget';
import type { RoiBudgetCalculationResult } from '@/types/roi-budget';
const initialState: RoiBudgetCalculationResult = { totalEstimate: 0, breakdown: [], tier: 'STANDARD', roiTimeMonths: 12 };
export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateRoiBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(state.totalEstimate, (current, update: number) => update);
  const [optimisticROI, setOptimisticROI] = useOptimistic(state.roiTimeMonths, (current, update: number) => update);
  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150);
      setOptimisticROI(Math.max(1, Math.round(12 - (value / 5))));
    });
  }
  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid grid-rows-subgrid motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- und Investitionskalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie die voraussichtlichen Kosten und die Amortisationszeit (ROI) Ihrer neuen Schließanlage.</p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Projektumfang (Türen/Schließstellen)</label>
          <input type="range" name="scopeDays" min="5" max="200" defaultValue="15" onChange={(e) => handleScopeChange(Number(e.target.value))} className="w-full accent-[oklch(0.52_0.24_260)]" />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1"><span>5 Türen</span><span>200 Türen</span></div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">{optimisticTotal.toLocaleString('de-DE')} €</span>
        </div>
         <div className="flex items-baseline justify-between">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Erwarteter ROI nach:</span>
          <span className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">{optimisticROI} Monaten</span>
        </div>
        <button type="submit" disabled={isPending} className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none">
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
