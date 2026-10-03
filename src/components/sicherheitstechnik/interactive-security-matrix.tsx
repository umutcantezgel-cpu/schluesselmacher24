'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { calculateSecurityScore, type SecurityScoreState } from '@/lib/actions/calculate-security-score';

const initialState: SecurityScoreState = {
  score: 0,
  recommendations: [],
  status: 'IDLE'
};

export function InteractiveSecurityMatrix() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleCalculate(formData: FormData) {
    const door = parseInt(formData.get('doorSecurity') as string || '0', 10);
    const window = parseInt(formData.get('windowSecurity') as string || '0', 10);
    const access = parseInt(formData.get('accessControl') as string || '0', 10);
    const video = parseInt(formData.get('videoSurveillance') as string || '0', 10);
    const alarm = parseInt(formData.get('alarmSystem') as string || '0', 10);

    let simulated = 0;
    simulated += door * 30;
    simulated += window * 25;
    simulated += access * 15;
    simulated += alarm * 20;
    simulated += video * 10;

    const finalSim = Math.min(100, Math.max(0, simulated));

    startTransition(() => {
      setOptimisticScore(finalSim);
    });
  }

  function handleInputChange() {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      handleCalculate(formData);
    }
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] view-transition-name-[security-matrix]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Interaktive Sicherheitsmatrix & Audit
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Bewerten Sie den aktuellen Ausstattungsgrad Ihres Objekts. Bewegen Sie die Regler, um Ihren Sicherheits-Score in Echtzeit zu ermitteln.
      </p>

      <form ref={formRef} action={formAction} className="mt-8 space-y-6">

        <div className="grid gap-6 md:grid-cols-2">
          {/* Mechanical Security */}
          <div className="space-y-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Mechanischer Grundschutz</h4>

            <div className="space-y-1.5">
              <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
                <span>Türsicherheit</span>
                <span className="text-[oklch(0.32_0.02_260)]">0-2 Punkte</span>
              </label>
              <input
                type="range"
                name="doorSecurity"
                min="0"
                max="2"
                defaultValue="0"
                onChange={handleInputChange}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <p className="text-[12px] text-[oklch(0.52_0.015_260)]">Standard (0) bis Mehrfachverriegelung (2)</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
                <span>Fenstersicherheit</span>
                <span className="text-[oklch(0.32_0.02_260)]">0-2 Punkte</span>
              </label>
              <input
                type="range"
                name="windowSecurity"
                min="0"
                max="2"
                defaultValue="0"
                onChange={handleInputChange}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <p className="text-[12px] text-[oklch(0.52_0.015_260)]">Ungesichert (0) bis Zusatzschlösser (2)</p>
            </div>
          </div>

          {/* Electronic Security */}
          <div className="space-y-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Meldetechnik & Zutritt</h4>

            <div className="space-y-1.5">
              <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
                <span>Zutrittskontrolle</span>
                <span className="text-[oklch(0.32_0.02_260)]">0-1 Punkte</span>
              </label>
              <input
                type="range"
                name="accessControl"
                min="0"
                max="1"
                defaultValue="0"
                onChange={handleInputChange}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
                <span>Alarmanlage</span>
                <span className="text-[oklch(0.32_0.02_260)]">0-1 Punkte</span>
              </label>
              <input
                type="range"
                name="alarmSystem"
                min="0"
                max="1"
                defaultValue="0"
                onChange={handleInputChange}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
                <span>Videoüberwachung</span>
                <span className="text-[oklch(0.32_0.02_260)]">0-1 Punkte</span>
              </label>
              <input
                type="range"
                name="videoSurveillance"
                min="0"
                max="1"
                defaultValue="0"
                onChange={handleInputChange}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 md:flex-row md:items-start">
          <div className="flex-1">
            <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Simulierter Sicherheits-Score:</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tighter text-[oklch(0.16_0.02_260)]">
                {optimisticScore}
              </span>
              <span className="text-lg font-medium text-[oklch(0.32_0.02_260)]">/ 100</span>
            </div>

            {/* Score Indicator Bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[oklch(0.89_0.008_260/0.55)]">
              <div
                className="h-full bg-[oklch(0.52_0.24_260)] transition-all duration-300 ease-out"
                style={{ width: `${optimisticScore}%` }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto min-w-[240px] rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Audit wird analysiert...' : 'Detailliertes Audit anfordern'}
          </button>
        </div>
      </form>

      {/* Dynamic Results Area */}
      {(state.status === 'COMPLETED' || isPending) && (
        <div className={`mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6">
            <h4 className="text-[15px] font-bold text-[oklch(0.16_0.02_260)]">Audit-Ergebnisse & Handlungsempfehlungen</h4>
            {state.recommendations.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {state.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[oklch(0.968_0.004_260)] text-[12px] font-bold text-[oklch(0.52_0.24_260)]">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[14px] text-[oklch(0.32_0.02_260)]">Die Analyse läuft oder es wurden keine spezifischen Empfehlungen generiert.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
