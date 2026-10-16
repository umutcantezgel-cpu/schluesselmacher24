# E5-BEFUND-H11 · Bericht und Abnahme (Kasse)

3 Prüfrunden; letztes Prüfurteil: nicht bestanden (2 Muss im gemeinsamen Baustein `SummaryList`). Nach L3 Nacharbeit und Abnahme durch den Orchestrator:

- **Muss Kennungen ohne Umbruch:** `SummaryList` (Schriftfeld) setzt Kennungen wie „MS-01“ auch in der Beschriftung in Mono ohne Umbruch (Bild desktop: „MS-01“ in einer Zeile).
- **Muss Text und Mono getrennt:** Werte „Angaben · Betrag“ stehen zweizeilig – Angaben klein und gedämpft, darunter der Betrag in Mono (`betragAmEnde`, Tests). Gilt für alle Schriftfeld-Zusammenfassungen.
- **Logikwächter:** drei benannte Anzeige-Ausnahmen (Gesamtbetrag im einklappbaren Kopf und über dem Knopf, zweite Übersicht im Kopf); Prüfung „gleich“. `role="alert"` am Fehler nach dem Absenden ist gesetzt.
- **Entschieden:** Beschriftungsspalte bleibt 5/12 (rund 42 %); Einleitung im Formular statt im Kopf (Wortlaut gleich); doppelte Übersicht mobil (einklappbar oben, voll vor dem Knopf) nach B-09 bestätigt.
- **Bilder und Funktion:** gefüllt, mobil, Tablet und desktop (`/root/sm24-bilder/L-H10-11/`); Funktionsliste F-02 gegen Port 3001: bestanden.

## Prüfurteil (letzte Runde)

- **muss:** Kennungen brechen um: „Büroschrank und Rollcontainer — Serie MS-01“ bricht ab Tablet zwischen „MS-“ und „01“ (dt-Beschriftung in summary-list.tsx Zeile 76, ohne MonoText/nowrap; sm:col-span-5). Paket-Befund Typografie 2 und Entscheidung „Kennungen ohne Umbruch“ sind nicht erfüllt; die Aussage „das liefert der Baustein“ trifft für Beschriftungen nicht zu. Beleg: gefuellt/kasse-gefuellt__desktop__00.jpg, gefuellt/kasse-gefuellt__tablet__02.jpg. Behebung nur in summary-list.tsx (außerhalb der Schreibrechte).
- **muss:** Textanteile mischen Inter und Mono in einer Wertzeile: „Code 0812 · 2 Stück · 16,00 €“, „Versand verfolgbar · 4,95 €“. Paket-Befund Typografie 1 verlangt Textanteile als eigene text-small-Zeile über dem rechtsbündigen Betrag; nicht umgesetzt (summary-list.tsx Zeile 87, MonoText). Belege: gefuellt/kasse-gefuellt__desktop__00.jpg, gefuellt/kasse-gefuellt__tablet__02.jpg, gefuellt/kasse-gefuellt__mobil__03.jpg.
- **hinweis:** Logikwächter kasse-formular.tsx ABWEICHEND nur in Teil B mit drei neuen Ausdrücken: sections={uebersicht} (mobiles Akkordeon, Zeile 394) und zweimal {formatCents(summen.totalCents)} (Zeilen 386 und 696). Reine Anzeige, vom Baumeister gemeldet. Teil A ohne Abweichung. Eintrag in _werkstatt/werkzeuge/logik-ausnahmen.json steht noch aus (Orchestrator).
- **hinweis:** page.tsx: prop lead der PageHeader entfernt; die Einleitung „Bitte geben Sie Ihre Kontakt- und Lieferdaten an …“ steht jetzt im Formular (Lade- und Befüllzustand, im Leerzustand ausgeblendet). Wortlaut unverändert; die Verlagerung ist im Bericht des Baumeisters nicht als Entscheidung benannt.
- **hinweis:** Kern-Version uneindeutig: Paket nennt 1.10, Auftrag nennt 1.12 als maßgeblich. Geprüft gegen den Paketauszug und die 1.12-Punkte Arbeitskopf ohne Fach-Icon (Abschnittsköpfe 01–03 ohne Icon, eingehalten) und Alert role (vorhanden). Bitte Version bestätigen.
- **hinweis:** Die übrigen Befunde sind belegt erfüllt: Abschnittsnummern als eyebrow mit Bemaßungsmarke (desktop__00), leere Angaben gedämpft (mobil__00), Akkordeon mit Gesamtbetrag (mobil__00), Gesamtbetrag über dem Knopf (mobil__03), Leerzustand mit Fach-Icon ohne Einleitung (kasse__desktop/mobil__ganz), Bestätigungskarten gleich breit (desktop__02, Kanten 132 bis 805 px), role=alert im Klicktest auf allen drei Geräten.

## Bericht des Baumeisters (letzte Runde)

E5-BEFUND-H11 · Rolle Baumeister · Modell Haiku 5.5 · Kasse (Befundpaket 1 von höchstens 2) · KERN 1.12 (das Paket nennt 1.10)

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/kasse/kasse-formular.tsx (JSX, className, Importe aus @/components/visual/; Logik unverändert)
- /home/user/schluesselmacher24/src/app/(site)/kasse/page.tsx (lead-Prop aus PageHeader entfernt; Text wandert ins Formular)

WAS UND WARUM
1. Mobil oben einklappbare Bestellübersicht (Komposition 1): Nach dem Warnkasten steht ein details/summary (lg:hidden), Zeile „Bestellübersicht · 20,95 €“. Geöffnet zeigt es die Übersicht (SummaryList, Schriftfeld, leer=„Noch nicht ausgefüllt“). Pfeil dreht über group-open, Inhalt blendet mit sm24-fade (B-09). Die volle Übersicht bleibt vor dem Knopf.
2. Gesamtbetrag über dem Knopf mobil (Details 3): Zeile „Gesamtbetrag“ links, Betrag rechts in font-mono text-title-sm font-semibold tabular-nums text-foreground, nur unter lg.
3. Abschnittsnummern 01/02/03 als .eyebrow mit Bemaßungsmarke, Nummer in text-foreground-muted tabular-nums (Muster SectionHeading). Die Titel bleiben text-title.
4. Bestätigungskarten gleich breit (Komposition 2): Der InfoTip sitzt in der zweiten Karte rechts oben. Die Karte ist ein div mit label flex-1 p-4 und InfoTip-Container shrink-0 pr-4 pt-4. Der InfoTip liegt damit nicht mehr in der label, damit Feldname und Panel nicht den Checkbox-Namen verfälschen. Die erste Karte ist unverändert.
5. Leere Angaben gedämpft (Details 1): SummaryList erhält leer="Noch nicht ausgefüllt". Der Baustein setzt diese Werte in text-small text-foreground-muted.
6. Leerzustand wie im Warenkorb (Details 2): IconWarenkorb size 48 text-primary über der Überschrift „Ihr Warenkorb ist leer“, Absatz text-small text-foreground-muted. Mindesthöhen min-h-60/sm:min-h-44 bleiben, damit sie zur Ladekarte passen.
7. Einleitung im Leerzustand ausgeblendet: Die Einleitung „Bitte geben Sie Ihre Kontakt- und Lieferdaten an. Danach sehen Sie die vollständige Bestellübersicht.“ steht jetzt als p (max-w-measure text-body text-foreground-muted) im Formular, im Ladezustand und bei gefülltem Warenkorb, nicht im Leerzustand. Der Text ist wortgleich.
8. Endsumme bleibt text-foreground (Farbe und Bild), Primärblau nur für den Knopf.

Mikrotexte: keine Änderung. Alt-Neu-Liste leer; Texte wortgleich.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter: uebersicht (in sections={uebersicht} des Mobil-Akkordeons) – zweite Anzeige derselben Übersicht, nur Lesen.
- Ausnahme Logikwächter: formatCents(summen.totalCents) (Summary des Akkordeons) – reine Formatierung zur Anzeige.
- Ausnahme Logikwächter: formatCents(summen.totalCents) (Zeile Gesamtbetrag über dem Knopf) – reine Formatierung zur Anzeige.
- Arbitrary `[&::-webkit-details-marker]:hidden` am summary (Safari-Marker). Nicht in KERN.
- `group-open:rotate-180` und das InfoTip-Panel im offenen Zustand sind nicht im Bild belegt (siehe OFFENE FRAGEN).

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: ohne Fehler.
- eslint (page.tsx, kasse-formular.tsx): ohne Befund.
- vitest run src/components src/lib: 62 Dateien, 1114 Tests grün.
- werte-suche.mjs --json /root/sm24-bilder/E5-BEFUND-H11/werte-suche.json: 0 Funde.
- grep lucide-react: kein Treffer.
- Platzhalter-Grep im HTML /kasse: 0 Treffer.
- Logikwächter pruefen: kasse-formular.tsx ABWEICHEND nur in Teil B mit den drei oben genannten Lese-Ausdrücken. Teil A gleich. page.tsx ist nicht geschützt. sichern nicht ausgeführt, damit die Basis unverändert bleibt.
- Kein neues Client-JavaScript, keine neuen Abhängigkeiten. Hooks, Handler, Zustände, Speicherschlüssel, Berechnungen, Props und Fehlertexte unverändert. Zahlungsablauf nicht berührt, nichts abgesendet.
- Keine Datei gelöscht, nichts committet oder gepusht. Hilfsdateien nur unter /root/sm24-bilder/E5-BEFUND-H11/.
- Keine Fehler in fremden Dateien. Der Arbeitsbaum enthält fremde Änderungen (logik-ausnahmen.json, gleichschliessende-zylinder/konfigurator.tsx), die ich nicht angefasst habe.

BILDBELEGE (Ordner /root/sm24-bilder/E5-BEFUND-H11/)
- kasse__mobil__ganz.jpg, kasse__tablet__ganz.jpg, kasse__desktop__ganz.jpg (Leerzustand, bild.mjs): Leerbaustein mit Icon, keine Einleitung. Geprüft.
- gefuellt/kasse-gefuellt__desktop__00.jpg: Zweispalten-Kasse, Übersicht rechtsbündig, Kennungen ohne Umbruch, Endsumme in Textfarbe, Abschnittsnummern als Eyebrow. Geprüft.
- gefuellt/kasse-gefuellt__desktop__02.jpg: Bestätigungskarten gleich breit, InfoTip rechts oben. Geprüft.
- gefuellt/kasse-gefuellt__mobil__00.jpg: einklappbare Zeile „Bestellübersicht · 20,95 €“ unter dem Warnkasten, Einleitung oben. Geprüft.
- gefuellt/kasse-gefuellt__mobil__04.jpg: Zeile „Gesamtbetrag 20,95 €“ direkt über dem Knopf. Geprüft.
- klick-leer__mobil.jpg und klick-leer__desktop.jpg: Klick auf „Zahlungspflichtig bestellen“ ohne Pflichtangaben. Fehlermeldungen für Vorname, Nachname, E-Mail und Telefon, Hinweis „Bestellung noch nicht abgeschickt“. Keine Absendung. Protokoll: klick-leer.json.
- Die übrigen gefüllten Bilder (Tablet, Desktop 01/03, Mobil 01–03/05–06, Warenkorb) liegen im Ordner gefuellt/, wurden aber nicht einzeln geprüft.

OFFENE FRAGEN
1. Doppelte Übersicht mobil: Das Akkordeon oben und die volle Übersicht vor dem Knopf enthalten dieselben Zeilen. Bitte bestätigen, ob das so gewollt ist.
2. Die Einleitung steht jetzt im Formular und nicht mehr im PageHeader. Sie fehlt nach dem Abschluss. Bitte bestätigen.
3. B-20 (Summen-Schleier bei Änderung) ist nicht umgesetzt, weil das Paket es nicht nennt.
4. Im geöffneten Zustand sind der Pfeil und das InfoTip-Panel nicht fotografiert. Das Panel könnte am rechten Rand überstehen. Bitte bei der Abnahme prüfen.

=== ENDE E5-BEFUND-H11 · BEREIT ZUR RÜCKGABE ===
