import type { Metadata } from 'next';
import { getSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Informationen zur Verarbeitung personenbezogener Daten bei SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default async function DatenschutzPage() {
  const settings = await getSettings();
  const { company, retentionDays } = settings;

  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">Datenschutzerklärung</h1>
      <p className="mt-3">
        Diese Seite beschreibt, welche personenbezogenen Daten wir erheben, wozu wir sie
        verwenden und wie lange wir sie aufbewahren.
      </p>

      <h2>1. Verantwortliche Stelle</h2>
      <p>
        {company.legalName}
        <br />
        {company.street}
        <br />
        {company.postalCode} {company.city}
        <br />
        E-Mail: {company.email}
        <br />
        Telefon: {company.phone}
      </p>

      <h2>2. Datenschutzbeauftragte Person</h2>
      <p>
        [Platzhalter: Name und Kontaktdaten der oder des Datenschutzbeauftragten eintragen, sofern
        eine Benennungspflicht besteht. Andernfalls hier vermerken, dass keine Benennungspflicht
        besteht.]
      </p>

      <h2>3. Welche Daten wir verarbeiten</h2>
      <h3>3.1 Beim Aufruf der Website</h3>
      <p>
        [Platzhalter: Server-Logdaten beschreiben — IP-Adresse, Zeitpunkt, abgerufene Seite,
        übertragene Datenmenge, Browsertyp. Rechtsgrundlage, Zweck und Speicherdauer sind vom
        eingesetzten Hosting abhängig und müssen mit dem Hoster abgestimmt werden.]
      </p>

      <h3>3.2 Bei Anfragen, Bestellungen und Terminbuchungen</h3>
      <p>
        Wenn Sie ein Formular, einen Konfigurator oder die Terminbuchung nutzen, verarbeiten wir
        die dort angegebenen Daten, um Ihren Vorgang zu bearbeiten. Dazu gehören insbesondere:
      </p>
      <ul>
        <li>Kontaktdaten: Anrede, Name, Firma, E-Mail-Adresse, Telefonnummer, Anschrift</li>
        <li>Angaben zum Auftrag: Fahrzeugdaten, Schlüsselart, gewünschte Leistung, Schlüsselcode</li>
        <li>Angaben zum Objekt: Türen, Nutzer, Berechtigungen, bestehende Anlagen</li>
        <li>Termin- und Zahlungsangaben zum jeweiligen Vorgang</li>
      </ul>
      <p>
        [Platzhalter: Rechtsgrundlagen ergänzen — in der Regel Vertragserfüllung und
        vorvertragliche Maßnahmen für die Auftragsbearbeitung sowie rechtliche Verpflichtungen für
        die Aufbewahrung. Bitte juristisch prüfen lassen.]
      </p>

      <h3>3.3 Hochgeladene Dateien</h3>
      <p>
        Für die Bearbeitung laden Sie je nach Vorgang Fotos Ihres Schlüssels, Ihren Fahrzeugschein,
        Grundrisse, Türlisten oder Objektfotos hoch. Diese Unterlagen sind sensibel. Wir verwenden
        sie ausschließlich zur Prüfung und Ausführung Ihres Auftrags und geben sie nicht zu
        anderen Zwecken weiter.
      </p>
      <p>
        <strong>Zugriff:</strong> Auf Ihre Unterlagen greifen ausschließlich die intern dafür
        berechtigten Personen zu.
      </p>

      <h3>3.4 Aufbewahrungsfristen</h3>
      <p>Wir haben folgende Fristen für die genannten Unterlagen festgelegt:</p>
      <ul>
        <li>Fahrzeugschein: {retentionDays.vehicleRegistration} Tage</li>
        <li>Schlüsselfotos: {retentionDays.keyPhotos} Tage</li>
        <li>Grundrisse und Objektpläne: {retentionDays.floorPlans} Tage</li>
        <li>Projektunterlagen: {retentionDays.projectDocuments} Tage</li>
      </ul>
      <p>
        [Platzhalter: Gesetzliche Aufbewahrungspflichten für Geschäftsunterlagen und Belege
        ergänzen. Die oben genannten Fristen betreffen nur die hochgeladenen Unterlagen und sind
        juristisch zu bestätigen.]
      </p>

      <h2>4. Empfänger und Auftragsverarbeiter</h2>
      <p>
        [Platzhalter: Alle eingesetzten Dienstleister auflisten — Hosting, Zahlungsdienstleister,
        E-Mail-Versand, Dateiablage, Buchhaltung. Je Dienstleister Zweck, Sitz und Grundlage der
        Übermittlung angeben. Zum jetzigen Zeitpunkt sind Zahlung, Mailversand und Dateiablage
        noch nicht angebunden; sobald ein Dienstleister eingesetzt wird, ist diese Liste zu
        ergänzen und ein Auftragsverarbeitungsvertrag zu schließen.]
      </p>

      <h2>5. Übermittlung in Drittländer</h2>
      <p>
        [Platzhalter: Angeben, ob Daten außerhalb des Europäischen Wirtschaftsraums verarbeitet
        werden und auf welcher Grundlage.]
      </p>

      <h2>6. Cookies und Reichweitenmessung</h2>
      <p>
        Wir setzen nur die Speichermechanismen ein, die für den Betrieb der Website nötig sind.
        Ihr Zwischenstand in Formularen und Konfiguratoren sowie Ihr Warenkorb werden
        <strong> ausschließlich in Ihrem Browser</strong> gespeichert und nicht an uns übertragen,
        solange Sie den Vorgang nicht absenden. Sie können diese Daten jederzeit über Ihren Browser
        löschen.
      </p>
      <p>
        [Platzhalter: Sobald Analyse-, Karten- oder Marketingdienste eingesetzt werden, sind sie
        hier aufzuführen und über die Cookie-Einwilligung zu steuern. Siehe auch die Seite
        Cookie-Einstellungen.]
      </p>

      <h2>7. Videoüberwachung, Aufzeichnung und Zutrittsprotokollierung</h2>
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
      <p>
        [Platzhalter: Konkrete Hinweise zur Beteiligung von Beschäftigtenvertretungen und zur
        Durchführung einer Datenschutz-Folgenabschätzung ergänzen lassen.]
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben im gesetzlichen Rahmen folgende Rechte:</p>
      <ul>
        <li>Auskunft über die zu Ihnen gespeicherten Daten</li>
        <li>Berichtigung unrichtiger Daten</li>
        <li>Löschung</li>
        <li>Einschränkung der Verarbeitung</li>
        <li>Datenübertragbarkeit</li>
        <li>Widerspruch gegen bestimmte Verarbeitungen</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft</li>
        <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
      </ul>
      <p>
        Zur Ausübung Ihrer Rechte genügt eine Nachricht an {company.email}.
      </p>
      <p>
        [Platzhalter: Zuständige Aufsichtsbehörde mit Anschrift eintragen.]
      </p>

      <h2>9. Sicherheit der Übertragung</h2>
      <p>
        Die Website wird über eine verschlüsselte Verbindung ausgeliefert. Datei-Uploads erfolgen
        über dieselbe geschützte Verbindung.
      </p>

      <h2>10. Änderungen dieser Erklärung</h2>
      <p>
        [Platzhalter: Hinweis auf Aktualisierungen und den Stand der Erklärung mit Datum ergänzen.]
      </p>
    </>
  );
}
