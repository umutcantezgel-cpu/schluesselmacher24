import { ButtonLink } from '@/components/ui/button';
import { Section, SectionHeading } from '@/components/layout/section';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { IconSicherungskarte } from '@/components/visual/icons/sicherungskarte';
import type { CodeLine } from '@/lib/types';

/** Codelinie für Nachschlüssel mit Sicherungskarte. */
const SICHERUNGSKARTEN_LINIE = 'zy-02';

/**
 * Die Codelinie für die Nachbestellung mit Sicherungskarte: ZY-02, sonst die erste bestellbare
 * Linie mit „Sicherungskarte“ im Namen. Ohne passende Linie `undefined`.
 */
export function sicherungskartenLinie(lines: readonly CodeLine[]): CodeLine | undefined {
  const bestellbar = lines.filter((line) => line.active && !line.example);
  return (
    bestellbar.find((line) => line.id === SICHERUNGSKARTEN_LINIE)
    ?? bestellbar.find((line) => /sicherungskarte/i.test(line.name))
  );
}

interface NachbestellenAbschnittProps {
  linie: CodeLine | undefined;
  nummer: string;
  tone?: 'default' | 'muted';
}

/**
 * Nachbestellweg für Schließungen mit Sicherungskarte (Leitfaden Kap. 09/10): weitere Schlüssel
 * nach Code, mit Foto der Karte. Texte aus der Codelinie und der Katalog-Option „Sicherungskarte“.
 */
export function NachbestellenAbschnitt({ linie, nummer, tone = 'default' }: NachbestellenAbschnittProps) {
  const punkte = [
    linie
      ? `Code der Schließung eingeben (${linie.codeFormatLabel}).`
      : 'Code der Schließung eingeben — er steht auf der Sicherungskarte.',
    linie?.photoUploadHint ?? 'Foto Ihrer Sicherungskarte hochladen.',
    'Nachschlüssel werden nur gegen Vorlage der Sicherungskarte gefertigt.',
  ];

  return (
    <Section id="nachbestellen" tone={tone} tight labelledBy="nachbestellen-titel">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-gutter">
        <div className="lg:col-span-5">
          <SectionHeading
            id="nachbestellen-titel"
            nummer={nummer}
            eyebrow="Nachbestellen"
            title="Schlüssel nachbestellen (mit Sicherungskarte)"
            lead="Gehört zu Ihrer Schließung eine Sicherungskarte, bestellen Sie weitere Schlüssel direkt nach Code."
          />
        </div>
        <div className="lg:col-span-7">
          <div className="flex items-start gap-4 border-t border-border pt-6">
            <IconSicherungskarte size={40} className="shrink-0 text-area-strong" />
            <ul className="min-w-0 space-y-3">
              {punkte.map((punkt) => (
                <li key={punkt} className="flex gap-3">
                  <GlyphHakenKreis size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-small text-foreground-muted">{punkt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href={linie ? `/schluessel-nach-code/${linie.slug}` : '/schluessel-nach-code#codelinien'}
              pfeil
              className="w-full justify-between text-left sm:w-auto"
            >
              Schlüssel nachbestellen (mit Sicherungskarte)
            </ButtonLink>
            <ButtonLink href="/service-und-termin/anfrage" variant="outline" className="w-full sm:w-auto">
              Karte nicht zur Hand? Anfrage stellen
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
