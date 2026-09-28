'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { analyzeSecurityNeeds } from '@/actions/analyze-security-needs';
import type { SecurityNeedsResult } from '@/actions/analyze-security-needs';

const initialState: SecurityNeedsResult = {
  level: 'BASIS',
  recommendations: [
    'VdS-zertifizierte mechanische Schließzylinder',
    'Massive Schutzbeschläge'
  ]
};

export function SecurityNeedsAnalyzer() {
  const [state, formAction, isPending] = useActionState(analyzeSecurityNeeds, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<SecurityNeedsResult>) => ({
      ...current,
      ...update
    })
  );

  function handleInputChange(formData: FormData) {
      const pType = formData.get('propertyType') as string;
      const uCount = Number(formData.get('userCount'));
      const aSize = Number(formData.get('areaSize'));

      let newLevel: 'BASIS' | 'ERWEITERT' | 'MAXIMAL' = 'BASIS';
      if (pType === 'gewerbe' || uCount > 5) newLevel = 'ERWEITERT';
      if (pType === 'industrie' || aSize > 1000) newLevel = 'MAXIMAL';

      startTransition(() => {
          setOptimisticState({ level: newLevel });
      });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheitsbedarfs-Analyse</h3>
      <form action={formAction} onChange={(e) => handleInputChange(new FormData(e.currentTarget))} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Objektart</label>
            <select id="propertyType" name="propertyType" defaultValue="privat" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
                <option value="privat">Privathaushalt</option>
                <option value="gewerbe">Gewerbe / Büro</option>
                <option value="industrie">Industrie / Komplex</option>
            </select>
            </div>
            <div>
            <label htmlFor="userCount" className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Anzahl Nutzer</label>
            <input type="number" id="userCount" name="userCount" min="1" defaultValue="2" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
            <div>
            <label htmlFor="areaSize" className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Fläche (m²)</label>
            <input type="number" id="areaSize" name="areaSize" min="10" defaultValue="100" className="w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white p-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
        </div>

        <div className="mt-8 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
            <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Empfohlenes Schutzniveau:</span>
                <span className="text-2xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
                    NIVEAU {optimisticState.level}
                </span>
            </div>
            <ul className="space-y-2 mb-6">
                {optimisticState.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start text-sm text-[oklch(0.32_0.02_260)]">
                        <span className="mr-2 text-[oklch(0.52_0.24_260)]">•</span>
                        {rec}
                    </li>
                ))}
            </ul>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Analysiere...' : 'Detaillierte Analyse generieren'}
        </button>
      </form>
    </div>
  );
}
