# E4-BAUMEISTER-08 · Bericht und Abnahme

Workflow `wf_2c413c54-12a`. Bau, Prüfung Runde 1 (bestanden). Abnahme und Nacharbeit durch den Orchestrator siehe D-026.

## Bericht des Baumeisters

=== E4-BAUMEISTER-08 · Bericht ===

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/autoschluessel/marken/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/autoschluessel/marken/[make]/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/vehicle-facts.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/vehicle-facts.test.ts (neu angelegt)

WAS UND WARUM
- Marken-Übersicht: Kopf mit Primärknopf (Prop pfeil); Einordnung 7/5 mit Bildstelle (visual schluessel/transponder, anzahl 3); Herstellerliste als Stückliste (zwei Spalten ab lg, ganze Zeile Link, Modellzahl in Mono, KeyKindBadges, Pfeil); Alert unverändert; Nächster Schritt und Passend dazu nur Tokens (min-h-touch, Zwölfer-Raster 7/5).
- Markenseite: Kennzahlen als Schriftfeld; Einordnung 7/5; Modelltabelle ab md ohne min-w und ohne table-scroll (Kopf in Etikett-Stil, Baujahre in Mono); unter md dieselben Daten als Stückliste mit Details-Link (min-h-touch). Bildstelle unverändert (Profilschnitt). Links und Query unverändert.
- Modellseite: Fakten bleiben SummaryList; Einordnung als Stückliste mit 01–04 in text-primary (Kopf 5/7); Abschnitt Schlüsselarten im Detail als großer Moment nach den Angaben (Id schluesselarten-detail): je erfasster Bauform eine Zeichnung über SCHLUESSELARTEN_REIHE; Keyless als Zusatz beim Smart Key, sonst eigene Zeile; Fußzeile Schematische Darstellung; Bildstelle mit visual schluessel (typ der ersten zeichenbaren Art, anzahl min(3, Zahl)). Warnhinweis und Abschluss nur Tokens. Assistent-Link und Link-Bedingungen (Z. 304–312 alt) unverändert.
- vehicle-facts.tsx: formatModelYears gibt bei fehlendem yearFrom „nicht erfasst“ (statt Platzhalter); neuer Export hatBaujahre(model). Signaturen und übrige Exporte unverändert.
- vehicle-facts.test.ts: prüft mit und ohne yearFrom, mit yearTo, offenes Ende und dass kein Platzhalter-Text erscheint.

Alt-Neu-Liste (Mikrotexte und Texte)
- Baujahre fehlend: „[Platzhalter: Baujahre noch nicht erfasst]“ → „nicht erfasst“ (Tabelle, Fakten, Lead, Karte, Titel, Description).
- Modellseite Fakten, Erfasste Schlüsselarten leer: „[Platzhalter: noch nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos]“ → „nicht erfasst — wir klären das anhand Ihrer Schlüsselfotos“.
- Modellseite Titel: „Marke Modell Autoschlüssel (Baujahre)“ → Klammer entfällt bei fehlenden Baujahren; Description nennt Baujahre nur bei erfassten Baujahren.
- Modellseite Lead: „Baujahre: X.“ nur bei erfassten Baujahren.
- Modellseite Baujahr-Karte: bei fehlenden Baujahren „Für dieses Modell sind die Baujahre nicht erfasst.“ statt „… die Baujahre [Platzhalter] erfasst.“
- Einzahl: Marken-Übersicht Einleitung „Für 1 Marke mit insgesamt 1 Modell“, Description „1 Fahrzeugmarke / 1 Modell“; Markenseite „Zu X ist bei uns 1 Modell hinterlegt.“ und Description „1 Modell mit Baujahr“.
- Markenseite Satz „Im Datensatz sind … erfasst: …“ entfällt bei leerer Schlüsselartenliste (statt „erfasst: .“).
- Modellseite Beschreibungskarte ohne Platzhalter-Fallback „[Platzhalter: Beschreibung dieser Schlüsselart ergänzen]“ (unerreichbar bei den fünf Schlüsselarten); Feld zeigt dann keine Beschreibung.

GEMEINSAME DATEIEN
- Keine geändert.
- Keine Werte ohne Token übrig (werte-suche: 0 Funde in den fünf Dateien).
- Beobachtet, nicht angefasst: /home/user/schluesselmacher24/src/components/layout/page-header.tsx hat sich während des Laufs geändert (Seitenwechsel-Anker, B-13). Meine Seiten nutzen PageHeader ohne bereich und sind davon nicht betroffen.
- Beobachtet, nicht angefasst: /home/user/schluesselmacher24/src/app/(site)/autoschluessel/page.tsx hat eine offene Änderung aus E3-BAUMEISTER-07.

PRÜFUNG UND ERGEBNIS
- tsc (npx tsc --noEmit): Exit 0, ohne Fehler.
- eslint auf den fünf Dateien: 0 Fehler. Eine Warnung (ungenutzte Hilfsfunktion) behoben.
- vitest (npx vitest run src/components): 27 Dateien, 747 Tests bestanden; 5 davon neu. Keine bestehende Prüfung gelockert oder gelöscht.
- werte-suche (fünf Dateien): null Funde. Protokoll: /root/sm24-bilder/E4-BAUMEISTER-08/werte-suche.json.
- grep lucide-react in den Dateien: kein Treffer.
- Sperrdatei /tmp/sm24-messfenster.lock: zu keinem Zeitpunkt vorhanden; tsc, vitest und Bilder liefen ohne Wartezeit.
- Entwicklungsserver Port 3001: lief (HTTP 200), nicht selbst gestartet.
- Keine neuen Abhängigkeiten, kein 'use client', kein neues Client-JavaScript.
- Props-Verträge unverändert; Datenzugriffe, generateStaticParams, notFound, Sortierung, Zählungen und Query-Parameter unverändert.
- Abweichungen von der Vorgabe nur wie unten benannt (Raster 1–3 Felder, Reihenfolge, Zählung der Bildstelle).

ENTSCHEIDUNGEN UND AUSLEGUNGEN
- „Schlüsselarten im Detail als großer Moment (oben)“: Der Abschnitt steht jetzt direkt nach „Das ist zu diesem Modell hinterlegt“. Bitte bestätigen (siehe offene Fragen).
- Raster der Detailreihe: 4 Felder wie vorgegeben (sm:grid-cols-2 lg:grid-cols-4); 1 Feld ohne Spaltenvorgabe, 2 Felder sm:grid-cols-2, 3 Felder sm:grid-cols-3, damit keine leere Zelle entsteht.
- Mobile Modelltabelle und Tabelle sind zwei Kopien im DOM (md:hidden bzw. hidden md:block), wie vorgegeben.
- Bewegung: sm24-reveal und motionStyle je Zelle der Detailreihe (höchstens vier Zellen bei gültigen Daten).
- Einordnungsliste Modellseite: Textgröße text-small (K-005a), Nummern in text-title.

BILDBELEGE
- Ganzseitenbilder (mobil/tablet/desktop) je Seite:
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken__mobil__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken__tablet__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken__desktop__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen__mobil__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen__tablet__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen__desktop__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen-golf__mobil__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen-golf__tablet__ganz.jpg
  - /root/sm24-bilder/E4-BAUMEISTER-08/autoschluessel-marken-volkswagen-golf__desktop__ganz.jpg
- Großer Moment (B-21), Einzelbilder bei 0, 225, 450, 675, 900 ms:
  - /root/sm24-bilder/E4-BAUMEISTER-08/b21/autoschluessel-marken-volkswagen-golf__desktop__schluesselarten-detail__0.jpg bis __4.jpg
  - Protokoll: /root/sm24-bilder/E4-BAUMEISTER-08/b21/bewegung.json
- Protokolle der Bildläufe: /root/sm24-bilder/E4-BAUMEISTER-08/bild-*.json
- Befunde im Bild: Tabelle bei 768 px passt ohne Scrollen; Stückliste der Marken zweispaltig; Keyless-Feld im Auftritt (Bild 2) noch im Einblenden, sonst sauber.

OFFENE FRAGEN
1. „(oben)“ für den großen Moment ist als Verschiebung nach den Angaben ausgelegt. Bitte bestätigen oder zurück an die alte Position.
2. Bildstelle Modellseite: anzahl zählt nur Arten mit Zeichnung (ohne Keyless). Bei einem Modell nur mit Keyless bleibt die Bildstelle ohne visual.
3. Markenseite: Der Satz „Bei allen hier erfassten Modellen …“ steht auch bei 0 Modellen. Nicht geändert.
4. Modellseite: Doppelter Link „Andere Golf-Modelle“ und „Alle Volkswagen-Modelle“ führen auf dieselbe Seite. Unverändert.
5. Markenseite Tabelle: Der Scrollbereich table-scroll mit Tastaturzugang entfällt mit dem Wegfall des seitlichen Scrollens. Bitte bestätigen.
6. Werkstattmotive der Bildstellen bleiben als Text erhalten, werden aber bei gesetztem visual nicht ausgegeben. Die Markenbildstelle zeigt damit Transponder statt Rohlingen im Regal.
7. Indexierung: Die Modellseite ist ohne Platzhalter, wenn Baujahre fehlen. Ob sie vor dem Livegang auf noindex soll, ist offen.

=== ENDE E4-BAUMEISTER-08 · BEREIT ZUR RÜCKGABE ===

## Prüfung Runde 1 · bestanden

- **hinweis:** Modellseite: Der Abschnitt Schlüsselarten im Detail steht jetzt vor Einordnung (src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx, id schluesselarten-detail). Das Paket schreibt (oben) und ist an dieser Stelle mehrdeutig. Bitte bestätigen.
- **hinweis:** Modellseite, Schlüsselart-Karten: keyKindDescription gibt string oder undefined zurück. Ein unbekannter Wert würde eine leere Textzeile erzeugen. Bei den fünf Schlüsselarten tritt das nicht auf.
- **hinweis:** Markenseite, mobile Stückliste: Das Label Fahrzeug vor Ort bricht auf zwei Zeilen um, das Info-Symbol sitzt am rechten Rand. Lesbar, ohne Überlauf.
- **hinweis:** Testdatei src/components/autoschluessel/vehicle-facts.test.ts ist neu und untracked. Sie steht nicht in den Schreibrechten, wird in den Grenzen aber verlangt. Zur Kenntnis.
- **hinweis:** Fremd, nicht Teil des Pakets: Der geteilte Footer zeigt auf allen geprüften Seiten den Text Hinweis für die Redaktion: Firmendaten sind noch Platzhalter. Bitte getrennt an den Verantwortlichen für Footer und Firmendaten melden.
- **hinweis:** Prüfer-Eigenfehler: Die tsc-Ausgabe wurde als /root/sm24-bilder/tsc-r1.txt im Oberordner angelegt statt im Prüfordner. Neue Datei, nichts überschrieben oder gelöscht.
- **hinweis:** Bild B-21, Einzelbild 0 (0 ms) ist im Startzustand leer. Das ist die Animationsphase vor dem Einblenden, kein Befund. Einzelbild 4 (900 ms) ist vollständig und korrekt.

Prüfungen: tsc (npx tsc --noEmit): Exit 0, keine Fehler. eslint auf den fünf Paketdateien: Exit 0, 0 Befunde. vitest (npx vitest run src/components): 27 Dateien, 747 Tests bestanden, 0 fehlgeschlagen; davon vehicle-facts.test.ts mit 5 Tests (neu). werte-suche (fünf Dateien): 0 Funde, 0 Ausnahmen, Protokoll /root/sm24-bilder/E4-BAUMEISTER-08-pruefung-r1/werte-suche.json. grep lucide-react in den fünf Dateien: kein Treffer. Sperrdatei /tmp/sm24-messfenster.lock: zu keinem Zeitpunkt vorhanden. Entwicklungsserver Port 3001: HTTP 200, nicht gestartet. Logikwächter: nicht anwendbar. Bewegungsprotokoll: 49 Animationen, Fenster 0–900 ms, keine unendlichen Animationen. Keine Projektdatei geändert, nichts gelöscht, nichts committet.
