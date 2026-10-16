# E5-BEFUND-H04 · Bericht und Abnahme

3 Prüfrunde(n), Prüfurteil: nicht bestanden. Abnahme durch den Orchestrator:

- **Prüfung nach Runde 3 nicht bestanden.** Abnahme mit Nacharbeit und Rest für Befundpaket 2:
  - **F-04 „nicht bestanden“ war ein Werkzeugfehler:** Der Prüfer startete die Funktionsliste aus einer Kopie in einem anderen Ordner; dort fehlen die Lese-Aktionen aus `.next/dev`, der Preisabruf wurde als Attrappe beantwortet. Aus `_werkstatt/werkzeuge/` zweimal bestanden (13 Schritte bis „Termin auswählen“, Absenden als Attrappe). Hinweis an alle Pakete ergänzt.
  - **Tagesleiste (Komposition 1):** im Bild belegt – Tage als Leiste mit Anschnitt, Uhrzeiten im Raster; der Terminschritt ist von rund 14 000 px auf eine Bildschirmhöhe geschrumpft. Uhrzeiten sind Knöpfe mit `aria-pressed`; der Termin kommt aus dem Zustand, nicht aus Formularfeldern (`name="termin"` war folgenlos).
  - **Preisschritt (Farbe 2):** vom Orchestrator umgesetzt: `preis-anzeige.tsx` zeigt Terminlänge und „Fahrzeug beim Termin“ als Schriftfeld mit Haarlinien statt getönter Kästen (gültiges `dl`, Text gleich).
  - **Offen für Befundpaket 2 (H04):** Zeichnungen der Schlüsselarten in Schritt 5 (eigene Komponente, benannte Ausnahme im Logikwächter) und der Modellzähler in `text-caption` (Anpassung der Ausnahme E4-BAUMEISTER-16).

## Prüfurteil

- **muss:** F-04 NICHT BESTANDEN, zweimal reproduziert (funktionsliste --nur F-04, Lauf 1 und 2): Im Schritt „Preis für Ihren Fall“ zeigt der Assistent „Preis konnte nicht ermittelt werden“, „Weiter“ bleibt gesperrt. Der Termin-Schritt mit der Tagesleiste ist im Browser nicht erreichbar. Der Lauf um 11:26 war bestanden. Die Ursache liegt im Preisabruf fetchQuote (src/lib/actions/booking.ts), nicht im Paketcode: assistent.tsx ändert gegenüber 1171973 nur eine className, Datendateien in content/ sind seit 20:19 unverändert. Ursache nicht eingegrenzt; Serverlog ohne Eintrag.
- **muss:** Befund Grafik 1 / Schritt 5 nicht umgesetzt: Die Schlüsselarten-Optionen haben keine Zeichnung (Bild schritte/05-welche-schlüsselart-haben-sie-.jpg, mobil, nur Text). Der Baumeister begründet das mit dem Logikwächter und der Regel, dass Hilfsfunktionen nicht in die Datei gehören. Das Paket verlangt die Zeichnung ausdrücklich, und die Anzeige-Ausdrücke wären meldbar gewesen.
- **muss:** Befund Farbe 2 / Preisschritt nicht umgesetzt: Terminlänge und „Fahrzeug beim Termin“ bleiben getönte Kästen. Die Stelle liegt in preis-anzeige.tsx, außerhalb der Schreibrechte des Pakets. Das Paket kann den Befund mit diesen Rechten nicht erfüllen; die Lücke ist eine Paketdefinition, die der Orchestrator klären muss.
- **soll:** Befund Komposition 3 nur teilweise: Die Marken sind mobil zweispaltig (assistent.tsx Zeile 848, grid-cols-2). Der Modellzähler „n Modelle hinterlegt“ steht aber weiter in Standardschrift (assistent.tsx Zeile 857, Ausnahme E4-BAUMEISTER-16 fixiert das Muster). Das Paketziel „text-caption in foreground-muted“ ist offen und braucht eine Entscheidung zur Ausnahme.
- **hinweis:** Tagesleiste (Befund Komposition 1) ist im Code und in termin-auswahl.test.tsx (6 Tests grün) belegt: Tage mit aria-pressed, nur Tage mit freien Zeiten, erster freier Tag vorgewählt, Zeiten als grid-cols-3 bzw. lg:grid-cols-6. Im Bild ist sie nicht sichtbar, weil Schritt 13 durch den F-04-Fehler nicht erreicht wird. Ungeprüft: Das Entfernen von name="termin" aus der Auswahl ist nur dann folgenlos, wenn keine Formularübermittlung darauf angewiesen ist.
- **hinweis:** Schritt 5: Im Ganzseitenbild überdeckt die angeheftete Weiter-Leiste den Funkschlüssel-Eintrag teilweise. Das ist vermutlich eine Momentaufnahme des angehefteten Elements; im Ansichtsfenster nicht nachgeprüft.
- **hinweis:** Werkzeug-Nebenwirkung: funktionsliste.mjs schreibt die Markdown-Datei immer nach _werkstatt/protokolle im Repository. Vom Baumeister stammen dort vier neue Protokolle (werte-suche-…11-25-37.json, funktionsliste-…11-21-57.md, funktionsliste-…11-26-06.md/.json und Vorläufer). Der Prüfer hat funktionsliste aus einer Kopie unter /root/sm24-bilder/E5-BEFUND-H04-pruefung-r3/werkzeug-kopie ausgeführt und werte-suche mit --json umgeleitet, damit keine neuen Repo-Dateien entstehen.
- **hinweis:** KERN-Version: Das Paket nennt 1.10, der Auftrag 1.8, KERN.md endet bei 1.12. Geprüft wurde nach den Regeln des Paketauszugs (1.10).
- **hinweis:** git status zeigt fremde Änderungen in src/app/(site)/service-und-termin/ (kontakt, Startseite, vor-ort). Sie gehören nicht zu diesem Paket und sind nicht bewertet.

## Bericht des Baumeisters

E5-BEFUND-H04 · Baumeister · Runde 3 (Nachbesserung nach Ablehnung Runde 2)

GEÄNDERTE DATEIEN
- src/app/(site)/autoschluessel/anfrage/assistent.tsx: Import SchluesselGrafik entfernt; Schlüsselart-Option wieder mit title={KEY_KIND_OPTIONS[kind].label}; Modellzähler wieder in der Ausnahmeform description={<><span className="font-mono tabular-nums">{entry.models.length}</span> Modelle hinterlegt</>}. Marke bleibt grid-cols-2 gap-2 (className).
- src/components/autoschluessel/termin-auswahl.tsx und page.tsx: unverändert gegenüber Runde 2 (geprüft, Befunde erfüllt).

WAS UND WARUM
- Logikwächter (Muss 1): Die abweichenden Ausdrücke in assistent.tsx sind entfernt. Der Logikwächter meldet die Datei als gleich zur Basis b49fe04, abweichend 0, keine neuen Ausdrücke in Teil B.
- Ausnahme E4-BAUMEISTER-16 (Muss 2): Das Muster passt wieder (1×).
- Schlüsselart-Zeichnung (Schritt 5, Befund Grafik 1 und Soll 1 und 3): nicht umgesetzt. Jede Zuordnung Schlüsselart → Zeichnung im Assistenten braucht eine Bedingung oder Abbildung, und der Logikwächter weist das ab. Eine Hilfsfunktion in der Datei ist nicht erlaubt. Vorschlag unter GEMEINSAME DATEIEN.
- Preisschritt (Muss 3): nicht umgesetzt. Die getönten Kästen Terminlänge und Fahrzeug beim Termin liegen in preis-anzeige.tsx, außerhalb der Schreibrechte. Unter offene Fragen gemeldet.
- Bericht (Muss 4): jetzt vollständig.
- Tagesleiste (Befund Komposition 1): unverändert erfüllt. Tage als Leiste mit aria-pressed, nur Tage mit freien Zeiten, erster freier Tag vorgewählt, Zeiten des offenen Tages als grid-cols-3 bzw. lg:grid-cols-6. Der Test termin-auswahl.test.tsx prüft das (6 Tests grün).
- page.tsx (Weiterführend): nummer="01", h2 text-title (className), „Ansehen“ entfernt. Unverändert.

ALT-NEU-LISTE DER MIKROTEXTE
- Keine Änderung in dieser Runde gegenüber Runde 2. Der Modellzähler behält seinen Text „n Modelle hinterlegt“ in Standardschrift; der Caption-Befund ist offen.

AUSNAHMEN LOGIKWÄCHTER
- Keine neuen Ausnahmen beantragt. Der Ausdruck entity.models.length im Modellzähler ist über die bestehende Ausnahme E4-BAUMEISTER-16 abgedeckt.

GEMEINSAME DATEIEN
- Wunsch Schlüsselart-Zeichnung: Komponente in src/components/autoschluessel/ (z. B. schluesselart-titel.tsx) mit Props art: KeyKind, die SCHLUESSELARTEN_REIHE nutzt (mechanisch → transponder, funk → funk, klappschluessel → klapp, smart-key → smart-key; keyless ohne Zeichnung). Im Assistenten wäre dann title={<SchluesselartTitel art={kind} />} nötig, mit dem Ausdruck art={kind} als Anzeige-Ausdruck in der Ausnahmeliste.
- Wunsch Preisschritt: preis-anzeige.tsx (außerhalb meiner Rechte): Terminlänge und Fahrzeug beim Termin als Schriftfeld statt getönter Card. Im Assistenten zusätzlich die getönte Karte „Grundlage“, falls der Orchestrator das freigibt.
- Keine Token-Lücken gefunden.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: exit 0, 0 Fehler (runde3/tsc.txt).
- eslint page.tsx, assistent.tsx, termin-auswahl.tsx: exit 0, keine Befunde (runde3/eslint.txt).
- vitest run src/components src/lib: 60 Dateien, 1100 Tests bestanden (runde3/vitest.txt). Keine Tests geändert.
- werte-suche.mjs: 0 Funde, 0 Ausnahmen (runde3/werte.txt).
- grep lucide-react: kein Treffer.
- Logikwächter pruefen assistent.tsx: gleich, abweichend 0, Ausnahme 1× (E4-BAUMEISTER-16).
- funktionsliste --nur F-04: BESTANDEN (13 Schritte, Absenden als Attrappe).
- Platzhalter-Grep im gerenderten HTML: nicht durchgeführt.
- Lock /tmp/sm24-messfenster.lock war nicht vorhanden.

BILDBELEGE
- /root/sm24-bilder/E5-BEFUND-H04/runde3/bilder/ (mobil, tablet, desktop, je ganze Seite).
- /root/sm24-bilder/E5-BEFUND-H04/runde3/schritte/13-termin-auswählen.jpg: mobil zeigt Tagesleiste (FR 23. Okt. 3 frei, MO 26. Okt. 6 frei, DI 27. Okt. 6 frei, MI 28. Okt. 6 frei) und die Zeiten des offenen Tages (09:00, 10:00, 11:00 Uhr mit Dauer 1 Std.).
- /root/sm24-bilder/E5-BEFUND-H04/runde3/schritte/05-welche-schlüsselart-haben-sie-.jpg: Optionen ohne Zeichnung; Weiter-Leiste überdeckt den Funkschlüssel-Eintrag teilweise.

OFFENE FRAGEN
1. Schlüsselart-Zeichnung (Schritt 5): nicht umgesetzt, wegen Logikwächter. Entscheidung nötig: Komponente nach Vorschlag anlegen lassen oder Befund streichen.
2. Preisschritt: preis-anzeige.tsx liegt außerhalb der Rechte; Entscheidung, ob Rechte erweitert werden.
3. Selektor [&_.sm24-draw.stroke-area]:stroke-primary: entfällt mit Entfernung der Zeichnung. Für eine spätere Zeichnung wäre der Ziel-Selektor die Profillinie mit stroke-area-strong (schluessel.tsx Z. 316).
4. Schritt 05: Weiter-Leiste überdeckt den Funkschlüssel-Eintrag teilweise; ob das die Momentaufnahme der Animation ist, nicht im Ansichtsfenster geprüft.
5. Modellzähler als text-caption: nicht umgesetzt, weil Ausnahme E4-BAUMEISTER-16 das Muster exakt festlegt. Entscheidung: Ausnahme anpassen oder Befund verwerfen.
6. KERN-Version: Paket nennt 1.10, Aufgabe 1.8, KERN.md endet bei 1.12. Angewendet: Regeln aus dem Paketauszug.
7. Platzhalter-Grep im gerenderten HTML nicht durchgeführt.
8. Werkzeug-Nebenwirkung: werte-suche.mjs schrieb _werkstatt/protokolle/werte-suche-2026-10-16_11-25-37.json, funktionsliste.mjs schrieb _werkstatt/protokolle/funktionsliste-2026-10-16_11-26-06.md und .json. Neue Dateien im Repository, nicht von mir angelegt; nichts gelöscht.

=== ENDE E5-BEFUND-H04 · BEREIT ZUR RÜCKGABE ===

## Offene Fragen

- Schlüsselart-Zeichnung (Schritt 5, Befund Grafik 1): nicht umgesetzt, weil jede Zuordnung Schlüsselart → Zeichnung im Assistenten eine Bedingung oder Abbildung braucht, die der Logikwächter als Logikanteil abweist; eine Hilfsfunktion in der Datei ist nicht erlaubt. Entscheidung: Komponente nach Vorschlag anlegen lassen (dann Ausnahme für art={kind}) oder Befund streichen.
- Soll-Befund Selektor [&_.sm24-draw.stroke-area]:stroke-primary: entfällt mit Entfernung der Zeichnung und wurde nicht korrigiert. Für eine spätere Zeichnung wäre der richtige Ziel-Selektor die Profillinie mit stroke-area-strong (schluessel.tsx Z. 316), nicht sm24-draw stroke-area.
- Soll-Befund Schritt 05 (blasse Zeichnungen, Leiste verdeckt): Im Bild schritte/05 (runde3) liegt der klebende Weiter-Balken über dem Funkschlüssel-Eintrag und verdeckt dessen Beschreibung. Ob das die Momentaufnahme der Animation ist, habe ich nicht im Ansichtsfenster geprüft; offen.
- Modellzähler in der Markenwahl: Der Befund verlangt text-caption in foreground-muted. Das würde das Muster der genehmigten Ausnahme E4-BAUMEISTER-16 brechen, das den Ausdruck exakt festlegt. Die Ausnahme passt jetzt wieder (1×), der Zähler bleibt in Standardschrift. Entscheidung: Ausnahme anpassen lassen oder Befund verwerfen.
- Versionsangabe: Paket nennt KERN 1.10, Aufgabe nennt 1.8, KERN.md endet bei 1.12. Angewendet: Regeln aus dem Paketauszug. Bitte bestätigen.
- Platzhalter-Grep (curl auf /autoschluessel/anfrage) im gerenderten HTML nicht durchgeführt; bitte nachholen.
- Werkzeug-Nebenwirkung: werte-suche.mjs schrieb _werkstatt/protokolle/werte-suche-2026-10-16_11-25-37.json, funktionsliste.mjs schrieb _werkstatt/protokolle/funktionsliste-2026-10-16_11-26-06.md und .json. Neue Dateien im Repository, nicht von mir angelegt; nichts gelöscht.
