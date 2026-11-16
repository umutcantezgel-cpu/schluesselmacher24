import type { ReactNode } from 'react';

import type { CodeLine } from '@/lib/types';
import { codelinienKennung, codelinienTitel, gepflegt, verfuegbarkeitVon, VERFUEGBARKEIT_LABEL } from '@/lib/codelinie';
import { staffelStufen } from '@/lib/codelinie-texte';
import { formatCents } from '@/lib/format';
import { KompaktBild } from '@/components/ui/bild-flaeche';
import { GlyphPfeilRechts } from '@/components/visual/glyphen/pfeil-rechts';

/** Hat der Name eine Serienkennung („… Serie MS-01“)? Sonst steht der Titel allein. */
function mitKennung(line: Pick<CodeLine, 'name'>): boolean {
  return /Serie\s+[A-Za-z0-9-]+\s*$/.test(line.name);
}

/**
 * Inhalt einer Zeile der Codelinien-Listen (Shop-Liste, Hersteller-, Kategorie-
 * und Produktseite): Produktbild oder Fach-Icon (kein Platzhalterbild), Titel,
 * Codeformat und Codebereich, rechts Preis und Lieferzeit. Ist die Linie nicht
 * lieferbar, steht dort die Verfügbarkeit statt eines Preises zum Bestellen.
 * Ohne Hooks: läuft auf dem Server wie im Browser.
 */
export function LinienZeileInhalt({
  line,
  zusatz,
  staffelZeigen = true,
}: {
  line: CodeLine;
  /** Etwa „Code hat die richtige Form“ hinter dem Aufbau des Codes. */
  zusatz?: ReactNode;
  /** Staffelpreis-Hinweis in der Zeile (entfällt, wenn die Gruppe ihn schon nennt). */
  staffelZeigen?: boolean;
}) {
  const verfuegbarkeit = verfuegbarkeitVon(line);
  const lieferbar = verfuegbarkeit === 'lieferbar';
  // Wie auf der Produktseite (L-20): nur eine Stufe, die gilt und wirklich günstiger ist.
  const staffel = staffelStufen(line)[0];
  const codebereich = gepflegt(line.codeRange);
  const lieferzeit = lieferbar ? gepflegt(line.deliveryTime) : undefined;
  return (
    <>
      <span aria-hidden className="w-12 shrink-0 self-start sm:w-14">
        <KompaktBild slot={line.productImage} sizes="56px" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-balance text-body font-semibold leading-snug text-foreground transition-colors duration-quick ease-standard group-hover:text-primary">
          {mitKennung(line) && (
            <span className="mr-2 whitespace-nowrap font-mono text-small tabular-nums">{codelinienKennung(line)}</span>
          )}
          {codelinienTitel(line)}
        </span>
        <span className="mt-1 block font-mono text-small text-foreground-muted">
          {line.codeFormatLabel}
          {codebereich && <span className="whitespace-nowrap"> · Codebereich {codebereich}</span>}
          {zusatz}
        </span>
      </span>
      <span className="shrink-0 text-right">
        {lieferbar ? (
          <>
            <span className="block whitespace-nowrap font-mono text-body font-semibold tabular-nums text-foreground">
              {formatCents(line.priceCents)}
            </span>
            {staffelZeigen && staffel && (
              <span className="block whitespace-nowrap text-caption text-foreground-muted">
                Staffelpreis ab {staffel.minQty}{' '}Stück
              </span>
            )}
            {lieferzeit && <span className="block text-caption text-foreground-muted">Lieferzeit {lieferzeit}</span>}
          </>
        ) : (
          <span className="block text-small font-semibold text-foreground-muted">{VERFUEGBARKEIT_LABEL[verfuegbarkeit]}</span>
        )}
      </span>
      <GlyphPfeilRechts
        size={16}
        className="shrink-0 self-center text-foreground-muted transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 group-hover:text-primary group-focus-visible:text-primary"
      />
    </>
  );
}

/** Klassen der Zeile selbst (der Link): ein Flex-Band mit Haarlinie darunter im Eltern-`li`. */
export const LINIEN_ZEILE_KLASSE =
  'group flex min-h-touch-lg items-center gap-3 py-4 transition-colors duration-quick ease-standard md:gap-6';
