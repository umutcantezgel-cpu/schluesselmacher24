import { angabe } from '@/lib/rechtliches/firma';
import type { ProductSafetyInfo } from '@/lib/types';

interface Zeile {
  label: string;
  wert: string;
  art?: 'email' | 'web';
}

/** Gepflegte GPSR-Angaben als Zeilen; Platzhalter und leere Felder entfallen. */
export function gpsrZeilen(info: ProductSafetyInfo | undefined): Zeile[] {
  if (!info) return [];
  const hersteller = angabe(info.manufacturerName);
  const anschrift = angabe(info.manufacturerAddress);
  const email = angabe(info.manufacturerEmail);
  const website = angabe(info.manufacturerWebsite);
  const kennung = angabe(info.productId);
  const hinweise = angabe(info.safetyNotes);
  const zeilen: Zeile[] = [];
  if (hersteller) zeilen.push({ label: 'Hersteller', wert: hersteller });
  if (anschrift) zeilen.push({ label: 'Anschrift', wert: anschrift });
  if (email) zeilen.push({ label: 'E-Mail', wert: email, art: 'email' });
  if (website) zeilen.push({ label: 'Website', wert: website, art: 'web' });
  if (kennung) zeilen.push({ label: 'Produktkennung', wert: kennung });
  if (hinweise) zeilen.push({ label: 'Sicherheitshinweise', wert: hinweise });
  return zeilen;
}

function webAdresse(wert: string): string | null {
  const url = /^https?:\/\//i.test(wert) ? wert : `https://${wert}`;
  try {
    return new URL(url).protocol.startsWith('http') ? url : null;
  } catch {
    return null;
  }
}

/**
 * Angaben nach der EU-Produktsicherheitsverordnung (GPSR) auf Produktseiten.
 * Erscheint nur, wenn im Backend etwas gepflegt ist.
 */
export function GpsrAngaben({
  info,
  titel = 'Produktsicherheit',
  className,
}: {
  info: ProductSafetyInfo | undefined;
  titel?: string;
  className?: string;
}) {
  const zeilen = gpsrZeilen(info);
  if (zeilen.length === 0) return null;

  return (
    <section aria-labelledby="produktsicherheit-titel" className={className}>
      <h3 id="produktsicherheit-titel" className="text-title-sm font-semibold text-foreground">
        {titel}
      </h3>
      <p className="mt-2 max-w-measure text-small text-foreground-muted">
        Angaben nach der EU-Verordnung über die allgemeine Produktsicherheit.
      </p>
      <dl className="mt-4 border-t border-border">
        {zeilen.map((zeile) => {
          const href =
            zeile.art === 'email' ? `mailto:${zeile.wert}` : zeile.art === 'web' ? webAdresse(zeile.wert) : null;
          return (
            <div key={zeile.label} className="grid gap-1 border-b border-border py-3 sm:grid-cols-12 sm:gap-4">
              <dt className="font-mono text-caption uppercase tracking-label text-foreground-muted sm:col-span-4">
                {zeile.label}
              </dt>
              <dd className="whitespace-pre-line break-words text-body text-foreground sm:col-span-8">
                {href ? (
                  <a
                    href={href}
                    className="hover:text-primary hover:underline"
                    {...(zeile.art === 'web' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {zeile.wert}
                  </a>
                ) : (
                  zeile.wert
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
