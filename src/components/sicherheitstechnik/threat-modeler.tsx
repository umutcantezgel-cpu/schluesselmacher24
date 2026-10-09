'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateThreatScore, type ThreatCalculationResult } from '@/actions/calculate-threat-score';

const initialState: ThreatCalculationResult = {
  score: 0,
  riskLevel: 'LOW',
  recommendations: []
};

export function ThreatModeler() {
  const [state, formAction, isPending] = useActionState(calculateThreatScore, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleQuickEstimate() {
    startTransition(() => {
        // A simple visual bump to indicate activity before server response
        if (optimisticScore === 0) setOptimisticScore(50);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Security Threat Modeler</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Konfigurieren Sie Ihr Objektprofil für eine sofortige Risikoeinschätzung.</p>

      <form action={formAction} onChange={handleQuickEstimate} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Objektart</label>
              <select name="objectType" className="mt-1 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)]">
                  <option value="residential">Privathaushalt</option>
                  <option value="commercial">Gewerbe (Büro/Handel)</option>
                  <option value="industrial">Industrieanlage</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Lage & Umgebung</label>
              <select name="areaType" className="mt-1 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)]">
                  <option value="suburban">Vorstadt / Wohngebiet</option>
                  <option value="urban">Städtisch / Zentrum</option>
                  <option value="isolated">Abgelegen / Industriegebiet</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mechanischer Schutz</label>
              <select name="mechanicalSecurity" className="mt-1 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)]">
                  <option value="standard">Standard (z.B. einfache Zylinder)</option>
                  <option value="low">Veraltet / Mangelhaft</option>
                  <option value="high">Hoch (geprüfte Sicherheitstüren)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Elektronische Überwachung</label>
              <select name="electronicSecurity" className="mt-1 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)]">
                  <option value="none">Keine vorhanden</option>
                  <option value="basic">Basis (z.B. einfache Videoklingel)</option>
                  <option value="advanced">Umfassend (Alarm & Videoaufzeichnung)</option>
              </select>
            </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Gefährdungsscore (0-100):</span>
            <div className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticScore}
              {state.score > 0 && <span className="ml-2 text-lg font-medium text-[oklch(0.32_0.02_260)]">({state.riskLevel})</span>}
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Analysiere...' : 'Risikoprofil berechnen'}
          </button>
        </div>

        {state.recommendations.length > 0 && (
            <div className="mt-6 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
                <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-2">Handlungsempfehlungen:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-[oklch(0.32_0.02_260)]">
                    {state.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                    ))}
                </ul>
            </div>
        )}
      </form>
    </div>
  );
}
