import Link from 'next/link';
import type { ReactNode } from 'react';

import { anbieterZeilen, kontakt } from '@/lib/rechtliches/firma';
import { DIENSTLEISTER, VERARBEITUNGEN_FASSUNG, verarbeitungen } from '@/lib/rechtliches/verarbeitungen';
import { formatDateShort } from '@/lib/format';
import { telefonLink } from '@/lib/telefon';
import type { Settings } from '@/lib/types';

interface DatenschutzInhaltProps {
  settings: Pick<Settings, 'company' | 'retentionDays'>;
  /** Prüfhinweise für den Inhaber anzeigen (nur außerhalb der Produktion). */
  pruefhinweise?: boolean;
  hinweis?: ReactNode;
}

function Pruefhinweis({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-sm border border-warning/30 bg-warning-soft px-3 py-2 text-caption font-semibold text-foreground">
      Vor der Freigabe prüfen: {children}
    </p>
  );
}

/**
 * Datenschutzerklärung. Die Übersicht der Verarbeitungen, die Dienstleister
 * und die Drittlandangaben kommen ausschließlich aus
 * `src/lib/rechtliches/verarbeitungen.ts`.
 */
export function DatenschutzInhalt({ settings, pruefhinweise = false, hinweis }: DatenschutzInhaltProps) {
  const { company } = settings;
  const liste = verarbeitungen(settings);
  const drittland = liste.filter((eintrag) => eintrag.drittland);
  const { telefon, email } = kontakt(company);
  const telefonHref = telefonLink(telefon);

  return (
    <>
      <h1 className="text-headline font-bold text-balance">Datenschutzerklärung</h1>
      {hinweis}
      <p className="mt-3">
        Hier steht, welche personenbezogenen Daten wir verarbeiten, wozu, auf welcher
        Rechtsgrundlage, an wen sie gehen und wie lange wir sie speichern. Analyse- oder
        Werbedienste setzen wir nicht ein.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        <br />
        {anbieterZeilen(company).map((zeile) => (
          <span key={zeile}>
            <br />
            {zeile}
          </span>
        ))}
        {telefon && (
          <>
            <br />
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
        {email && (
          <>
            <br />
            E-Mail: <a href={`mailto:${email}`}>{email}</a>
          </>
        )}
      </p>

      <h2>2. Übersicht der Verarbeitungen</h2>
      <p>
        Die folgende Übersicht nennt für jede Verarbeitung Zweck, Daten, Rechtsgrundlage,
        Empfänger und Speicherdauer.
      </p>
      {liste.map((eintrag, index) => (
        <section key={eintrag.id} id={`verarbeitung-${eintrag.id}`} aria-labelledby={`verarbeitung-${eintrag.id}-titel`}>
          <h3 id={`verarbeitung-${eintrag.id}-titel`}>
            2.{index + 1} {eintrag.titel}
          </h3>
          <dl>
            <dt>Zweck</dt>
            <dd>{eintrag.zweck}</dd>
            <dt>Daten</dt>
            <dd>{eintrag.daten.join('; ')}</dd>
            <dt>Rechtsgrundlage</dt>
            <dd>{eintrag.rechtsgrundlage}</dd>
            <dt>Empfänger</dt>
            <dd>{eintrag.empfaenger}</dd>
            {eintrag.drittland && (
              <>
                <dt>Drittland</dt>
                <dd>{eintrag.drittland}</dd>
              </>
            )}
            <dt>Speicherdauer</dt>
            <dd>{eintrag.speicherdauer}</dd>
          </dl>
          {pruefhinweise && eintrag.pruefhinweis && <Pruefhinweis>{eintrag.pruefhinweis}</Pruefhinweis>}
        </section>
      ))}

      <h2>3. Dienstleister</h2>
      <p>
        Wir setzen die folgenden Dienstleister ein. Mit Auftragsverarbeitern haben wir Verträge nach
        Art. 28 DSGVO geschlossen; sie verarbeiten die Daten nur nach unserer Weisung.
      </p>
      <ul>
        {DIENSTLEISTER.map((dienstleister) => (
          <li key={dienstleister.id}>
            <strong>{dienstleister.name}</strong> ({dienstleister.sitz}) – {dienstleister.aufgabe};{' '}
            {dienstleister.rolle}.
            {pruefhinweise && dienstleister.pruefhinweis && (
              <Pruefhinweis>{dienstleister.pruefhinweis}</Pruefhinweis>
            )}
          </li>
        ))}
      </ul>
      {pruefhinweise && (
        <Pruefhinweis>
          Auftragsverarbeitungsverträge (DPA) mit allen genannten Auftragsverarbeitern abschließen,
          bevor die Seite live geht.
        </Pruefhinweis>
      )}

      <h2>4. Übermittlung in Drittländer</h2>
      <p>
        Einige Dienstleister haben ihren Sitz außerhalb des Europäischen Wirtschaftsraums. Eine
        Übermittlung erfolgt nur auf einer der folgenden Grundlagen:
      </p>
      <ul>
        {drittland.map((eintrag) => (
          <li key={eintrag.id}>
            <strong>{eintrag.titel}:</strong> {eintrag.drittland}
          </li>
        ))}
      </ul>

      <h2>5. Speicherung im Browser, Cookies und Fremdinhalte</h2>
      <p>
        Wir verwenden keine Cookies oder Techniken zur Analyse, Reichweitenmessung oder Werbung und
        binden keine Inhalte fremder Anbieter wie Karten, Videos oder Schriftarten-Dienste ein. Die
        Schriftarten liefern wir selbst aus; beim Aufruf der Seite besteht keine Verbindung zu
        Google oder anderen Schriftanbietern.
      </p>
      <p>
        Gespeichert wird nur, was für die von Ihnen genutzten Funktionen unbedingt nötig ist:
        Warenkorb, Zwischenstand in Formularen und Ihre Auswahl auf der Seite{' '}
        <Link href="/rechtliches/cookie-einstellungen">Cookie-Einstellungen</Link> – im lokalen
        Speicher Ihres Browsers (siehe 2.{liste.findIndex((e) => e.id === 'browser') + 1}). Fotos
        und Unterlagen, die Sie in einem Formular auswählen, werden dagegen sofort an uns übertragen
        (siehe 2.{liste.findIndex((e) => e.id === 'dateien') + 1}).
      </p>
      <p>
        Bei einer Online-Zahlung leiten wir Sie auf die Bezahlseite von Stripe weiter. Was dort
        gespeichert wird, regelt die Datenschutzerklärung von Stripe.
      </p>

      <h2>6. Videoüberwachung, Aufzeichnung und Zutrittsprotokollierung</h2>
      <p>
        Wenn wir für Sie Videoüberwachung, Alarmtechnik oder elektronische Zutrittskontrolle
        planen und einrichten, sind <strong>Sie als Betreiberin oder Betreiber</strong> für die
        rechtmäßige Nutzung dieser Anlagen verantwortlich. Das betrifft insbesondere die
        Ausrichtung von Kameras, die Aufzeichnungsdauer, die Kennzeichnung überwachter Bereiche,
        die Information betroffener Personen sowie die Auswertung von Zutrittsprotokollen.
      </p>
      <p>
        Verdeckte Audioüberwachung bieten wir nicht als Standardprodukt an. Gegensprech- und
        Alarmfunktionen richten wir ausschließlich für zulässige Einsatzzwecke ein.
      </p>

      <h2>7. Pflicht zur Bereitstellung und automatisierte Entscheidungen</h2>
      <p>
        Für Bestellungen, Termine und Anfragen brauchen wir die als Pflichtangabe gekennzeichneten
        Daten; ohne sie können wir den Vertrag nicht schließen oder Ihre Anfrage nicht bearbeiten.
        Eine automatisierte Entscheidungsfindung einschließlich Profiling (Art. 22 DSGVO) findet
        nicht statt.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben im gesetzlichen Rahmen das Recht auf</p>
      <ul>
        <li>Auskunft über die zu Ihnen gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO),</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO) und</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
      </ul>
      <p>
        <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Verarbeiten wir Daten auf Grundlage
        berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO), können Sie aus Gründen, die sich aus
        Ihrer besonderen Situation ergeben, jederzeit widersprechen.
      </p>
      <p>
        Zur Ausübung Ihrer Rechte genügt eine formlose Nachricht
        {email ? (
          <>
            {' '}an <a href={`mailto:${email}`}>{email}</a>
          </>
        ) : (
          ' an die oben genannte Anschrift'
        )}
        .
      </p>
      <p>
        Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77
        DSGVO). Für uns zuständig ist:
        <br />
        <br />
        Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
        <br />
        Gustav-Stresemann-Ring 1
        <br />
        65189 Wiesbaden
        <br />
        <a href="https://datenschutz.hessen.de" target="_blank" rel="noopener noreferrer">
          datenschutz.hessen.de
        </a>
      </p>

      <h2>9. Sicherheit</h2>
      <p>
        Die Website wird ausschließlich über eine verschlüsselte Verbindung (TLS) ausgeliefert.
        Formulardaten und Datei-Uploads werden über dieselbe geschützte Verbindung übertragen.
        Hochgeladene Unterlagen liegen in einem nicht öffentlichen Speicher.
      </p>

      <h2>10. Stand</h2>
      <p>
        Fassung {VERARBEITUNGEN_FASSUNG.nummer}, Stand {formatDateShort(VERARBEITUNGEN_FASSUNG.stand)}.
        Ändern sich unsere Verarbeitungen oder die Rechtslage, passen wir diese Erklärung an.
      </p>
    </>
  );
}
