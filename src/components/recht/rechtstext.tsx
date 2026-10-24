import type { RechtsAbschnitt } from '@/lib/rechtliches/texte';

/**
 * Rechtstext aus `src/lib/rechtliches/texte.ts` als Überschriften, Absätze
 * und Aufzählungen. Die Gestaltung kommt aus `prose-sm24` der Rechtsseiten.
 */
export function Rechtstext({ abschnitte }: { abschnitte: readonly RechtsAbschnitt[] }) {
  return (
    <>
      {abschnitte.map((abschnitt) => {
        const Kopf = abschnitt.ebene === 2 ? 'h2' : 'h3';
        return (
          <section key={abschnitt.id} id={abschnitt.id} aria-labelledby={`${abschnitt.id}-titel`}>
            <Kopf id={`${abschnitt.id}-titel`}>{abschnitt.ueberschrift}</Kopf>
            {abschnitt.absaetze.map((absatz, index) =>
              typeof absatz === 'string' ? (
                <p key={index}>{absatz}</p>
              ) : (
                <ul key={index}>
                  {absatz.liste.map((punkt) => (
                    <li key={punkt}>{punkt}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        );
      })}
    </>
  );
}
