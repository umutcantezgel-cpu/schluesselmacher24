'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityScore, type SecurityScoreResult } from '@/actions/calculate-security-score';

const initialState: SecurityScoreResult = {
  score: 0,
  recommendations: [],
  tier: 'BASIC'
};

export function SecurityCheckCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);
  const [optimisticScore, setOptimisticScore] = useOptimistic(
    state.score,
    (current, update: number) => update
  );

  function handleScoreChange(form: HTMLFormElement) {
    const formData = new FormData(form);
    const q1 = parseInt(formData.get('q1') as string || '0', 10);
    const q2 = parseInt(formData.get('q2') as string || '0', 10);
    const q3 = parseInt(formData.get('q3') as string || '0', 10);
    const q4 = parseInt(formData.get('q4') as string || '0', 10);

    startTransition(() => {
      setOptimisticScore(q1 + q2 + q3 + q4);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12" style={{ viewTransitionName: 'security-calculator' }}>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-2">Interaktiver Sicherheits-Score</h3>
      <p className="text-[oklch(0.32_0.02_260)] text-sm mb-8 leading-relaxed">
        Beantworten Sie vier kurze Fragen zu Ihrer aktuellen Objektabsicherung, um eine sofortige Einschätzung und erste Handlungsempfehlungen zu erhalten.
      </p>

      <form action={formAction} onChange={(e) => handleScoreChange(e.currentTarget)} className="space-y-6">

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.16_0.02_260)] block">1. Wie ist Ihre Haustür primär gesichert?</label>
          <select name="q1" className="w-full p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)]">
            <option value="1">Einfaches Zylinderschloss ohne Sicherungskarte</option>
            <option value="3">Sicherheitszylinder mit Bohr- und Ziehschutz</option>
            <option value="5">Mehrfachverriegelung mit Sicherheitsbeschlag</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.16_0.02_260)] block">2. Wie sind Fenster im Erdgeschoss geschützt?</label>
          <select name="q2" className="w-full p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)]">
            <option value="1">Standard-Rollzapfenverriegelung</option>
            <option value="3">Abschließbare Fenstergriffe vorhanden</option>
            <option value="5">Pilzkopfverriegelungen (RC2/RC3) oder Gitter</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.16_0.02_260)] block">3. Ist eine Alarmanlage (Einbruchmeldeanlage) installiert?</label>
          <select name="q3" className="w-full p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)]">
            <option value="0">Nein, keine Alarmanlage vorhanden</option>
            <option value="3">Ja, lokale Alarmierung (nur Sirene)</option>
            <option value="5">Ja, mit Aufschaltung zu einem Wachdienst</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-[oklch(0.16_0.02_260)] block">4. Existiert eine Zutrittskontrolle oder Videoüberwachung?</label>
          <select name="q4" className="w-full p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)]">
            <option value="0">Nein</option>
            <option value="2">Einfache Video-Türsprechanlage</option>
            <option value="5">Umfassende Videoüberwachung und/oder elektronischer Zutritt</option>
          </select>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-8">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Aktueller Score-Wert:</span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticScore} / 20
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Analysiere Daten...' : 'Detaillierte Auswertung anfordern'}
        </button>
      </form>

      {state.score > 0 && !isPending && (
        <div className="mt-8 p-6 rounded-xl bg-white border border-[oklch(0.89_0.008_260/0.55)]">
          <h4 className="text-lg font-bold text-[oklch(0.16_0.02_260)] mb-4">
            Auswertung: Niveau {state.tier}
          </h4>
          <ul className="space-y-3">
            {state.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
                <span className="text-[oklch(0.52_0.24_260)] mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
