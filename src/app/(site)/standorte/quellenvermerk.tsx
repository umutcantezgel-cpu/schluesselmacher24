import { ORTSSTAMM_QUELLEN, type OrtsstammQuelle } from '@/lib/orte/typen';

/*
 * Quellenvermerk der Ortsdaten (FA-PLATTFORM-03B, A-051 Nr. 8, FA-AB-05): Gemeindeverzeichnis von Destatis und,
 * wo Postleitzahlen erscheinen, GeoNames mit Link auf die Lizenz CC BY 4.0. Wortlaut aus `ORTSSTAMM_QUELLEN`,
 * der volle Vermerk steht in content/orte/LIZENZ.md.
 */

function Quelle({ quelle }: { quelle: OrtsstammQuelle }) {
  return (
    <li>
      <a href={quelle.url} className="underline" rel="noopener noreferrer" target="_blank">
        {quelle.text}
      </a>
      {quelle.lizenzUrl && (
        <>
          {' '}
          (
          <a href={quelle.lizenzUrl} className="underline" rel="noopener noreferrer license" target="_blank">
            Lizenz
          </a>
          )
        </>
      )}
    </li>
  );
}

export function Quellenvermerk({ mitPostleitzahlen = true }: { mitPostleitzahlen?: boolean }) {
  return (
    <aside aria-label="Quellen der Ortsdaten" className="text-caption text-foreground-muted">
      <p className="font-mono uppercase tracking-label">Quellen der Ortsdaten</p>
      <ul className="mt-2 space-y-1">
        <Quelle quelle={ORTSSTAMM_QUELLEN.gemeinden} />
        {mitPostleitzahlen && <Quelle quelle={ORTSSTAMM_QUELLEN.postleitzahlen} />}
      </ul>
    </aside>
  );
}
