'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-enterprise-roi';
import type { RoiCalculationResult } from '@/types/enterprise-roi';

const initialState: RoiCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;

    const doors = Number((form.elements.namedItem('doors') as HTMLInputElement)?.value || 0);
    const users = Number((form.elements.namedItem('users') as HTMLInputElement)?.value || 0);

    startTransition(() => {
      const estimatedCost = (doors * 250) + (users * 45) + (doors > 50 ? 1500 : 500);
      setOptimisticTotal(estimatedCost);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Investitions-Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie mit unserem Rechner eine erste Kostenschätzung für Ihre Schließanlage. Die Berechnung basiert auf unseren Durchschnittswerten.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Türen (Schließstellen)</span>
              <span className="font-bold text-[oklch(0.16_0.02_260)]" id="doors-output">10</span>
            </label>
            <input
              type="range"
              name="doors"
              min="1"
              max="200"
              defaultValue="10"
              onChange={(e) => {
                const out = document.getElementById('doors-output');
                if (out) out.textContent = e.target.value;
                handleSliderChange(e);
              }}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Nutzer (Schlüssel/Medien)</span>
              <span className="font-bold text-[oklch(0.16_0.02_260)]" id="users-output">20</span>
            </label>
            <input
              type="range"
              name="users"
              min="1"
              max="500"
              defaultValue="20"
              onChange={(e) => {
                const out = document.getElementById('users-output');
                if (out) out.textContent = e.target.value;
                handleSliderChange(e);
              }}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Geschätztes Budget:</span>
            <span className="mt-1 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]" style={{ viewTransitionName: 'roi-total' }}>
              {optimisticTotal.toLocaleString('de-DE')} €
            </span>
            <span className="mt-1 block text-xs text-[oklch(0.52_0.015_260)]">Zzgl. gesetzl. MwSt.</span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            {isPending ? 'Kalkuliere exakt...' : 'Detaillierte Analyse anfordern'}
          </button>
        </div>
      </form>

      {state.breakdown.length > 0 && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 motion-reduce:animate-none">
          <h4 className="text-sm font-bold text-[oklch(0.16_0.02_260)]">Detailaufschlüsselung</h4>
          <ul className="mt-3 space-y-2">
            {state.breakdown.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)]">
                <span>{item.label}</span>
                <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
