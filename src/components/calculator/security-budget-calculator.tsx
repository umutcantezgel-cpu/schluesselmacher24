'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-security-budget';
import type { SecurityBudgetCalculationResult } from '@/types/security-budget';

const initialState: SecurityBudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleCalculateOptimistic() {
    startTransition(() => {
      const form = document.getElementById('security-form') as HTMLFormElement;
      if (!form) return;
      const formData = new FormData(form);
      const objectType = formData.get('objectType') as string;
      const doors = Number(formData.get('doors'));
      const windows = Number(formData.get('windows'));
      const video = formData.get('includeVideo') === 'on';
      const alarm = formData.get('includeAlarm') === 'on';

      let est = 0;
      if (objectType === 'wohnung') est += 500;
      if (objectType === 'einfamilienhaus') est += 1200;
      if (objectType === 'gewerbe') est += 2500;

      est += (doors * 250);
      est += (windows * 150);

      if (video) est += (objectType === 'gewerbe' ? 1800 : 800);
      if (alarm) est += (objectType === 'gewerbe' ? 2500 : 1200);

      setOptimisticTotal(est);
    });
  }

  return (
    <div style={{ viewTransitionName: 'security-calculator' }} className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Sicherheits-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Berechnen Sie einen ersten Richtwert für Ihre Sicherheitsausstattung.</p>

      <form id="security-form" action={formAction} className="mt-8 space-y-6" onChange={handleCalculateOptimistic}>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[oklch(0.32_0.02_260)]">Objektart</label>
            <select name="objectType" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="wohnung">Wohnung</option>
              <option value="einfamilienhaus">Einfamilienhaus</option>
              <option value="gewerbe">Gewerbeobjekt</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen (Eingang/Nebeneingang)</label>
            <input type="number" name="doors" defaultValue="1" min="1" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl ungesicherte Fenster (EG / leicht erreichbar)</label>
          <input type="range" name="windows" min="0" max="20" defaultValue="0" className="w-full accent-[oklch(0.52_0.24_260)]" />
          <div className="mt-2 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
            <span>0</span>
            <span>20</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="includeVideo" className="h-5 w-5 rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Videoüberwachung integrieren</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="includeAlarm" className="h-5 w-5 rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Alarmanlage & Meldetechnik</span>
          </label>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere exakten Wert...' : 'Detaillierte Aufschlüsselung anfordern'}
        </button>
      </form>

      {state.breakdown.length > 0 && !isPending && (
        <div className="mt-8 rounded-lg bg-white p-6 border border-[oklch(0.89_0.008_260/0.55)]">
          <h4 className="text-sm font-bold text-[oklch(0.16_0.02_260)] mb-4 uppercase tracking-wider">Kostendetails (Tier: {state.tier})</h4>
          <ul className="space-y-3">
            {state.breakdown.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)] border-b border-[oklch(0.89_0.008_260/0.2)] pb-2 last:border-0 last:pb-0">
                <span>{item.item}</span>
                <span className="font-semibold text-[oklch(0.16_0.02_260)]">{item.cost.toLocaleString('de-DE')} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
