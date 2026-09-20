'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { fetchSystemAnalytics } from '@/lib/actions/fetch-analytics';
import type { SystemAnalyticsResult } from '@/lib/actions/fetch-analytics';
import { Activity, ShieldCheck, Database, Clock, RefreshCw } from 'lucide-react';

const initialState: SystemAnalyticsResult = {
  status: 'IDLE',
};

export function AdminAnalyticsDashboard() {
  const [state, formAction, isPending] = useActionState(fetchSystemAnalytics, initialState);

  // Optimistic UI for visual feedback
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    state.status,
    (current, update: 'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR') => update
  );

  function handleRefresh() {
    startTransition(() => {
      setOptimisticStatus('ANALYZING');
    });
  }

  const data = state.data || {
    memoryUsage: '--',
    cpuLoad: '--',
    uptime: '--',
    activeSessions: 0,
    securityScore: 0,
    lastAudit: '--',
  };

  const isAnalyzing = optimisticStatus === 'ANALYZING' || isPending;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all duration-300 hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]"
      style={{ viewTransitionName: 'admin-analytics-dashboard' }}
    >
      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_-20%,oklch(0.92_0.02_260/0.5),transparent_70%)] group-hover:opacity-100" aria-hidden="true" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[oklch(0.52_0.24_260)]" />
            Systemanalyse & Metriken
          </h3>
          <p className="text-sm text-[oklch(0.32_0.02_260)] mt-1">Echtzeit-Überwachung der Infrastruktur</p>
        </div>

        <form action={formAction}>
          <button
            type="submit"
            disabled={isAnalyzing}
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260)] px-4 py-2 text-sm font-semibold text-[oklch(0.32_0.02_260)] shadow-sm transition-all hover:bg-[oklch(0.95_0.004_260)] active:scale-[0.98] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin text-[oklch(0.52_0.24_260)]' : ''}`} />
            {isAnalyzing ? 'Analysiere...' : 'Aktualisieren'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-rows-[auto_1fr] auto-rows-[1fr]">
        {/* Metric Card 1 */}
        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm row-span-2 grid grid-rows-subgrid gap-0">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-[oklch(0.52_0.24_260)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Speicher</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] self-end">
            {isAnalyzing ? <span className="animate-pulse">--</span> : data.memoryUsage}
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm row-span-2 grid grid-rows-subgrid gap-0">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-[oklch(0.52_0.24_260)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">CPU Last</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] self-end">
            {isAnalyzing ? <span className="animate-pulse">--</span> : data.cpuLoad}
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm row-span-2 grid grid-rows-subgrid gap-0">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[oklch(0.52_0.24_260)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Uptime</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] self-end">
            {isAnalyzing ? <span className="animate-pulse">--</span> : data.uptime}
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm relative overflow-hidden group row-span-2 grid grid-rows-subgrid gap-0">
          <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-12 h-12 text-[oklch(0.52_0.24_260)]" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[oklch(0.52_0.24_260)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Security Score</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] self-end">
            {isAnalyzing ? <span className="animate-pulse">--</span> : `${data.securityScore}/100`}
          </div>
        </div>
      </div>

      {state.message && (
        <div className="mt-4 text-sm text-[oklch(0.32_0.02_260)] bg-[oklch(0.988_0.002_260)] p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.3)] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          {state.message}
        </div>
      )}
    </div>
  );
}
