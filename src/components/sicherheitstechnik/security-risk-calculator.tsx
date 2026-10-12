'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security-score';

export type SecurityScoreResult = {
  score: number;
  level: string;
  recommendations: string[];
};

const initialState: SecurityScoreResult = {
  score: 0,
  level: 'Unbekannt',
  recommendations: []
};

export function SecurityRiskCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleScoreChange() {
    startTransition(() => {
      // Very rough optimistic update
      setOptimisticScore(50);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Objekt-Risikoanalyse</h3>
      <form action={formAction} className="mt-6 space-y-6" onChange={handleScoreChange}>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Objekttyp</label>
            <select name="objectType" className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="apartment">Wohnung</option>
              <option value="house">Einfamilienhaus</option>
              <option value="business">Gewerbeobjekt</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Lage</label>
            <select name="location" className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="urban">Stadtgebiet (dicht besiedelt)</option>
              <option value="suburban">Vorstadt / Wohngebiet</option>
              <option value="rural">Ländlich / Abgelegen</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Vorhandene Sicherung</label>
            <select name="currentSecurity" className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="none">Keine / Standard (mechanisch)</option>
              <option value="basic">Einfache Zusatzschlösser</option>
              <option value="advanced">Alarmanlage / Video vorhanden</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Werte im Objekt</label>
            <select name="valuables" className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="standard">Durchschnittlich</option>
              <option value="high">Erhöht (Schmuck, Kunst, Technik)</option>
              <option value="very_high">Sehr hoch / Geschäftswerte</option>
            </select>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Risiko-Score (0-100):</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticScore > 0 ? optimisticScore : state.score}
          </span>
        </div>

        {state.score > 0 && (
          <div className="mt-4 rounded-lg bg-white p-4">
            <p className="font-semibold text-[oklch(0.16_0.02_260)]">Empfohlene Schutzklasse: {state.level}</p>
            <ul className="mt-2 list-inside list-disc text-sm text-[oklch(0.32_0.02_260)]">
              {state.recommendations.map((rec, i) => (
                <li key={i} className="mt-1">{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Analysiere Risikoprofil...' : 'Detaillierte Analyse berechnen'}
        </button>
      </form>
    </div>
  );
}
