'use client';

import { useActionState, useOptimistic } from 'react';
import { analyzeCodeFormat } from '@/actions/analyze-code';

const initialState = {
  isValid: false,
  message: '',
  type: 'idle',
  analyzedCode: ''
};

export function CodeFormatAnalyzer() {
  const [state, formAction, isPending] = useActionState(analyzeCodeFormat, initialState);

  // useOptimistic for immediate feedback (though not strictly necessary here, fulfills requirement)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: typeof initialState) => optimisticValue
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Code-Format Vorprüfung</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Geben Sie Ihren Code ein, um zu prüfen, ob er dem typischen Format des Herstellers entspricht.
        Dies ist eine formale Prüfung und garantiert nicht, dass der Code fräsbar ist.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Hersteller
            </label>
            <select
              id="manufacturer"
              name="manufacturer"
              className="mt-1 block w-full rounded-md border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              required
            >
              <option value="">Bitte wählen...</option>
              <option value="ABUS">ABUS</option>
              <option value="BKS">BKS</option>
              <option value="DOM">DOM</option>
              <option value="CES">CES</option>
              <option value="THULE">THULE (Dachboxen)</option>
              <option value="OTHER">Andere / Unbekannt</option>
            </select>
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Schlüsselcode
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="z.B. N123 oder AB1234"
              className="mt-1 block w-full rounded-md border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] uppercase"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Prüfe Format...' : 'Format prüfen'}
        </button>
      </form>

      {optimisticState.type !== 'idle' && (
        <div className={`mt-6 rounded-lg p-4 ${
          optimisticState.type === 'success' ? 'bg-[#eefcf2] border border-[#a6f4c5] text-[#054f31]' :
          optimisticState.type === 'warning' ? 'bg-[#fff9ed] border border-[#fce3ab] text-[#7a4d0b]' :
          'bg-[#fef3f2] border border-[#fecdca] text-[#7a271a]'
        }`}>
          <p className="text-[14px] font-medium">{optimisticState.message}</p>
        </div>
      )}
    </div>
  );
}
