
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { analyzeProfile } from '@/actions/analyze-profile';

type ProfileAnalysisResult = {
  status: 'IDLE' | 'ANALYZING' | 'SUCCESS';
  confidence: number;
  message: string;
};

const initialState: ProfileAnalysisResult = {
  status: 'IDLE',
  confidence: 0,
  message: 'Warten auf Eingabe...'
};

export function BentoMatrix() {
  const [state, formAction, isPending] = useActionState(analyzeProfile, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<ProfileAnalysisResult>) => ({ ...current, ...update })
  );

  function handleFeatureToggle() {
    startTransition(() => {
      setOptimisticState({ status: 'ANALYZING', message: 'Echtzeit-Berechnung...', confidence: Math.floor(Math.random() * 20) + 70 });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none transition-all duration-500 hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Profilbestimmungs-Matrix</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">Nutzen Sie dieses Werkzeug, um eine erste Einschätzung der Fräspräzision und Machbarkeit zu erhalten.</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-[oklch(0.32_0.02_260)]">
            <input type="checkbox" name="hasMilling" onChange={handleFeatureToggle} className="accent-[oklch(0.52_0.24_260)]" />
            Tiefe Fräsung vorhanden
          </label>
          <label className="flex items-center gap-2 text-sm text-[oklch(0.32_0.02_260)]">
            <input type="checkbox" name="hasText" onChange={handleFeatureToggle} className="accent-[oklch(0.52_0.24_260)]" />
            Prägung lesbar
          </label>
          <label className="flex items-center gap-2 text-sm text-[oklch(0.32_0.02_260)]">
            <input type="checkbox" name="isElectronic" onChange={handleFeatureToggle} className="accent-[oklch(0.52_0.24_260)]" />
            Transponder integriert
          </label>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Machbarkeits-Konfidenz:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticState.confidence}%
          </span>
        </div>

        <p className="text-xs text-[oklch(0.32_0.02_260)] italic">{optimisticState.message}</p>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
        >
          {isPending ? 'Analysiere Profil...' : 'Tiefe Matrix-Analyse starten'}
        </button>
      </form>
    </div>
  );
}
