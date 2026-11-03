'use client';

/*
 * Letzte Fehlergrenze: greift, wenn das Root-Layout selbst scheitert (etwa
 * wenn Kopf oder Fuß die Datenbank nicht erreichen). Ersetzt das ganze
 * Dokument — deshalb eigenes <html>/<body> und keine globalen Stile, nur
 * die Farbwerte der Design-Tokens (globals.css) als Inline-Stile.
 * Next 16: Props `error` und `retry`.
 */

/* Dieselben OKLCH-Tripel wie --background, --surface, --foreground, --foreground-muted, --border und
   --primary in globals.css (geprüft in global-error.test.ts). */
const FARBE = {
  hintergrund: 'oklch(0.9882 0.0028 255)',
  flaeche: 'oklch(1 0 0)',
  text: 'oklch(0.2497 0.0366 266)',
  leise: 'oklch(0.4654 0.0347 262.8)',
  linie: 'oklch(0.9091 0.0162 255)',
  primaer: 'oklch(0.4852 0.1611 257.63)',
};

/* Ohne die Schriftdateien des Layouts: Plex Sans, falls installiert, sonst Systemschriften. */
const SCHRIFT = "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="de">
      <head>
        <title>Technischer Fehler | SCHLÜSSELMACHER24</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, background: FARBE.hintergrund, color: FARBE.text, fontFamily: SCHRIFT }}>
        <main
          style={{
            boxSizing: 'border-box',
            maxWidth: '40rem',
            margin: '0 auto',
            padding: '15vh 1.25rem 3rem',
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, letterSpacing: '0.02em' }}>
            SCHLÜSSELMACHER<span style={{ color: FARBE.primaer }}>24</span>
          </p>
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              background: FARBE.flaeche,
              border: `1px solid ${FARBE.linie}`,
              borderTop: `4px solid ${FARBE.primaer}`,
              borderRadius: '0.5rem',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '1.5rem', lineHeight: 1.3 }}>Die Seite konnte nicht geladen werden.</h1>
            <p style={{ margin: '0.75rem 0 0', lineHeight: 1.6, color: FARBE.leise }}>
              Beim Laden ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es gleich noch einmal. Bleibt der
              Fehler bestehen, rufen Sie uns an oder schreiben Sie uns eine E-Mail.
            </p>
            {error.digest && (
              <p style={{ margin: '1rem 0 0', fontSize: '0.8125rem', color: FARBE.leise, fontFamily: 'ui-monospace, Menlo, Consolas, monospace' }}>
                Fehlerkennung {error.digest}
              </p>
            )}
            <button
              type="button"
              onClick={() => retry()}
              style={{
                marginTop: '1.5rem',
                minHeight: '44px',
                padding: '0.625rem 1.25rem',
                border: 0,
                borderRadius: '0.375rem',
                background: FARBE.primaer,
                color: '#fff',
                font: 'inherit',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Erneut versuchen
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
