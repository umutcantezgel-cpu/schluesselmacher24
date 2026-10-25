import { kontakt, standort } from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';
import type { CompanyLocation, CompanyProfile } from '@/lib/types';
import { cn } from '@/lib/cn';
import { GlyphOrt } from '@/components/visual/glyphen/ort';

/** Werkstatt und Telefon als einfache Daten — so auch an Client-Komponenten übergebbar. */
export interface WerkstattAngaben {
  /** Aus `standort(company)`: fehlt, wenn nicht gepflegt oder gleich dem Firmensitz. */
  standort?: CompanyLocation;
  /** Aus `kontakt(company)`: nur veröffentlichte, gepflegte Nummer. */
  telefon?: string;
}

/** Werkstatt und Telefon aus den Firmendaten, mit denselben Regeln wie im Fuß. */
export function werkstattAngaben(company: CompanyProfile): WerkstattAngaben {
  const angaben: WerkstattAngaben = {};
  const werkstatt = standort(company);
  const telefon = kontakt(company).telefon;
  if (werkstatt) angaben.standort = werkstatt;
  if (telefon) angaben.telefon = telefon;
  return angaben;
}

export interface WerkstattZeileProps extends WerkstattAngaben {
  className?: string;
}

/**
 * Ruhige Zeile mit der echten Werkstatt an Kauf- und Buchungsstellen:
 * Bezeichnung, Anschrift und Telefon als `tel:`-Link. Ohne Browser-Logik —
 * nutzbar in Server- und Client-Komponenten.
 *
 * Ohne gepflegten Standort erscheint nichts; Öffnungszeiten nennt die Zeile
 * bewusst nicht.
 */
export function WerkstattZeile({ standort: werkstatt, telefon, className }: WerkstattZeileProps) {
  if (!werkstatt) return null;
  const telefonHref = telefonLink(telefon);

  return (
    <address className={cn('flex items-start gap-2 text-small not-italic leading-relaxed text-foreground-muted', className)}>
      <GlyphOrt size={16} className="mt-0.5 shrink-0" />
      <span className="min-w-0">
        <span className="font-semibold text-foreground">{werkstatt.label}:</span>{' '}
        <span>
          {werkstatt.street}, {werkstatt.postalCode} {werkstatt.city}
        </span>
        {telefon && (
          <>
            {' · '}
            {telefonHref ? (
              <a
                href={telefonHref}
                className="whitespace-nowrap font-mono tabular-nums text-foreground transition-colors duration-quick hover:text-primary"
              >
                {telefon}
              </a>
            ) : (
              <span className="whitespace-nowrap font-mono tabular-nums">{telefon}</span>
            )}
          </>
        )}
      </span>
    </address>
  );
}
