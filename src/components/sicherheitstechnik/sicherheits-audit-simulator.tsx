'use client';

import { useActionState, useOptimistic, startTransition } from 'react';

// Mock types and actions for the module to build and test
export type AuditLevel = 'BASIC' | 'ENHANCED' | 'MAXIMUM';
export type AuditResult = {
  score: number;
  recommendations: string[];
  level: AuditLevel;
};

const initialState: AuditResult = {
  score: 0,
  recommendations: [],
  level: 'BASIC'
};

async function calculateAuditScore(prevState: AuditResult, formData: FormData): Promise<AuditResult> {
  const propertyType = formData.get('propertyType') as string;
  const accessPoints = Number(formData.get('accessPoints') || 1);
  const currentSystems = formData.getAll('currentSystems');

  let score = 30; // Baseline
  if (propertyType === 'commercial') score += 20;
  if (accessPoints > 3) score -= 10;
  score += currentSystems.length * 15;

  score = Math.min(Math.max(score, 0), 100);

  let level: AuditLevel = 'BASIC';
  if (score > 75) level = 'MAXIMUM';
  else if (score > 50) level = 'ENHANCED';

  return {
    score,
    recommendations: ['Rüsten Sie eine Videoüberwachung nach.', 'Sichern Sie alle Fenster im Erdgeschoss.'],
    level
  };
}

export function SicherheitsAuditSimulator() {
  const [state, formAction, isPending] = useActionState(calculateAuditScore, initialState);

  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleQuickChange() {
    startTransition(() => {
      setOptimisticScore(50); // Just a quick optimistic update demo
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Audit Simulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Ermitteln Sie mit wenigen Angaben den grundlegenden Sicherheitsbedarf für Ihr Objekt.
      </p>

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Objektart</label>
            <select
              name="propertyType"
              className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-[oklch(0.16_0.02_260)] outline-none focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              onChange={handleQuickChange}
            >
              <option value="residential">Privathaushalt</option>
              <option value="commercial">Gewerbeobjekt</option>
              <option value="industrial">Industrieanlage</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Zugangspunkte (Türen/Fenster EG)</label>
            <input
              type="number"
              name="accessPoints"
              min="1"
              defaultValue="4"
              className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-[oklch(0.16_0.02_260)] outline-none focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              onChange={handleQuickChange}
            />
          </div>
        </div>

        <div className="border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-3">Bereits vorhandene Systeme</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Alarmanlage', 'Videoüberwachung', 'Sicherheitsschlösser'].map((sys) => (
              <label key={sys} className="flex items-center space-x-2">
                <input type="checkbox" name="currentSystems" value={sys} className="rounded border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" onChange={handleQuickChange} />
                <span className="text-sm text-[oklch(0.32_0.02_260)]">{sys}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 pb-2">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Audit-Score Indikator:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticScore} <span className="text-lg text-[oklch(0.52_0.015_260)] font-normal">/ 100</span>
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Analysiere...' : 'Detailliertes Audit durchführen'}
        </button>
      </form>

      {state.score > 0 && !isPending && (
        <div className="mt-6 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
          <h4 className="font-semibold text-[oklch(0.16_0.02_260)] mb-2">Erste Empfehlungen ({state.level}):</h4>
          <ul className="list-disc pl-5 text-sm text-[oklch(0.32_0.02_260)] space-y-1.5">
            {state.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
