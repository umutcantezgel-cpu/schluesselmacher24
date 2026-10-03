'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurity } from '@/lib/actions/calculate-security';
import type { SecurityCalculationResult } from '@/lib/actions/calculate-security';

const initialState: SecurityCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SecurityConfigurator() {
  const [state, formAction, isPending] = useActionState(calculateSecurity, initialState);

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleCalculate(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors') || 1);
    const windows = Number(formData.get('windows') || 0);
    const alarm = formData.get('includeAlarm') === 'on';
    const camera = formData.get('includeCamera') === 'on';

    let estimated = (doors * 250) + (windows * 150);
    if (alarm) estimated += 800;
    if (camera) estimated += 1200;

    startTransition(() => {
      setOptimisticTotal(estimated);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Konfigurator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie einen ersten Richtwert für Ihre Sicherheitsausstattung.
      </p>

      <form action={formAction} onChange={handleCalculate} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
            <input
              type="range"
              name="doors"
              min="1"
              max="10"
              defaultValue="1"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>1</span><span>10</span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Fenster (Erdgeschoss)</label>
            <input
              type="range"
              name="windows"
              min="0"
              max="20"
              defaultValue="4"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
             <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>0</span><span>20</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="includeAlarm" className="h-5 w-5 rounded accent-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Basis-Alarmsystem integrieren</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="includeCamera" className="h-5 w-5 rounded accent-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Videoüberwachung (Eingangsbereich)</span>
          </label>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            ab {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne Details...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>

        {state.breakdown.length > 0 && !isPending && (
           <div className="mt-6 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
              <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-3">Zusammenfassung ({state.tier})</h4>
              <ul className="space-y-2">
                {state.breakdown.map((item, idx) => (
                   <li key={idx} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)]">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.cost.toLocaleString('de-DE')} €</span>
                   </li>
                ))}
              </ul>
           </div>
        )}
      </form>
    </div>
  );
}
