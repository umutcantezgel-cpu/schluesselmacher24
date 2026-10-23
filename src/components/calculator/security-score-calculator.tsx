'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security-score';
import type { SecurityScoreResult } from '@/types/security-score';

const initialState: SecurityScoreResult = {
  score: 0,
  tier: 'BASIC',
  recommendations: ['Wählen Sie Ihre aktuellen Sicherheitsmaßnahmen aus, um den Score zu berechnen.']
};

export function SecurityScoreCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);

  // Wir nutzen useOptimistic hier, um sofortiges Feedback bei Regleränderung zu geben
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleSliderChange(e: React.ChangeEvent<HTMLFormElement>) {
      const formData = new FormData(e.currentTarget);
      const mechanical = Number(formData.get('mechanical') || 0);
      const electronic = Number(formData.get('electronic') || 0);
      const video = Number(formData.get('video') || 0);
      const access = Number(formData.get('access') || 0);
      const monitoring = Number(formData.get('monitoring') || 0);

      const newScore = Math.round((mechanical * 30 + electronic * 25 + video * 15 + access * 15 + monitoring * 15) / 100);

      startTransition(() => {
          setOptimisticScore(newScore);
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktiver Sicherheits-Score</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Bewerten Sie Ihre aktuelle Ausstattung von 0 (kein Schutz) bis 100 (Maximale Absicherung).</p>

      <form action={formAction} onChange={handleSliderChange} className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
            <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Mechanischer Grundschutz</span>
            </label>
            <input
                type="range"
                name="mechanical"
                min="0"
                max="100"
                defaultValue="20"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            </div>

            <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Elektronische Überwachung (Alarm)</span>
            </label>
            <input
                type="range"
                name="electronic"
                min="0"
                max="100"
                defaultValue="0"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            </div>

            <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Videoüberwachung</span>
            </label>
            <input
                type="range"
                name="video"
                min="0"
                max="100"
                defaultValue="0"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            </div>

            <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Zutrittskontrolle</span>
            </label>
            <input
                type="range"
                name="access"
                min="0"
                max="100"
                defaultValue="10"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            </div>

            <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Leitstellen-Aufschaltung (NSL)</span>
            </label>
            <input
                type="range"
                name="monitoring"
                min="0"
                max="100"
                defaultValue="0"
                className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl bg-white p-6 border border-[oklch(0.89_0.008_260/0.55)]">
            <div>
                <span className="text-sm font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Ihr Score</span>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    {optimisticScore}
                    </span>
                    <span className="text-lg text-[oklch(0.32_0.02_260)]">/ 100</span>
                </div>

                <div className="mt-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
                    <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">Sofort-Empfehlungen:</h4>
                    <ul className="mt-3 text-sm text-[oklch(0.32_0.02_260)] space-y-2 list-disc pl-4">
                        {state.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
            >
            {isPending ? 'Analysiere...' : 'Detaillierte Analyse anfordern'}
            </button>
        </div>
      </form>
    </div>
  );
}
