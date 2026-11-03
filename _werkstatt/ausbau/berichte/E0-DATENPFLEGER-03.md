# E0-DATENPFLEGER-03 · Anforderungs-Spur

Stand 2026-11-02 · Branch claude/affectionate-knuth-n7mjur · Code-Stand HEAD 1f6f85f · nur Lesen außer der Ausgabedatei

## GEÄNDERTE DATEIEN
- `_werkstatt/ausbau/erhebung/anforderungen-EL-M-E.json`: neu, 253 Einträge, gültiges JSON.
- Diese Berichtsdatei. Sonst keine Datei geändert, nichts committet.

## WAS UND WARUM
- **EL: 79 Einträge** aus dem Ergänzenden Leitfaden. Jede Soll-Aussage ist ein Eintrag. Elemente von Formularfeld-, Seiten- und Schrittlisten stehen einzeln, etwa die zehn Felder des Partnerformulars und die fünf Hauptseiten. Projektstand und Kopfzeilen sind nicht übernommen.
- **M: 36 Einträge** aus MENSCHEN.md. M-17 ist erledigt und entfällt. M-02 und M-10 sind erledigt bis auf einen Restpunkt und stehen drin.
- **E: 138 Einträge** aus EVALUIERUNG.md: Abschnitt 4 (45 Zeilen mit Ist ungleich Soll), Abschnitt 5.5 (15 Fehler), Abschnitt 6 (65 Ideen, siehe offene Frage 1), Abschnitt 10 (13 Punkte).
- Der Bestand ist am aktuellen Code geprüft, nicht an der Evaluierung. Diese ist teilweise überholt: Partnerseite und Partnerformular, Foto-Freigabe, Terminerinnerungen, Anzahlungsobergrenze, ABUS/BKS im Schließanlagen-Konfigurator und Druckansichten sind jetzt im Code.

## BESTAND JE QUELLE

| Quelle | vorhanden | teilweise | fehlt | nicht pruefbar | Summe |
|---|---|---|---|---|---|
| EL | 37 | 27 | 1 | 14 | 79 |
| M | 0 | 10 | 5 | 21 | 36 |
| E | 35 | 61 | 23 | 19 | 138 |
| gesamt | 72 | 98 | 29 | 54 | 253 |

## DIE ZEHN WICHTIGSTEN FEHLENDEN ANFORDERUNGEN
1. E-50: Eine unbezahlte Bestellung lässt sich ohne Warnung als „Versendet“ speichern (Fehler 5).
2. E-08 und E-117: Rechnung bzw. Zahlungsbeleg am Auftrag fehlt (PL 06, I-62).
3. M-03: 52 Codelinien ohne Hersteller (`content/code-lines.json:6`). Blockiert EL-04, E-11 und E-24.
4. M-19: FAQ-Antwort zur Bearbeitungsdauer ist noch Platzhalter (`src/app/(site)/schluessel-nach-vorlage/page.tsx:213`).
5. E-14: Bauformen und Zusatzkomponenten je Hersteller fehlen (PL 09, I-39).
6. E-59: Preisgruppe A ist keinem Fahrzeug zugeordnet (Fehler 14).
7. E-62: Preisvorschau ab Schritt 7 fehlt (I-02).
8. E-94: Die Kasse bietet keine Abholung ohne Lieferanschrift (I-36).
9. E-95: Kleinbestellungen sind nicht abgesichert (I-37).
10. E-65: Zusatzschlüssel lassen sich im selben Termin nicht ankreuzen (I-06).

## GEMEINSAME DATEIEN
Keine gewünschten Änderungen.

## PRÜFUNG UND ERGEBNIS
- JSON mit `python3 -m json.tool` geprüft: gültig. 253 Einträge, Kennungen eindeutig, M-17 nicht enthalten, alle `status` "offen", `pakete` leer, `beleg` null.
- Jede `fundstelle` zeigt auf eine vorhandene Quellzeile. Die Textprüfung ergab nur bei M-05 eine Abweichung, und zwar nur in der Großschreibung. Jede `bestand_fundstelle` existiert in Datei und Zeile. Zehn Stichproben mit `sed -n` bestätigt.
- "fehlt" nur nach Suche mit zwei Suchbegriffen, sonst "nicht pruefbar".
- 82 Einträge ohne `bestand_fundstelle`: 54 nicht pruefbar, 23 fehlt, 4 teilweise, 1 vorhanden. Bei EL-75, EL-76, E-23, E-45 und E-136 ist der Bestand ein Sammelbefund ohne eine Zeile.

## BELEGE
- Quellen: `docs/leitfaden/Ergaenzender-Leitfaden-2026-10-08.txt`, `docs/gestaltung/MENSCHEN.md`, `docs/wert/EVALUIERUNG.md`.
- Arbeitsdateien mit Einträgen und Prüfskript: `/tmp/claude-0/-home-user-schluesselmacher24/32e5ae2d-ba98-54a7-b6bd-638f5566c75b/scratchpad/` (el.tsv, m.tsv, e.tsv, gen.py).

## OFFENE FRAGEN
1. Abschnitt 6 hat keinen Status "offen". Ich habe Ideen mit "besteht" oder "neu" aufgenommen und "verworfen" (I-03, I-13, I-47, I-50) sowie "zurückgestellt" (I-51) ausgeschlossen. Bitte bestätigen. Ohne diese Ideen entfielen 65 E-Einträge.
2. 35 Evaluierungsbefunde sind im Code als vorhanden erkennbar. Ob sie als erledigt gelten, entscheidet der Inhaber je Eintrag.
3. 54 Einträge "nicht pruefbar": Entscheidungen des Inhabers (Abschnitt 10, Preise, Öffnungszeiten), Rechts- und Normprüfungen, Betriebsaufgaben (Backup, Konten, LUCID, AV-Verträge) und Terminpunkte. `.env`-Dateien habe ich nicht gelesen.
4. Widersprüche im Repo (E-126 bis E-129): Öffnungszeiten, Preise, Terminort und Firmensitz in den Mails. Auflösung durch den Inhaber.
5. EL-78 (Partner-Matching) ist ein späterer Schritt und als "fehlt" eingetragen. Der Orchestrator kann ihn als DANACH führen.
