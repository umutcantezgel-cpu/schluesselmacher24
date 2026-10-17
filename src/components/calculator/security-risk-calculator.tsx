'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityRisk, type SecurityRiskResult } from '@/actions/calculate-security-risk';

const initialState: SecurityRiskResult = {
  score: 50,
  riskLevel: 'MEDIUM',
  recommendations: ['Bitte füllen Sie das Formular aus, um eine erste Einschätzung zu erhalten.'],
};

export function SecurityRiskCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityRisk, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleScoreChange(value: number) {
    startTransition(() => {
      setOptimisticScore(value);
    });
  }

  return (
    <div
      className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] @container"
      style={{ viewTransitionName: 'security-risk-calculator' }}
    >
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Risiko-Ersteinschätzung</h3>
      <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm">
        Bewerten Sie vorab unverbindlich Ihr potenzielles Risiko basierend auf strukturellen Parametern.
      </p>
      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Gebäudealter (Jahre)</label>
            <input
              type="number"
              name="buildingAge"
              defaultValue="15"
              min="0"
              max="200"
              onChange={(e) => handleScoreChange(Math.max(0, 100 - Number(e.target.value)))}
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2 text-sm bg-[oklch(0.988_0.002_260)] text-[oklch(0.16_0.02_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Lage</label>
            <select name="areaType" className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2 text-sm bg-[oklch(0.988_0.002_260)] text-[oklch(0.16_0.02_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(0.52_0.24_260)]">
              <option value="urban">Städtisch (Urban)</option>
              <option value="suburban">Vorstadt (Suburban)</option>
              <option value="rural">Ländlich (Rural)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Außentüren</label>
            <input
              type="number"
              name="doorCount"
              defaultValue="1"
              min="1"
              max="20"
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2 text-sm bg-[oklch(0.988_0.002_260)] text-[oklch(0.16_0.02_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" name="hasAlarm" id="hasAlarm" className="h-4 w-4 accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[oklch(0.52_0.24_260)]" />
            <label htmlFor="hasAlarm" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alarmanlage vorhanden</label>
          </div>
        </div>

        <div className="flex flex-col border-t border-[oklch(0.89_0.008_260/0.55)] pt-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Sicherheits-Score (Optimistisch):</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticScore} / 100
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Echtes Risiko-Level:</span>
            <span className="text-lg font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.riskLevel}
            </span>
          </div>
          <div className="mt-4 text-sm text-[oklch(0.32_0.02_260)]">
            <strong>Unsere Empfehlungen:</strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {state.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
        >
          {isPending ? 'Berechne Risiko...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}
