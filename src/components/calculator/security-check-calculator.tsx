'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security';
import type { SecurityScoreResult } from '@/actions/calculate-security';

const initialState: SecurityScoreResult = {
  score: 0,
  recommendations: [],
  riskLevel: 'HIGH'
};

export function SecurityCheckCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);

  // Optimistic UI for toggles
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current: number, update: number) => Math.max(0, Math.min(100, current + update))
  );

  function handleToggle(valueToAdd: number, e: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      setOptimisticScore(valueToAdd);
    });
    // Trigger form action to ensure optimistic state persists until server responds
    e.target.form?.requestSubmit();
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-2">Interaktiver Sicherheits-Score</h3>
      <p className="text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)] mb-6">
        Überprüfen Sie den initialen Sicherheitsgrad Ihres Objekts. Dies ersetzt keine Vor-Ort-Analyse, bietet aber eine solide Ersteinschätzung.
      </p>

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="hasAlarm"
              className="w-5 h-5 accent-[oklch(0.52_0.24_260)] rounded border-[oklch(0.89_0.008_260/0.55)]"
              onChange={(e) => handleToggle(e.target.checked ? 20 : -20, e)}
            />
            <span className="text-[15px] font-medium text-[oklch(0.32_0.02_260)] group-hover:text-[oklch(0.16_0.02_260)] transition-colors motion-reduce:transition-none">
              Einbruchmeldeanlage (Alarm) vorhanden
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="hasVideo"
              className="w-5 h-5 accent-[oklch(0.52_0.24_260)] rounded border-[oklch(0.89_0.008_260/0.55)]"
              onChange={(e) => handleToggle(e.target.checked ? 15 : -15, e)}
            />
            <span className="text-[15px] font-medium text-[oklch(0.32_0.02_260)] group-hover:text-[oklch(0.16_0.02_260)] transition-colors motion-reduce:transition-none">
              Videoüberwachung aktiv
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="hasAccessControl"
              className="w-5 h-5 accent-[oklch(0.52_0.24_260)] rounded border-[oklch(0.89_0.008_260/0.55)]"
              onChange={(e) => handleToggle(e.target.checked ? 15 : -15, e)}
            />
            <span className="text-[15px] font-medium text-[oklch(0.32_0.02_260)] group-hover:text-[oklch(0.16_0.02_260)] transition-colors motion-reduce:transition-none">
              Elektronische Zutrittskontrolle installiert
            </span>
          </label>

          <div className="pt-2">
            <label className="block text-[14px] font-medium text-[oklch(0.32_0.02_260)] mb-1">
              Baujahr des Objekts (ca.)
            </label>
            <input
              type="number"
              name="yearBuilt"
              defaultValue="2010"
              className="w-full max-w-[200px] px-3 py-2 border border-[oklch(0.89_0.008_260/0.55)] rounded-lg bg-[oklch(0.988_0.002_260)] text-[15px] focus:outline-none focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] transition-all motion-reduce:transition-none"
            />
          </div>

        </div>

        <div className="border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="flex items-end justify-between mb-4">
             <span className="text-[14px] font-medium text-[oklch(0.32_0.02_260)]">Ihr Sicherheits-Score</span>
             <div className="text-right">
                <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">{optimisticScore === 0 && state.score === 0 ? '--' : optimisticScore}</span>
                <span className="text-[14px] text-[oklch(0.32_0.02_260)] ml-1">/ 100</span>
             </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 px-4 text-[15px] font-semibold text-white shadow-sm transition-all motion-reduce:transition-none hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? 'Analysiere Daten...' : 'Detaillierte Analyse anfordern'}
          </button>
        </div>
      </form>

      {state.score > 0 && !isPending && (
        <div className="mt-6 p-5 rounded-xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)]">
           <h4 className="text-[14px] font-bold uppercase tracking-wider text-[oklch(0.16_0.02_260)] mb-3">Auswertung</h4>

           <div className="mb-4">
              <span className="text-[13px] font-medium text-[oklch(0.32_0.02_260)]">Risikolevel: </span>
              <span className={`text-[13px] font-bold ${state.riskLevel === 'HIGH' ? 'text-red-600' : state.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {state.riskLevel === 'HIGH' ? 'Kritisch' : state.riskLevel === 'MEDIUM' ? 'Moderat' : 'Gut aufgestellt'}
              </span>
           </div>

           {state.recommendations.length > 0 && (
             <div>
                <p className="text-[13px] font-medium text-[oklch(0.32_0.02_260)] mb-2">Handlungsempfehlungen:</p>
                <ul className="space-y-2">
                  {state.recommendations.map((rec, i) => (
                    <li key={i} className="text-[13px] leading-relaxed text-[oklch(0.32_0.02_260)] flex gap-2">
                       <span className="text-[oklch(0.52_0.24_260)] mt-0.5">•</span>
                       <span>{rec}</span>
                    </li>
                  ))}
                </ul>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
