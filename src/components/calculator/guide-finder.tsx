'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { findRelevantGuides, type GuideFinderResult } from '@/actions/find-guides';
import Link from 'next/link';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

const initialState: GuideFinderResult = {
  status: 'idle',
  results: [],
};

export function GuideFinder() {
  const [state, formAction, isPending] = useActionState(findRelevantGuides, initialState);

  // Use optimistic state to provide immediate visual feedback while loading
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: GuideFinderResult) => optimisticValue
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Finde den passenden Ratgeber</h3>
      <form
        action={(formData) => {
          startTransition(() => {
             setOptimisticState({ status: 'loading', results: [] });
          });
          formAction(formData);
        }}
        className="mt-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label htmlFor="role" className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Ihre Situation</label>
            <select
                name="role"
                id="role"
                required
                className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
                <option value="">Bitte wählen...</option>
                <option value="privat">Privatperson / Hausbesitzer</option>
                <option value="gewerbe">Gewerbetreibender / Unternehmen</option>
                <option value="verwaltung">Hausverwaltung</option>
            </select>
            </div>

            <div>
            <label htmlFor="focus" className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Ihr thematischer Fokus</label>
            <select
                name="focus"
                id="focus"
                required
                className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-3 text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
                <option value="">Bitte wählen...</option>
                <option value="mechanik">Mechanischer Einbruchschutz</option>
                <option value="elektronik">Elektronische Zutrittskontrolle</option>
                <option value="planung">Planung & Organisation</option>
            </select>
            </div>
        </div>

        <button
          type="submit"
          disabled={isPending || optimisticState.status === 'loading'}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 flex justify-center items-center"
        >
          {(isPending || optimisticState.status === 'loading') ? (
            <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysiere Empfehlungen...
            </span>
          ) : 'Passende Ratgeber finden'}
        </button>

        {optimisticState.status === 'error' && (
            <p className="text-red-500 text-sm mt-2">{optimisticState.message}</p>
        )}
      </form>

      {optimisticState.status === 'success' && optimisticState.results.length > 0 && (
          <div className="mt-8 border-t border-[oklch(0.89_0.008_260/0.55)] pt-8">
              <h4 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-4">Ihre persönlichen Empfehlungen</h4>
              <ul className="space-y-4">
                  {optimisticState.results.map((result) => (
                      <li key={result.id} className="group rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-5 transition-colors hover:border-[oklch(0.52_0.24_260)]">
                          <Link href={`/ratgeber/${result.slug}`} className="block">
                            <span className="flex items-start justify-between gap-3">
                                <span className="text-base font-semibold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors">
                                    {result.title}
                                </span>
                                <GlyphPfeilRechts
                                    size={18}
                                    className="mt-1 shrink-0 text-[oklch(0.52_0.24_260)] transition-transform duration-quick ease-standard group-hover:translate-x-1"
                                />
                            </span>
                            <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">{result.excerpt}</p>
                          </Link>
                      </li>
                  ))}
              </ul>
          </div>
      )}
    </div>
  );
}
