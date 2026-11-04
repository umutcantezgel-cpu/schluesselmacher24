# E6-OPUS-04 · Kundenstatus in einfacher Sprache, Vorgangsblatt mit allen Angaben, Anzahlung ohne Funkstille

Paket der Etappe E6, Welle 5 (Opus, Klasse L). Anforderungen G-25, G-37, E-57, E-58, E-60, E-119, E-120. Commit c9e50f3. Gebaut am 2026-11-04 zwischen 09:40 und 10:45: Erkundung durch drei Haiku-Kundschafter (Karte im Scratchpad), Teil 2 durch einen Haiku-Baumeister mit Gegenprüfer und Nachbesserung (Paketdatei E6-OPUS-04-T2), Teile 1 und 3 durch den Orchestrator, Gegenprüfung des Ganzen durch drei Haiku-Skeptiker mit getrennten Blickwinkeln.

## Ergebnis
- **Kundenstatus (G-25, E-58):** `lib/kundenstatus.ts` ist die eine Quelle für Name, Erklärung und Seitentitel jedes Status. Vorgangsseite und Terminstatus nennen denselben Status gleich (vorher etwa „Wartet auf Ihre Rückmeldung“ gegen „Rückfrage an Sie“). Foto-Anfrage und Einsendung haben eigene Sätze, die Freigabe nennt Preis und Zahlung nur mit gesetztem Preis. Erledigte Vorgänge versprechen keine weiteren Schritte; bei storniertem Termin steht dort „Termin neu buchen“. Jeder Statuswechsel durch das Team schreibt einen Kundeneintrag in den Verlauf.
- **Sendung (G-25):** Nach dem Versand zeigen Vorgangsseite und Terminstatus Dienstleister, Sendungsnummer und Verfolgungslink. Im Backend ist der Versand jetzt auch bei Schlüssel nach Vorlage eintragbar; die Versandmail nennt dort Schlüssel, Original und Kopien statt „Bestellung“.
- **Vorgangsblatt (G-37):** Preis vom Server, Bestätigungen des Kunden (Bezeichnungen wie im Backend), Lieferung und Versand; „Vorschau unten“ nur für wirklich gezeichnete Bilder, mit Hinweis bei mehr als sechs Fotos. A-015 unverändert. Die Eingangsmail an das Team sagt, ob das Blatt anhängt oder nicht erzeugt werden konnte.
- **Anzahlung (E-57 bis E-120):** Telefontermine tragen im Backend den Hinweis „ohne Online-Anzahlung“ (A-039). Automatisches Storno steht mit Grund in den Notizen. Bleibt die Anzahlung zu einem laufenden Termin aus, bekommt das Team eine Mail, der Kunde liest „Wir melden uns“ statt „neu buchen“. Der Rückruf-Hinweis verweist auf das Mailprotokoll, statt eine Zustellung zu behaupten. „Termin neu buchen“ belegt den Assistenten mit dem Fahrzeug vor und verknüpft den neuen Termin mit dem alten (nur storniert, nur dieselbe E-Mail-Adresse).

## Prüfung
- Prüfstufe A: Typprüfung und Lint ohne Befund, Unit 2226 von 2226 (vorher 2185), DB 97 von 97 (der Test zum veralteten Backend-Formular belegt jetzt: Systemeintrag bleibt, Kundeneintrag folgt), Build grün.
- Funktionsliste F-03, F-04, F-08, F-18 bestanden (protokolle/funktionsliste-2026-11-04_10-12-52.md).
- Gegenprüfung Teil 2: zwei Befunde mittel (doppelte Dateinamen, PDF-Grundriss in der Zählung) vom Nachbesserer behoben, Wortlaut ohne Vorschau und fehlende Preisfelder vom Orchestrator.
- Gegenprüfung des Ganzen: elf Befunde mittel und niedrig, alle behoben oder entschieden: Team-Mail nicht bei Absage oder Abschluss; Freigabe ohne Preis; Einsendung ohne Foto-Rückfrage; „Freigegeben“ ohne Ausführungszusage; Widerspruch „nichts mehr zu tun“ neben „neu buchen“; Termin in Bearbeitung ohne Neubuchung (Seite und Aktion); Tests für Statusabruf, Versand-Tab, Telefonfeld und Team-Mail; Lesefehler beim Folgetermin bricht keine Buchung ab; virtuelles Feld liefert nur bei Telefonterminen einen Wert; „E-Mails“ wie im Backend; keine Zeitzusage „in Kürze“.

## Offen
- Sichtprüfung der Statusseiten mit echten Vorgängen in allen Status folgt in E6-PROBENUTZER-01.
- Bestand: Gedankenstriche in Mail-Betreffs („– SM24-…“) und in der Meldung „Die Reservierung ist abgelaufen – bitte …“; für die Prüfstufe B vorgemerkt.
- Die Partner-Betriebsmail trägt das Blatt, nennt den Anhang aber nicht (niedrig).
