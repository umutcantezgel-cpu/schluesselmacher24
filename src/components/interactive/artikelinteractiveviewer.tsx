'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { trackArtikelView } from '@/lib/actions/artikelinteractiveviewer';
import type { ViewerState } from '@/lib/actions/artikelinteractiveviewer';

const initialState: ViewerState = {
  views: 0,
  lastViewed: null,
  status: 'IDLE',
  message: '',
};

export function ArtikelInteractiveViewer({ articleId }: { articleId: string }) {
  const [state, formAction, isPending] = useActionState(trackArtikelView, initialState);

  const [optimisticViews, setOptimisticViews] = useOptimistic(
    state.views,
    (current, update: number) => update
  );

  function handleView() {
    startTransition(() => {
      setOptimisticViews(optimisticViews + 1);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] group relative overflow-hidden transition-all duration-300 hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.988_0.002_260/0.5)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Artikel Interesse Bekunden</h3>
        <p className="mt-2 text-[oklch(0.32_0.02_260)] text-sm leading-relaxed">
          Zeigen Sie Ihr Interesse an diesem Artikel. Wir nutzen diese anonymen Daten, um unser Sortiment laufend für Sie zu optimieren.
        </p>

        <form action={formAction} onSubmit={handleView} className="mt-6 space-y-6">
          <input type="hidden" name="articleId" value={articleId} />

          <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
            <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Aktuelle Interessenten:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] tabular-nums">
              {optimisticViews.toLocaleString('de-DE')}
            </span>
          </div>

          {state.status === 'ERROR' && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {state.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full relative overflow-hidden rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-70 group-hover:shadow-[0_4px_12px_oklch(0.52_0.24_260/0.3)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Wird verarbeitet...
                </>
              ) : 'Interesse registrieren'}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
        </form>
      </div>
    </div>
  );
}
