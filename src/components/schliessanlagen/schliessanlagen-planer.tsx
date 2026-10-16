'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateAnlagenBudget } from '@/actions/calculate-anlagen';

export function SchliessanlagenPlaner() {
  const [state, formAction, isPending] = useActionState(calculateAnlagenBudget, {
    totalEstimate: 0,
    breakdown: [],
    tier: 'Z'
  });

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleEstimateChange() {
    const form = document.getElementById('anlagen-planer-form') as HTMLFormElement;
    if (!form) return;

    const doors = Number((form.elements.namedItem('doors') as HTMLInputElement).value) || 0;
    const users = Number((form.elements.namedItem('users') as HTMLInputElement).value) || 0;
    const complexity = (form.elements.namedItem('complexity') as HTMLSelectElement).value;

    let basePrice = 45;
    let keyPrice = 12;
    if (complexity === 'HS') { basePrice = 75; keyPrice = 18; }
    if (complexity === 'GHS') { basePrice = 120; keyPrice = 25; }

    startTransition(() => {
      setOptimisticTotal(doors * basePrice + users * keyPrice);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]"
      style={{ viewTransitionName: "schliessanlagen-planer-module" }}>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktiver Schließanlagen-Planer</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Nutzen Sie unseren Kalkulator, um einen ersten Richtwert für Ihre Anlage zu berechnen.</p>
      <form id="anlagen-planer-form" action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen (Zylinder)</label>
          <input
            type="range"
            name="doors"
            min="1"
            max="100"
            defaultValue="5"
            onChange={handleEstimateChange}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
            <span>1</span><span>100</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Schlüssel (Nutzer)</label>
          <input
            type="range"
            name="users"
            min="1"
            max="200"
            defaultValue="10"
            onChange={handleEstimateChange}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)]">
            <span>1</span><span>200</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Komplexität der Anlage</label>
          <select
            name="complexity"
            onChange={handleEstimateChange}
            className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          >
            <option value="Z">Zentralschlossanlage (Z)</option>
            <option value="HS">Hauptschlüsselanlage (HS)</option>
            <option value="GHS">Generalhauptschlüsselanlage (GHS)</option>
          </select>
        </div>
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung berechnen'}
        </button>
      </form>
    </div>
  );
}
