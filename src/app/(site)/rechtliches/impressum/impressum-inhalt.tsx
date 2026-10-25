import type { ReactNode } from 'react';

import {
  firmaVeroeffentlichbar,
  firmenname,
  inhaberZeile,
  inhaltlichVerantwortlich,
  kontakt,
  registereintrag,
  sitzZeilen,
  standort,
  ustId,
  angabe,
} from '@/lib/rechtliches/firma';
import { telefonLink } from '@/lib/telefon';
import type { CompanyProfile } from '@/lib/types';

function Zeilen({ zeilen }: { zeilen: readonly string[] }) {
  return (
    <p>
      {zeilen.map((zeile, index) => (
        <span key={`${index}-${zeile}`}>
          {index > 0 && <br />}
          {zeile}
        </span>
      ))}
    </p>
  );
}

/**
 * Impressum aus den Firmendaten (Gliederung wie bei der Schlüssel Schmiede):
 * Jeder Abschnitt erscheint nur mit gepflegten Angaben. Die Steuernummer ist
 * intern und steht hier nie.
 */
export function ImpressumInhalt({ company, hinweis }: { company: CompanyProfile; hinweis?: ReactNode }) {
  const veroeffentlichbar = firmaVeroeffentlichbar(company);
  const inhaber = inhaberZeile(company);
  const { telefon, email } = kontakt(company);
  const telefonHref = telefonLink(telefon);
  const werkstatt = standort(company);
  const ust = ustId(company);
  const register = registereintrag(company);
  const beruf = veroeffentlichbar ? angabe(company.profession) : undefined;
  const kammer = veroeffentlichbar ? angabe(company.chamber) : undefined;
  const verantwortlich = inhaltlichVerantwortlich(company);

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Impressum</h1>
      {hinweis}

      <h2>Angaben gemäß § 5 DDG</h2>
      <Zeilen zeilen={[firmenname(company), ...(inhaber ? [inhaber] : []), ...sitzZeilen(company)]} />

      {(telefon || email) && (
        <>
          <h2>Kontakt</h2>
          <p>
            {telefon && (
              <>
                Telefon:{' '}
                {telefonHref ? (
                  <a href={telefonHref} className="font-mono tabular-nums">
                    {telefon}
                  </a>
                ) : (
                  <span className="font-mono tabular-nums">{telefon}</span>
                )}
              </>
            )}
            {telefon && email && <br />}
            {email && (
              <>
                E-Mail: <a href={`mailto:${email}`}>{email}</a>
              </>
            )}
          </p>
        </>
      )}

      {werkstatt && (
        <>
          <h2>{werkstatt.label}</h2>
          <Zeilen zeilen={[werkstatt.street, `${werkstatt.postalCode} ${werkstatt.city}`]} />
        </>
      )}

      {ust && (
        <>
          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:{' '}
            <span className="font-mono tabular-nums">{ust}</span>
          </p>
        </>
      )}

      {register && (
        <>
          <h2>Registereintrag</h2>
          <p>
            Registergericht: {register.gericht}
            <br />
            Registernummer: {register.nummer}
          </p>
        </>
      )}

      {(beruf || kammer) && (
        <>
          <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
          <ul>
            {beruf && <li>Berufsbezeichnung: {beruf}</li>}
            {kammer && <li>Zuständige Kammer: {kammer}</li>}
            {kammer && (
              <li>
                Berufsrechtliche Regelungen: Handwerksordnung (HwO), abrufbar unter{' '}
                <a href="https://www.gesetze-im-internet.de/hwo/" target="_blank" rel="noopener noreferrer">
                  www.gesetze-im-internet.de/hwo
                </a>
              </li>
            )}
          </ul>
        </>
      )}

      {verantwortlich.length > 0 && (
        <>
          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <Zeilen zeilen={verantwortlich} />
        </>
      )}

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Für eigene Inhalte auf diesen Seiten sind wir nach den allgemeinen Gesetzen verantwortlich.
        Wir bemühen uns, die Angaben aktuell und richtig zu halten, übernehmen aber keine Gewähr
        für ihre Vollständigkeit und Aktualität.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu Websites Dritter, auf deren Inhalte wir keinen Einfluss
        haben. Für diese Inhalte ist der jeweilige Anbieter verantwortlich. Zum Zeitpunkt der
        Verlinkung waren keine Rechtsverstöße erkennbar. Werden uns Rechtsverletzungen bekannt,
        entfernen wir den betreffenden Link umgehend.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Texte, Grafiken und Fotos auf dieser Website unterliegen dem deutschen Urheberrecht.
        Vervielfältigung, Bearbeitung, Verbreitung und jede Verwertung außerhalb der Grenzen des
        Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Rechteinhabers.
      </p>
    </>
  );
}
