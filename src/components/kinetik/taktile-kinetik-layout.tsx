'use client';

import { useActionState, useOptimistic, startTransition, type ReactNode } from 'react';
import { submitKinetikSimulation } from '@/actions/kinetik-action';

interface KinetikState {
  success: boolean;
  score: number;
  message: string;
}

const initialState: KinetikState = {
  success: false,
  score: 0,
  message: ''
};

export function TaktileKinetikLayout({ children }: { children: ReactNode }) {
  const [state, formAction, isPending] = useActionState(submitKinetikSimulation, initialState);

  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleComplexityChange(val: number) {
    startTransition(() => {
      setOptimisticScore(val * 10);
    });
  }

  return (
    <div className="relative isolate group">
      {/* Taktile Kinetik Grid-Umgebung (Swiss Light Mode & Bento) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all duration-500 ease-out hover:shadow-[0_16px_40px_-8px_oklch(0.16_0.02_260/0.08)] @container">
            {children}
          </div>

          <div className="rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-[0_4px_12px_-2px_oklch(0.16_0.02_260/0.02)] flex flex-col">
            <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight mb-4">
              Kinetische Simulation
            </h3>
            <p className="text-sm text-[oklch(0.32_0.02_260)] leading-relaxed mb-8">
              Justieren Sie die Systemkomplexität der Code-Berechnung, um die taktile Reaktionsfähigkeit des Modells live zu erfahren.
            </p>

            <form action={formAction} className="mt-auto space-y-6">
              <div>
                <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
                  <span>Komplexitätsgrad</span>
                  <span>{optimisticScore > 0 ? (optimisticScore / 10).toFixed(1) : '1.0'}</span>
                </label>
                <input
                  type="range"
                  name="complexity"
                  min="1"
                  max="10"
                  step="0.5"
                  defaultValue="1"
                  onChange={(e) => handleComplexityChange(Number(e.target.value))}
                  className="w-full mt-3 accent-[oklch(0.52_0.24_260)] transition-all"
                />
              </div>

              <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-5">
                <span className="text-sm text-[oklch(0.52_0.015_260)]">Berechnungs-Score:</span>
                <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] tabular-nums">
                  {optimisticScore}
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.98] disabled:opacity-50 hover:shadow-[0_8px_16px_-4px_oklch(0.52_0.24_260/0.4)]"
              >
                {isPending ? 'Simuliere Physik...' : 'Federdämpfung analysieren'}
              </button>
            </form>

            {state.message && (
              <div className="mt-4 p-3 rounded-lg bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)]">
                <p className="text-xs text-[oklch(0.32_0.02_260)] text-center">{state.message}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
