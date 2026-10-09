'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security-score';

export function SecurityMatrix() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, {
    score: 0,
    recommendation: 'Bitte beantworten Sie die Fragen zur Einschätzung.',
    level: 'STANDARD'
  });

  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleChange(form: HTMLFormElement) {
    const formData = new FormData(form);
    let newScore = 0;
    if (formData.get('doorLock') === 'high') newScore += 30;
    if (formData.get('doorLock') === 'medium') newScore += 15;
    if (formData.get('alarm') === 'yes') newScore += 30;
    if (formData.get('video') === 'yes') newScore += 20;
    if (formData.get('access') === 'electronic') newScore += 20;

    startTransition(() => {
      setOptimisticScore(newScore);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Sicherheitsmatrix</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Bewerten Sie Ihre aktuelle Sicherheitsinfrastruktur, um eine sofortige Einschätzung und Empfehlung zu erhalten.
      </p>

      <form
        action={formAction}
        onChange={(e) => handleChange(e.currentTarget)}
        className="mt-6 space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2 md:grid-rows-[subgrid]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Türabsicherung</label>
            <select name="doorLock" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-2.5 text-sm">
              <option value="low">Standard-Zylinder (kein Bohrschutz)</option>
              <option value="medium">Sicherheitszylinder mit Schutzbeschlag</option>
              <option value="high">Hochsicherheitszylinder & Mehrfachverriegelung</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alarmanlage</label>
            <select name="alarm" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-2.5 text-sm">
              <option value="no">Nicht vorhanden</option>
              <option value="yes">Professionelle Einbruchmeldeanlage</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Videoüberwachung</label>
            <select name="video" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-2.5 text-sm">
              <option value="no">Nicht vorhanden</option>
              <option value="yes">IP-Videosystem mit Aufzeichnung</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Zutrittskontrolle</label>
            <select name="access" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] p-2.5 text-sm">
              <option value="mechanical">Rein mechanisch (Schlüssel)</option>
              <option value="electronic">Elektronisch (Transponder/Code/App)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-4">
          <div>
            <span className="text-sm text-[oklch(0.52_0.015_260)] block mb-1">Sicherheits-Score:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticScore}
              </span>
              <span className="text-sm text-[oklch(0.32_0.02_260)]">/ 100</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Analysiere...' : 'Detaillierte Analyse anfordern'}
          </button>
        </div>

        {state.score > 0 && !isPending && (
          <div className="mt-4 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <p className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Empfehlung:</p>
            <p className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">{state.recommendation}</p>
          </div>
        )}
      </form>
    </div>
  );
}
