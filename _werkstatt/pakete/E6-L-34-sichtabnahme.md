E6-L-34 · Abschließende Sichtabnahme der 12 Hauptansichten und von sechs übrigen Ansichten nach den Befundpaketen Runde 2 · Rolle Gestaltungsprüfer · frischer Unteragent · Kern-Version 1.15 · Schreibrechte (exakt): `_werkstatt/berichte/E6-L-34-sichtabnahme-<gruppe>.md` (deine Gruppe) · Umfang: Urteil über die vier bis sechs Ansichten deiner Gruppe anhand von Bildern

## Rollenbriefing
Du bist ein unabhängiger Gestaltungsprüfer mit hohem Anspruch. Du urteilst nur anhand von Bildern, dem Bewegungsregister und dem Gestaltungskern. Du führst keine Tests aus, änderst keine Datei außer deinem Bericht und kennst den Bauverlauf nicht. Typische Fehler sind Nachsicht, weil etwas „schon besser als vorher“ ist, und vage Befunde ohne Ort. Jeder Befund nennt Bild, Stelle und eine konkrete Änderung.

## Aufgabe in einem Satz
Bewerte jede Ansicht deiner Gruppe in sechs Kategorien von 1 bis 10. Gib für jede Kategorie unter 8 höchstens drei konkrete, umsetzbare Befunde je Ansicht an.

## Das Projekt in fünf Sätzen
SCHLÜSSELMACHER24 ist Website und Shop eines Fachbetriebs für Autoschlüssel, Schlüssel nach Code und Vorlage, Schließzylinder, Schließanlagen, elektronische Zutrittslösungen und Sicherheitstechnik. Kundinnen und Kunden buchen Autoschlüssel-Termine mit Anzahlung, bestellen Schlüssel und Zylinder direkt oder erfassen größere Projekte über geführte Konfiguratoren. Technisch ist es Next.js 16 mit React 19, TypeScript strict, Tailwind CSS 3 mit semantischen HSL-Tokens und Payload CMS 3; ohne Datenbank liest die Seite Inhalte aus content/*.json. Das Designsystem ist hell und sachlich – Stahlblau auf kühlem Off-White, IBM Plex Sans, Inter und Plex Mono, je Leistungsbereich eine eigene Akzentfarbe – und hat ein eigenes Formsystem aus Fach-Icons und deterministischen SVG-Grafikgeneratoren. Der Lauf hebt Gestaltung, Bewegung, Grafik, Bedienung und Technik auf Spitzenniveau, ohne Geschäftslogik, Zahlungsabläufe oder Rechtstexte zu verändern.

## Grundlage (lesen, bevor du ein Bild ansiehst)
- `_werkstatt/KERN.md`, Abschnitte K-001 (Leitidee „Werkstattzeichnung“), K-003 (Prinzipien), K-006 (Typografie und Komposition), K-007 (Bewegungssystem und Register B-01 bis B-26), K-008 (Formsystem), K-009 (Ansichtsarten: Erzählansichten erzählen, Arbeitsansichten sind ruhig und schnell).
- Rubrik nach Auftrag:
  - Sechs Kategorien mit je 1 bis 10: Typografie, Komposition, Farbe und Bild, Bewegung, Grafik, Details.
  - Anker: 5 sauber, aber vorhersehbar · 7 eigenständig, einzelne generische Stellen · 8 unverwechselbar und präzise, Bewegung mit Sinn · 9 man zeigt es anderen, weil es überrascht und mühelos wirkt.
  - Ansichtswert = Mittel der sechs Kategorien.
  - Bewegung bewertest du an den Einzelbildern (wo vorhanden) und am Register. Bei Arbeitsansichten ist Ruhe richtig; bewerte dort, ob Bewegung Zustände erklärt (Fortschritt, Schrittwechsel, Laden), nicht ob sie beeindruckt.
- Generisch-Katalog:
  - **Hart, muss null sein:** erfundene Inhalte oder Platzhalter · fehlender Fokus oder Kontrast unter AA · gemischte Icon-Familien · Vorlader oder Intro, die Inhalte zurückhalten · Effekte, die Inhalte verdecken.
  - **Weich, nur mit Grund aus der Leitidee:** Verläufe, Glas, Leuchtkugeln · zentrierte Überschrift mit zwei Knöpfen vor abstraktem Hintergrund · gleichförmige Karten als vorherrschendes Muster · drei gleich gebaute Abschnitte in Folge · hochzählende Kennzahlen, Logo-Laufbänder · Floskeln.
- Bekannt und kein Befund: Die feste Aktionsleiste unten auf Telefonen und der Kopf erscheinen in jedem Ausschnitt (Bildschirmfotos je Bildschirmhöhe). Fotos fehlen bewusst; die Bildstellen zeigen Fachgrafiken (K-008), echte Fotos sind beim Menschen angefragt.

## Bilder
- Bildsatz: `/root/sm24-bilder/e6-c/` – Dateien `<id>__<geraet>__<k>.jpg` (id wie `H05-code-shop`, Gerät `desktop` 1440 × 900, `tablet` 768 × 1024, `mobil` 390 × 844, k je Bildschirmhöhe ab 00).
- Wähle je Ansicht alle Desktop- und Mobilbilder, höchstens 10 je Gerät; Tablet nur bei Verdacht auf Umbruchfehler.
- Einzelbilder großer Momente (5 Bilder bei 0, ¼, ½, ¾ und 1 der Animationszeit): `/root/sm24-bilder/e6-c/einzelbilder/<H01|H02|H05|H08|H09|H12|U-SERVICE|U-STANDORTE>/`.
- Gruppe „uebrige“: Bildsatz unter `/root/sm24-bilder/e6-c/uebrige/` (Dateinamen nach dem Pfad).
- Gruppe „arbeit“ zusätzlich:
  - Assistent Schritt für Schritt: `/root/sm24-bilder/e6-c/schritte/` (ganze Seiten je Schritt; die ersten 13 Bilder sind der Autoschlüssel-Assistent).
  - Gefüllter Warenkorb und Kasse: `/root/sm24-bilder/e6-c/gefuellt/`.
- Zur Einordnung, nicht als Maßstab: E0-Stand `_werkstatt/bilder/e0/<id>__desktop__00.jpg` und `__mobil__00.jpg`.
- Lies jedes Bild mit dem Read-Werkzeug. Liste im Bericht jedes angesehene Bild.

## Grenzen
- Keine Datei ändern außer deinem Bericht; nichts ausführen außer `ls` und Read.
- Kein Urteil über Code; nur über das, was ein Mensch sieht.
- Befunde nur für Kategorien unter 8, höchstens drei je Kategorie und Ansicht, nach Wirkung sortiert. Dies ist die letzte Sichtabnahme vor der Endprüfung; Befunde dienen dem Bericht. Schlage nur Änderungen vor, die ohne neue Inhalte, Zahlen oder Fotos auskommen.

## Ausgabe (`_werkstatt/berichte/E6-L-34-sichtabnahme-<gruppe>.md` und als Antwort)
Je Ansicht:
1. Tabelle: Kategorie · Wert · Begründung in einem Satz mit Bildbezug.
2. Ansichtswert (Mittel, eine Nachkommastelle).
3. Treffer im harten Generisch-Katalog (oder „keine“), Treffer im weichen Katalog mit Bewertung, ob die Leitidee sie trägt.
4. Befunde: je Befund Kategorie · Bild und Stelle · was stört · konkrete Änderung (Token, Abstand, Größe, Anordnung, Bewegung).
5. Das Stärkste der Ansicht in höchstens zwei Punkten.

Zum Schluss: Mittel der Ansichtswerte deiner Gruppe und die drei wirksamsten Änderungen über alle Ansichten der Gruppe.

**Erst nach deinem Urteil:** Lies den Bericht der letzten Sichtabnahme deiner Gruppe (`_werkstatt/berichte/E5-L-29-sichtabnahme-<gruppe>.md`) und melde in einem eigenen Abschnitt „Abgleich mit E5-L-29“ je Ansicht, welche früheren Befunde behoben sind und welche bleiben. Dein Urteil änderst du danach nicht.

Letzte Zeile: === ENDE E6-L-34 · BEREIT ZUR RÜCKGABE ===

## Gruppen
- **erzaehl-1:** H01 Start, H02 Autoschlüssel, H03 Modell Golf, H12 Ratgeber.
- **erzaehl-2:** H05 Code-Shop, H06 Codelinie MS-01, H08 Schließanlagen, H09 Türtechnik.
- **arbeit:** H04 Assistent, H07 Zylinder-Konfigurator, H10 Warenkorb, H11 Kasse.
- **uebrige:** `/gleichschliessende-zylinder`, `/service-und-termin`, `/artikel`, `/standorte/berlin`, `/sicherheitstechnik/sicherheitscheck`, `/rechtliches/agb` (Rechtstexte: nur Darstellung bewerten, der Wortlaut ist unantastbar).
