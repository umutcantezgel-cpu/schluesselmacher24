'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore } from '@/actions/calculate-security-score';
import type { SecurityScoreResult } from '@/actions/calculate-security-score';
import { ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

const initialState: SecurityScoreResult = {
  score: 30,
  recommendations: [],
  status: 'LOW'
};

export function SecurityScoreCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleScorePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.closest('form');
    if (!form) return;

    let previewScore = 30;
    if ((form.elements.namedItem('mechanical') as HTMLInputElement).checked) previewScore += 30;
    if ((form.elements.namedItem('electronic') as HTMLInputElement).checked) previewScore += 25;
    if ((form.elements.namedItem('video') as HTMLInputElement).checked) previewScore += 15;

    startTransition(() => {
      setOptimisticScore(previewScore);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260)] text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Sicherheits-Index</h3>
          <p className="text-sm text-[oklch(0.32_0.02_260)]">Prüfen Sie Ihr aktuelles Schutzniveau</p>
        </div>
      </div>

      <form action={formAction} className="mt-8 space-y-6">
        <div className="space-y-4">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="flex items-center h-6">
              <input type="checkbox" name="mechanical" value="yes" onChange={handleScorePreview} className="w-5 h-5 rounded border-[oklch(0.89_0.008_260)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
            <div>
              <p className="font-semibold text-[oklch(0.16_0.02_260)]">Mechanischer Grundschutz</p>
              <p className="text-sm text-[oklch(0.32_0.02_260)]">Sicherheitszylinder, Schutzbeschläge, Zusatzschlösser an Türen und Fenstern.</p>
            </div>
          </label>

          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="flex items-center h-6">
              <input type="checkbox" name="electronic" value="yes" onChange={handleScorePreview} className="w-5 h-5 rounded border-[oklch(0.89_0.008_260)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
            <div>
              <p className="font-semibold text-[oklch(0.16_0.02_260)]">Meldetechnik / Alarmanlage</p>
              <p className="text-sm text-[oklch(0.32_0.02_260)]">Bewegungsmelder, Öffnungskontakte und Sirenen zur Abschreckung.</p>
            </div>
          </label>

          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="flex items-center h-6">
              <input type="checkbox" name="video" value="yes" onChange={handleScorePreview} className="w-5 h-5 rounded border-[oklch(0.89_0.008_260)] text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
            <div>
              <p className="font-semibold text-[oklch(0.16_0.02_260)]">Videoüberwachung</p>
              <p className="text-sm text-[oklch(0.32_0.02_260)]">Kamerasysteme für Außenbereiche und Eingänge mit Aufzeichnung.</p>
            </div>
          </label>
        </div>

        <div className="flex items-end justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div>
            <span className="block text-sm text-[oklch(0.32_0.02_260)] mb-1">Ihr Index-Wert:</span>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticScore}
              </span>
              <span className="text-lg text-[oklch(0.32_0.02_260)]">/ 100</span>
            </div>
          </div>

          <div className="flex-1 max-w-[200px] ml-6">
            <div className="h-3 w-full bg-[oklch(0.89_0.008_260)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[oklch(0.52_0.24_260)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${optimisticScore}%` }}
              />
            </div>
          </div>
        </div>

        {state.recommendations.length > 0 && !isPending && (
          <div className="mt-6 rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.55)]">
            <p className="font-semibold text-[oklch(0.16_0.02_260)] mb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[oklch(0.52_0.24_260)]" />
              Handlungsempfehlungen
            </p>
            <ul className="space-y-2">
              {state.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-[oklch(0.32_0.02_260)] flex items-start gap-2">
                  <span className="text-[oklch(0.52_0.24_260)] mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-[0_2px_8px_-2px_oklch(0.52_0.24_260/0.4)] transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100"
        >
          {isPending ? 'Wird analysiert...' : 'Detaillierte Analyse anfordern'}
          {!isPending && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}
