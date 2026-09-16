import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'Allgemeine Geschäftsbedingungen von SCHLÜSSELMACHER24.',
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return (
    <>
      <h1 className="text-[1.75rem] font-bold leading-tight md:text-3xl">
        Allgemeine Geschäftsbedingungen
      </h1>
      <p className="mt-3">
        Die folgende Gliederung bildet ab, welche Punkte für unser Leistungsspektrum geregelt
        werden müssen. Der verbindliche Wortlaut wird juristisch erstellt.
      </p>

      <h2>1. Geltungsbereich und Vertragspartner</h2>
      <p>
        [Platzhalter: Für welche Verträge die Bedingungen gelten, Abgrenzung Verbraucher und
        Unternehmer, Vorrang individueller Vereinbarungen.]
      </p>

      <h2>2. Vertragsschluss</h2>
      <p>
        [Platzhalter: Ablauf im Shop (Bestellung als Angebot, Annahme durch uns), Ablauf bei
        geführten Anfragen und Projektkonfiguratoren (zunächst kein Vertragsschluss, sondern
        Anfrage), Ablauf bei Terminbuchung mit Anzahlung.]
      </p>

      <h2>3. Preise, Preisrahmen und Prüfvorbehalt</h2>
      <p>
        [Platzhalter: Wann ein fester Preis gilt, wann nur ein Preisrahmen genannt wird und wie
        mit Fällen umgegangen wird, die erst nach Prüfung verbindlich kalkuliert werden können.
        Regelung zur Abweichung nach Prüfung und zum Rücktrittsrecht beider Seiten.]
      </p>

      <h2>4. Anzahlung und Zahlung</h2>
      <p>
        [Platzhalter: Höhe und Zweck der Anzahlung, Anrechnung auf den Gesamtpreis, Fälligkeit des
        Restbetrags, zulässige Zahlungsarten, Verzug.]
      </p>

      <h2>5. Termine, Verschiebung und Absage</h2>
      <p>
        [Platzhalter: Verbindlichkeit gebuchter Termine, Fristen für Verschiebung und Absage durch
        den Kunden, Folgen einer Absage, Vorgehen bei Absage durch uns, Regelung bei Nichterscheinen.]
      </p>

      <h2>6. Mitwirkungspflichten des Kunden</h2>
      <p>
        [Platzhalter: Richtigkeit und Vollständigkeit der angegebenen Fahrzeug-, Schlüssel-,
        Code- und Objektdaten, Bereitstellung des Fahrzeugs beim Termin, Zugang zum Objekt bei
        Montagen, Folgen fehlerhafter Angaben — insbesondere bei nach Kundenangabe gefertigten
        Schlüsseln.]
      </p>

      <h2>7. Nachweis der Verfügungsberechtigung</h2>
      <p>
        [Platzhalter: Diese Regelung ist für unser Gewerbe zentral. Festzulegen ist, welche
        Nachweise wir vor der Anfertigung von Schlüsseln, vor Fahrzeugöffnungen und vor Arbeiten an
        Schließanlagen verlangen, wie diese Nachweise dokumentiert werden und wann wir eine
        Leistung ablehnen.]
      </p>

      <h2>8. Lieferung und Versand</h2>
      <p>
        [Platzhalter: Lieferzeiten, Teillieferungen, Gefahrübergang, Versandarten, Vorgehen bei
        Verlust auf dem Transportweg.]
      </p>

      <h2>9. Eigentumsvorbehalt</h2>
      <p>[Platzhalter: Regelung zum Eigentumsvorbehalt.]</p>

      <h2>10. Gewährleistung und Haftung</h2>
      <p>
        [Platzhalter: Gesetzliche Mängelrechte, Fristen, Haftungsumfang, Abgrenzung bei
        Sicherheitstechnik und Schließanlagen, Ausschlüsse im gesetzlich zulässigen Rahmen.]
      </p>

      <h2>11. Schließanlagen, Sicherungskarten und Erweiterungen</h2>
      <p>
        [Platzhalter: Umgang mit Sicherungskarten, Voraussetzungen für Nachbestellungen,
        Aufbewahrung von Schließplänen, Dauer der Erweiterbarkeit, Folgen eines Verlusts der
        Sicherungskarte.]
      </p>

      <h2>12. Sicherheitstechnik und Verantwortung des Betreibers</h2>
      <p>
        [Platzhalter: Abgrenzung unserer Leistung (Planung, Lieferung, Montage, Einweisung) von
        der Betreiberverantwortung des Kunden für den rechtmäßigen Betrieb von Video-, Alarm- und
        Protokollfunktionen.]
      </p>

      <h2>13. Datenschutz</h2>
      <p>[Platzhalter: Verweis auf die Datenschutzerklärung.]</p>

      <h2>14. Streitbeilegung</h2>
      <p>[Platzhalter: Angaben zur Verbraucherstreitbeilegung.]</p>

      <h2>15. Schlussbestimmungen</h2>
      <p>[Platzhalter: Anwendbares Recht, Gerichtsstand, salvatorische Klausel, Textform.]</p>
    </>
  );
}
