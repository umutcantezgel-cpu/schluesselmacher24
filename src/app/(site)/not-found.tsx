import { ButtonLink } from '@/components/ui/button';
import { FehlerAnsicht } from '@/components/layout/fehler-ansicht';

export default function NotFound() {
  return (
    <FehlerAnsicht
      eyebrow="Fehler 404"
      title="Diese Seite gibt es nicht."
      lead="Die Adresse ist falsch geschrieben oder die Seite wurde verschoben. Unten finden Sie alle Bereiche im Überblick."
      zustand="passt-nicht"
      code="404"
      bildunterschrift="Schnitt A–A · Schlüssel passt nicht"
      aktionen={
        <>
          <ButtonLink href="/" pfeil>
            Zur Startseite
          </ButtonLink>
          <ButtonLink href="/service-und-termin/kontakt" variant="outline">
            Kontakt aufnehmen
          </ButtonLink>
        </>
      }
    />
  );
}
