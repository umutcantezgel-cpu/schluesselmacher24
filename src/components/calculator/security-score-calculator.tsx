'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security-score';
import type { SecurityScoreResult } from '@/actions/calculate-security-score';

const initialState: SecurityScoreResult = {
  score: 0,
  recommendations: [],
  status: 'LOW'
};

export function SecurityScoreCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleCalculate(e: React.ChangeEvent<HTMLFormElement>) {
      // Optmistic calculation for quick UI feedback
      const formData = new FormData(e.currentTarget);
      const hasMechanical = formData.get('hasMechanical') === 'on';
      const hasAlarm = formData.get('hasAlarm') === 'on';
      const hasVideo = formData.get('hasVideo') === 'on';

      let tempScore = 0;
      if (hasMechanical) tempScore += 40;
      if (hasAlarm) tempScore += 30;
      if (hasVideo) tempScore += 30;

      startTransition(() => {
        setOptimisticScore(tempScore);
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Sicherheits-Score</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie das aktuelle Schutzniveau Ihres Objekts und erhalten Sie direkte Handlungsempfehlungen.
      </p>

      <form action={formAction} onChange={handleCalculate} className="mt-8 space-y-6">
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="hasMechanical" className="h-5 w-5 rounded border-gray-300 accent-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mechanischer Grundschutz vorhanden (z.B. Sicherheitszylinder, Schutzbeschläge)</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="hasAlarm" className="h-5 w-5 rounded border-gray-300 accent-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alarmtechnik vorhanden</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="hasVideo" className="h-5 w-5 rounded border-gray-300 accent-[oklch(0.52_0.24_260)]" />
            <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Videoüberwachung installiert</span>
          </label>

          <div className="pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
             <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Objekttyp</label>
             <select name="propertyType" className="w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] p-2 bg-white text-sm">
               <option value="private">Privatimmobilie</option>
               <option value="commercial">Gewerbeobjekt</option>
             </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Ihr Sicherheits-Score:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticScore}/100
          </span>
        </div>

        {state.recommendations.length > 0 && !isPending && (
          <div className="mt-6 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-3">Unsere Empfehlungen:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
              {state.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Wird analysiert...' : 'Detaillierte Auswertung anfordern'}
        </button>
      </form>
    </div>
  );
}
