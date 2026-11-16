import { VorherNachher } from '@/components/bild/vorher-nachher';
import { reiheName } from '@/lib/artikel';
import { SCHLUESSELTYP_LABEL, UMBAU_TEIL_LABEL } from '@/lib/data/fahrzeugteile';
import type { FahrzeugReihe, UmbauBeispiel } from '@/lib/types';

/** Angaben eines Umbau-Beispiels unter dem Vergleich, nur was gepflegt ist (R4). */
export function umbauAngaben(beispiel: UmbauBeispiel, katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'reihe'>>): Array<{ name: string; wert: string }> {
  const reihe = beispiel.reihe ? reiheName(beispiel.reihe, katalog) : undefined;
  const fahrzeug = [beispiel.marke, reihe].filter(Boolean).join(' ');
  return [
    ...(fahrzeug ? [{ name: 'Fahrzeug', wert: fahrzeug }] : []),
    ...(beispiel.schluesselart ? [{ name: 'Schlüsseltyp', wert: SCHLUESSELTYP_LABEL[beispiel.schluesselart] }] : []),
    ...(beispiel.uebernommen.length ? [{ name: 'Übernommen', wert: beispiel.uebernommen.map((t) => UMBAU_TEIL_LABEL[t]).join(', ') }] : []),
  ];
}

/**
 * Echte Umbau-Beispiele mit Vorher und Nachher (FA-14-07, FA-14-08, FA-20-05). Ohne freigegebene Beispiele
 * gibt es nichts aus: keine Platzhalter, keine erzeugten Bilder.
 */
export function UmbauBeispiele({ beispiele, katalog }: { beispiele: UmbauBeispiel[]; katalog: ReadonlyArray<Pick<FahrzeugReihe, 'id' | 'reihe'>> }) {
  if (beispiele.length === 0) return null;
  return (
    <ul className="mt-8 grid gap-10">
      {beispiele.map((b) => {
        const angaben = umbauAngaben(b, katalog);
        return (
          <li key={b.id} className="grid gap-4">
            <VorherNachher vorher={b.vorher} nachher={b.nachher} titel={b.titel} sizes="(min-width: 1024px) 50vw, 100vw" />
            {angaben.length > 0 && (
              <dl className="grid gap-1 text-small">
                {angaben.map((a) => (
                  <div key={a.name} className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-foreground">{a.name}:</dt>
                    <dd className="text-foreground-muted">{a.wert}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="max-w-measure text-small leading-relaxed text-foreground-muted">{b.hinweis}</p>
          </li>
        );
      })}
    </ul>
  );
}
