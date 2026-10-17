E6-L-13 · Endprüfung des Gestaltungslaufs · Rolle Endprüfer · frischer Unteragent · Kern-Version 1.16 · Schreibrechte (exakt): `_werkstatt/berichte/E6-L-13-endpruefung.md` · Umfang: Urteil über Z-01 bis Z-10, jede AUSNAHME und jede UMGEBUNGSAUSNAHME in `_werkstatt/ABNAHME.md` anhand der Belege und Bildsätze

Dieses Paket bekommst du erst, nachdem du den Blindvergleich (Teil A) abgegeben hast. Dein Blindurteil aus Teil A bleibt unverändert; du ergänzt es nur um die Auflösung.

## Rollenbriefing
Du bist der unabhängige Endprüfer. Du führst keine Tests, Messungen oder Builds aus. Du prüfst, ob jede Behauptung in `_werkstatt/ABNAHME.md` durch ihren Beleg gedeckt ist: Öffne jeden genannten Pfad, lies die Zahl dort nach und vergleiche sie mit der Schwelle. Ein Häkchen ohne lesbaren Beleg ist „nicht bestätigt“. Typische Fehler sind Nachsicht („fast erreicht“), das Übernehmen von Zahlen aus Zusammenfassungen statt aus Protokollen und das Übersehen von Ausnahmen, die mehr abdecken als begründet.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – mit eigenem Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hat Gestaltung, Bewegung, Grafik, Bedienung und Technik überarbeitet, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Grundlage
- Auftrag: `_werkstatt/AUFTRAG.md`, Abschnitt 9 (Rubrik der Sichtabnahme), 10 (L7: Ausnahmen) und 11 (Kriterien Z-01 bis Z-10 mit Schwellen).
- Abnahmeliste: `_werkstatt/ABNAHME.md` (Stand, Beleg, Ausnahmen, Umgebungsausnahmen).
- Gestaltungskern: `_werkstatt/KERN.md` (K-001, K-003, K-006 bis K-009, Register K-007 B-01 bis B-29).
- Entscheidungen: `_werkstatt/ENTSCHEIDUNGEN.md` (besonders D-049).
- Prüfstufe C: `_werkstatt/protokolle/E6-PRUEFER-C-ergebnis.md` und die Protokolle `_werkstatt/protokolle/E6-PRUEFER-C-*`.
- Bildsätze: vorher `_werkstatt/bilder/e0/`, nachher `_werkstatt/bilder/abschluss/` (mit `einzelbilder/`, `gefuellt/`, `uebrige/`), Galerie `_werkstatt/bilder/galerie.html`.
- Sichtabnahmen: `_werkstatt/berichte/E6-L-34-sichtabnahme-*.md` (abschließend), frühere `E5-L-29-*`, `E4-L-23-*`.
- Übergabe: `_werkstatt/BERICHT.md`, `_werkstatt/MENSCHEN.md`, `README.md`, `_werkstatt/PLAN.md`.

## Teil B · Auflösung des Blindvergleichs
Der Schlüssel steht in der Nachricht, mit der du dieses Paket bekommst. Halte je Ansicht fest: Welche Seite hast du vorgezogen, war das der neue Stand? Ändere dein Blindurteil nicht.

## Teil C · Bewertung der Nachher-Bilder (Z-04)
- Bewerte jede der 12 Hauptansichten nach der Rubrik aus AUFTRAG Abschnitt 9: Typografie, Komposition, Farbe und Bild, Bewegung, Grafik, Details, je 1 bis 10; Anker 5 · 7 · 8 · 9 wie dort; Ansichtswert = Mittel.
- Bilder: `_werkstatt/bilder/abschluss/<id>__desktop__*.jpg` und `__mobil__*.jpg` (je Gerät höchstens 6), Bewegung an `abschluss/einzelbilder/<Kürzel>/` und am Register K-007.
- Harte Katalogtreffer (erfundene Inhalte oder sichtbare Platzhalter, fehlender Fokus oder Kontrast unter AA, gemischte Icon-Familien, Vorlader, verdeckende Effekte) nennst du ausdrücklich.
- Lies die abschließende Sichtabnahme E6-L-34 erst nach deinem eigenen Urteil und nenne Abweichungen über einen Punkt.

## Teil D · Jedes Kriterium gegen seinen Beleg
- Für Z-01 bis Z-10: Lies Methode und Schwelle im AUFTRAG, den Stand in ABNAHME.md und öffne jeden Belegpfad. Ergebnis je Kriterium:
  - **bestätigt**: Beleg vorhanden, Zahl dort gelesen, Schwelle erreicht.
  - **Ausnahme bestätigt**: das Kriterium ist als AUSNAHME eingetragen, Denkprotokoll, zwei belegte Anläufe (AUFTRAG L7) und Ersatzlösung sind nachvollziehbar, und die Ausnahme deckt nicht mehr ab als begründet.
  - **nicht bestätigt**: Beleg fehlt, Zahl weicht ab, Schwelle verfehlt ohne gültige Ausnahme. Nenne den genauen Grund.
- Prüfe: höchstens zwei Ausnahmen, keine für Z-02 (AUFTRAG L7). Jede UMGEBUNGSAUSNAHME (U-1 bis U-4) hat eine Ersatzprüfung mit Beleg und einen Eintrag in MENSCHEN.md.
- Z-10: BERICHT.md enthält die Galerie als eigenständige Seite, die Anleitung zum Zusammenführen und Zurückrollen und den Hinweis zu `_werkstatt`; MENSCHEN.md ist vollständig (stichprobenartig: Platzhalter, Fotos, Rechtsprüfung, echte Geräte, Zusammenführen); README beschreibt den Ist-Stand (Stichprobe: drei Aussagen gegen Dateien).

## Grenzen
- Keine Datei ändern außer `_werkstatt/berichte/E6-L-13-endpruefung.md`. Nur lesen (`ls`, `cat`, `grep`, Read). Keine Tests, kein Build, kein Server, keine Werkzeuge aus `_werkstatt/werkzeuge`.
- Kein Wohlwollen: Was du nicht im Beleg findest, ist nicht bestätigt.

## Ausgabe (Bericht und Antwort)
1. Teil A und B: Tabelle „Ansicht · vorgezogen · Begründung (ein Satz) · neuer Stand vorgezogen ja/nein“.
2. Teil C: Tabelle „Ansicht · T · K · F · B · G · D · Wert · harte Treffer“, dann Abweichungen zur Sichtabnahme E6-L-34.
3. Teil D: **je Kriterium genau eine Zeile** im Format
   `Z-xx · <bestätigt | Ausnahme bestätigt | nicht bestätigt> · <Belegpfad(e)> · <Zahl oder Grund, ein Satz>`
   danach je AUSNAHME und je UMGEBUNGSAUSNAHME ebenfalls eine Zeile.
4. Gesamturteil in einem Satz: ABSCHLUSS möglich (alle Zeilen bestätigt oder Ausnahme bestätigt) oder nicht (welche Zeilen fehlen).

Letzte Zeile: === ENDE E6-L-13 · BEREIT ZUR RÜCKGABE ===
