'use client';

import { Button, ButtonLink } from '@/components/ui/button';
import { FehlerAnsicht } from '@/components/layout/fehler-ansicht';
import { GlyphZuruecksetzen } from '@/components/visual/glyphen/zuruecksetzen';

/** Fehlergrenze für alle Seiten der Website (Next 16: Props `error` und `retry`). */
export default function Fehler({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <FehlerAnsicht
      eyebrow="Technischer Fehler"
      title="Diese Seite konnte nicht geladen werden."
      lead="Beim Laden ist ein Fehler aufgetreten. Versuchen Sie es erneut; bleibt der Fehler, erreichen Sie uns über die Kontaktseite."
      zustand="abgebrochen"
      code="500"
      bildunterschrift="Schnitt A–A · Schlüssel abgebrochen"
      aktionen={
        <>
          <Button onClick={() => retry()}>
            <GlyphZuruecksetzen size={18} />
            Erneut versuchen
          </Button>
          <ButtonLink href="/service-und-termin/kontakt" variant="outline">
            Kontakt aufnehmen
          </ButtonLink>
        </>
      }
    >
      {error.digest && (
        <p className="mt-4 font-mono text-caption text-foreground-subtle">
          Fehlerkennung <span className="tabular-nums text-foreground-muted">{error.digest}</span>
        </p>
      )}
    </FehlerAnsicht>
  );
}
