'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget, type SecurityBudgetResult, type SecurityTier } from '@/actions/calculate-security-budget';

const initialState: SecurityBudgetResult = {
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

  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors') || 1);
    const windows = Number(formData.get('windows') || 0);
    const includeVideo = formData.get('video') === 'on';
    const includeAlarm = formData.get('alarm') === 'on';
    const tier = (formData.get('tier') as SecurityTier) || 'BASIC';

    let multiplier = 1;
    if (tier === 'ADVANCED') multiplier = 1.5;
    if (tier === 'HIGH_END') multiplier = 2.5;

    const total = (doors * 300 + windows * 150 + (includeVideo ? 800 : 0) + (includeAlarm ? 1200 : 0)) * multiplier;

    startTransition(() => {
      setOptimisticTotal(total);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Sicherheits-Budget-Rechner</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Kalkulieren Sie eine erste Richtgröße für Ihre Sicherheitsausstattung.</p>

      <form action={formAction} onChange={handleFormChange} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
            <input
              type="number"
              name="doors"
              min="1"
              max="20"
              defaultValue="1"
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2 text-[oklch(0.16_0.02_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Fenster/Zugänge</label>
            <input
              type="number"
              name="windows"
              min="0"
              max="50"
              defaultValue="0"
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2 text-[oklch(0.16_0.02_260)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Sicherheitsstufe</label>
            <select name="tier" defaultValue="BASIC" className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2 text-[oklch(0.16_0.02_260)]">
              <option value="BASIC">Grundschutz (Mechanik)</option>
              <option value="ADVANCED">Erweiterter Schutz (Smart)</option>
              <option value="HIGH_END">Hochsicherheit (Kombiniert)</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2 mt-6 md:mt-0 justify-center">
            <label className="inline-flex items-center">
              <input type="checkbox" name="video" className="rounded border-gray-300 text-[oklch(0.52_0.24_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:ring focus:ring-[oklch(0.52_0.24_260)] focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-[oklch(0.32_0.02_260)]">Videoüberwachung</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" name="alarm" className="rounded border-gray-300 text-[oklch(0.52_0.24_260)] shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:ring focus:ring-[oklch(0.52_0.24_260)] focus:ring-opacity-50" />
              <span className="ml-2 text-sm text-[oklch(0.32_0.02_260)]">Alarmanlage integrieren</span>
            </label>
          </div>
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
          {isPending ? 'Kalkuliere...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}
