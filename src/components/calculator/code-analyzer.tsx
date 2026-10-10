'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { analyzeKeycode } from '@/actions/analyze-code';
import type { CodeAnalysisResult } from '@/actions/analyze-code';

const initialState: CodeAnalysisResult = {
  isValid: false,
  type: '-',
  manufacturer: '-',
  estimatedCost: 0,
  message: ''
};

export function CodeAnalyzer() {
  const [state, formAction, isPending] = useActionState(analyzeKeycode, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<CodeAnalysisResult>) => ({ ...current, ...update })
  );

  function handleCodeChange(value: string) {
    if (value.length > 2) {
      startTransition(() => {
        setOptimisticState({ message: 'Analysiere Muster...', isValid: true });
      });
    }
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktive Schlüsselcode-Analyse</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">Prüfen Sie vorab das Format Ihres Codes auf Plausibilität und erhalten Sie eine Sofort-Einschätzung.</p>
      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] block mb-2">Schlüsselcode eingeben</label>
          <input
            type="text"
            name="keycode"
            placeholder="z.B. AB12345"
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-[oklch(0.16_0.02_260)] outline-none focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <div>
            <span className="block text-xs text-[oklch(0.52_0.015_260)]">Erkannter Hersteller</span>
            <span className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.manufacturer}</span>
          </div>
          <div>
            <span className="block text-xs text-[oklch(0.52_0.015_260)]">Schlüsseltyp</span>
            <span className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">{optimisticState.type}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-xs text-[oklch(0.52_0.015_260)]">System-Feedback</span>
            <span className="block text-sm text-[oklch(0.32_0.02_260)]">{optimisticState.message || '-'}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
          <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
          <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticState.estimatedCost > 0 ? `ab ${optimisticState.estimatedCost.toLocaleString('de-DE')} €` : '-'}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {isPending ? 'Analysiere Code...' : 'Code kostenlos prüfen'}
        </button>
      </form>
    </div>
  );
}
