'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseRoiResult } from '@/types/enterprise-roi';

const initialState: EnterpriseRoiResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC',
  amortizationMonths: 0
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const doors = Number((form.elements.namedItem('doors') as HTMLInputElement)?.value || 10);
    const users = Number((form.elements.namedItem('users') as HTMLInputElement)?.value || 20);
    const locations = Number((form.elements.namedItem('locations') as HTMLInputElement)?.value || 1);

    startTransition(() => {
      setOptimisticTotal(doors * 250 + users * 30 + locations * 1000 + (users * 5 * 12));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] view-transition-name-roi-calc">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI & Ladezeit Kalkulator</h3>
      <form action={formAction} onChange={handleChange} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Türen</label>
            <input type="range" name="doors" min="1" max="500" defaultValue="10" className="w-full accent-[oklch(0.52_0.24_260)] motion-reduce:transition-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Nutzer</label>
            <input type="range" name="users" min="1" max="2000" defaultValue="20" className="w-full accent-[oklch(0.52_0.24_260)] motion-reduce:transition-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Standorte</label>
            <input type="range" name="locations" min="1" max="50" defaultValue="1" className="w-full accent-[oklch(0.52_0.24_260)] motion-reduce:transition-none" />
          </div>
        </div>

        <div className="grid grid-rows-subgrid gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 md:grid-cols-2">
          <div className="flex flex-col justify-between">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (TCO):</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="flex flex-col justify-between">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Amortisation in ca.:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.amortizationMonths > 0 ? `${state.amortizationMonths} Monaten` : '--'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Berechne...' : 'Detaillierte ROI-Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
