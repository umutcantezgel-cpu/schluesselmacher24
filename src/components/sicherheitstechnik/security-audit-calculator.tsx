'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateSecurityAudit, type AuditCalculationResult } from '@/lib/actions/calculate-security-audit';

const initialState: AuditCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SecurityAuditCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityAudit, initialState);

  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(0);
  const [propertyType, setPropertyType] = useState('residential');

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleOptimisticUpdate(currentDoors: number, currentWindows: number, currentPropertyType: string) {
    let base = 250;
    if (currentPropertyType === 'commercial') base = 500;
    if (currentPropertyType === 'industrial') base = 800;

    const newTotal = base + (currentDoors * 150) + (currentWindows * 80);
    startTransition(() => {
      setOptimisticTotal(newTotal);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Investitionsrechner: Sicherheitstechnik</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie einen ersten Richtwert für die mechanische und elektronische Absicherung Ihres Objekts.
      </p>

      <form action={formAction} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Objekttyp</label>
            <select
              name="propertyType"
              value={propertyType}
              onChange={(e) => {
                const val = e.target.value;
                setPropertyType(val);
                handleOptimisticUpdate(doors, windows, val);
              }}
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-2.5 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
              <option value="residential">Privathaushalt (Wohnung/Haus)</option>
              <option value="commercial">Gewerbe (Büro/Laden)</option>
              <option value="industrial">Industrieanlage</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl abzusichernder Türen</label>
            <input
              type="number"
              name="doors"
              min="1"
              max="50"
              value={doors}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDoors(val);
                handleOptimisticUpdate(val, windows, propertyType);
              }}
              className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-2.5 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Fenster / ebenerdige Zugänge</label>
            <input
              type="range"
              name="windows"
              min="0"
              max="40"
              value={windows}
              onChange={(e) => {
                const val = Number(e.target.value);
                setWindows(val);
                handleOptimisticUpdate(doors, val, propertyType);
              }}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-2 text-right text-sm font-semibold text-[oklch(0.52_0.24_260)]">
              {windows} Fenster/Zugänge
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Geschätztes Basisbudget:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="rounded-lg bg-[oklch(0.988_0.002_260)] p-4">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">Aufschlüsselung (Richtwert)</h4>
            <ul className="mt-3 space-y-2 text-[14px] text-[oklch(0.32_0.02_260)]">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className="font-semibold">{item.amount.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-block rounded-md bg-[oklch(0.89_0.008_260/0.55)] px-2.5 py-1 text-[12px] font-bold text-[oklch(0.16_0.02_260)]">
              Sicherheitsstufe: {state.tier}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exakte Aufstellung...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
