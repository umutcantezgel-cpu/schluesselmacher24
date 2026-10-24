import { integrationStatuses } from '@/lib/integrations';
import { STRIPE_EREIGNISSE } from '@/lib/zahlung/ereignisse';

import { TestmailKnopf } from './TestmailKnopf';

/**
 * Stand der Anbindungen (Einstellungen → Anbindungen). Serverkomponente:
 * liest die Umgebungsvariablen beim Aufruf — Werte erscheinen nie, nur ob
 * sie gesetzt sind.
 */
export function Anbindungen() {
  const statuses = integrationStatuses();
  return (
    <div style={{ display: 'grid', gap: 'calc(var(--base) * 1.5)', marginBottom: 'calc(var(--base) * 2)' }}>
      <p style={{ margin: 0 }}>
        Zugangsdaten stehen nur in den Umgebungsvariablen (bei Vercel unter Settings → Environment Variables).
        Nach jeder Änderung neu deployen.
      </p>
      {statuses.map((status) => (
        <section key={status.id} style={{ borderTop: '1px solid var(--theme-elevation-150)', paddingTop: 'var(--base)' }}>
          <h3 style={{ margin: '0 0 calc(var(--base) / 2)' }}>
            {status.label}: {status.configured ? 'eingerichtet' : 'nicht eingerichtet'}
          </h3>
          {status.missingEnv.length > 0 && (
            <p style={{ margin: '0 0 calc(var(--base) / 2)' }}>
              Fehlt: <code>{status.missingEnv.join(', ')}</code>
            </p>
          )}
          {!status.configured && <p style={{ margin: 0, opacity: 0.8 }}>Ohne Anbindung: {status.fallback}</p>}
          {status.id === 'zahlung' && (
            <p style={{ margin: 'calc(var(--base) / 2) 0 0', opacity: 0.8 }}>
              Webhook in Stripe: <code>/api/zahlung/stripe</code> mit den Ereignissen{' '}
              <code>{STRIPE_EREIGNISSE.join(', ')}</code>.
            </p>
          )}
          {status.id === 'mailversand' && status.configured && (
            <div style={{ marginTop: 'calc(var(--base) / 2)' }}>
              <TestmailKnopf />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
