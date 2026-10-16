# E5-BAUMEISTER-25 · Bericht und Abnahme (Projekt-Konfigurator Schließanlagen)

1 Prüfrunde, Prüfurteil: bestanden. Abnahme durch den Orchestrator:

- **Bilder:** Funktionsliste F-06 gegen Port 3001 mit Schrittbildern: bestanden (11 Schritte, Absenden als Attrappe); Vorschlag desktop gesichtet (`/root/sm24-bilder/L-B24-25/abschluss4.jpg`).
- **Nacharbeit Vorschlag:** Der Plan steht ab `lg` rechts neben dem Text (7/5), darunter in voller Breite (640–1023 px höchstens `max-w-lg`, unter 640 px die schmale Fassung mit Schrift 12 bis an den Kartenrand), damit die Beschriftung auf Telefonen lesbar bleibt (KERN 1.8). Neue Unterschrift „Schema des Systems – nicht Ihr Schließplan“ (Mikrotext), weil die Zeichnung Standardwerte zeigt, nicht die Türen des Kunden.
- **Nacharbeit Ordnung:** „Noch unsicher?“ trägt die Nummer 01 statt 02 – der Konfigurator selbst zählt seine Schritte in der FlowShell.
- **Logikwächter:** benannte Ausnahme für die Zuordnung Systemname → Generator-Parameter (`params={{ system: … }}`, zweimal: schmal und breit) in `logik-ausnahmen.json`; Prüfung „gleich“.
- **Alt-Neu (Mikrotext):** „Geplante Schlüssel insgesamt: 12“ → „Geplante Schlüssel insgesamt: 12 Stück“ (Einheit zum Wert, bestätigt).

## Prüfurteil

- **soll:** Schlüsselzahl: Der Zusatz „Stück“ hinter der Zahl (projekt-konfigurator.tsx, Schritt Schlüssel, ca. Z. 1694–1700) ist neuer Inhalt, den das Paket nicht nennt. KERN K-010 verlangt keine neuen Inhalte. Der Baumeister stellt die Frage selbst (Offene Frage 3).
- **soll:** Abschnittsnummer: „02 Fragen“ (page.tsx Z. 70) hat keine „01“. Der Formularabschnitt davor trägt keine Nummer, die Reihenfolge wirkt lückenhaft. Entweder den Formularabschnitt nummerieren oder die Nummer weglassen.
- **soll:** Vorschlag-Zeichnung (Z. 1864–1868) zeigt feste Standardwerte, im Schritt-11-Bild vier Türen und zwei Gruppen, nicht die Angaben des Kunden. Das Paket verlangt nur das vorgeschlagene System. Die Zeichnung kann dennoch als Abbild des Projekts gelesen werden (Offene Frage 2, Entscheidung beim Orchestrator).
- **soll:** Bildbeleg fehlt: Vorschlag mit Schließplan-Zeichnung auf mobil und tablet ist nicht belegt. Die Lesbarkeit der Zeichnungsbeschriftung (mindestens etwa 11,5 px nach KERN 1.8) ist für diese Stelle ungeprüft. Erfolgsansicht ist ebenfalls nicht gesehen (Absenden wäre nötig).
- **hinweis:** Logikwächter: Teil B meldet bis zur Eintragung eine Abweichung (projekt-konfigurator.tsx Z. 1866, params={{ system: … }}). Der Ausdruck liest nur, das Mapping ist vollständig, weil recommend() immer einen der vier SYSTEM_NAMES liefert. Ein unbekannter Wert fiele in SchliessplanGrafik auf „haupt“ zurück (schliessplan.tsx Z. 322). Der Orchestrator muss ihn in logik-ausnahmen.json eintragen. Teil A ist unverändert.
- **hinweis:** Arbeitskopf ohne Fach-Icon: Das Paket verlangt es, D-041 und die Orchestrator-Entscheidung sagen nein. Umsetzung folgt D-041 (page.tsx Z. 48–49, art="arbeit"). Bitte bestätigen.
- **hinweis:** Bestand-Block (projekt-konfigurator.tsx Z. 1251) hat pt-6, das Paket nennt pt-4 für Listenzeilen und Bestand-Block.
- **hinweis:** Link „Systeme noch einmal nachlesen“ im Vorschlag (ca. Z. 1857) ist alleinstehend, hat aber kein min-h-touch. Das Paket verlangt min-h-touch für alleinstehende Links. Der Text bleibt im Satz, daher nur Hinweis.
- **hinweis:** Vorschlag-Raster: Text 7/5, Zeichnung 5 Spalten, Zeichnungskasten sm:p-5 statt Muster sm:p-6. Das Paket schreibt „5/7“ ohne Eindeutigkeit. Bitte bestätigen, ob die Zeichnung klein bleiben soll.
- **hinweis:** Versionsangaben widersprechen sich: Paket KERN 1.11, Baumeister KERN 1.12, Prüfauftrag KERN 1.8. Das Ergebnis ist nach 1.12 und D-041 gebaut. Nicht nachgeprüft, welche Version gilt.
- **hinweis:** Eigener Ablagefehler: Das tsc-Protokoll liegt unter /root/sm24-tsc-r1.txt statt im Paketordner /root/sm24-bilder/E5-BAUMEISTER-25-pruefung-r1/. Ich kann es nicht löschen. Meine übrigen Hilfsdateien liegen im Prüfordner.
- **hinweis:** Testzahl weicht ab: Vitest zeigt 64 Dateien und 1127 Tests, der Baumeister nennt 62 und 1118. Die Differenz stammt aus Tests anderer Pakete, nicht aus diesem Paket. Alle sind grün.

## Bericht des Baumeisters

GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/app/(site)/schliessanlagen/konfigurator/page.tsx
- /home/user/schluesselmacher24/src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx

WAS UND WARUM
page.tsx:
- lucide ArrowRight entfernt, GlyphPfeilRechts importiert (K-008a).
- PageHeader mit bereich="schliessanlagen" und art="arbeit". Ohne Fach-Icon im Kopf (D-041, siehe OFFENE FRAGEN).
- „Noch unsicher?“ als SectionHeading mit nummer="02" und eyebrow="Fragen" (neue Augenbraue, Mikrotext).
- Sechs Link-Karten als Stückliste mit Haarlinien: border-t und border-b, ganze Zeile ist der Link, Titel text-body font-semibold, Text text-small text-foreground-muted, GlyphPfeilRechts mit B-06 (Hover-Verschiebung, zeiger:), focus-visible-Ring, min-h-touch. „Ansehen“ entfällt (K-010). Ab md zweispaltig mit Spaltenabstand md:pr-10, damit die Pfeile nicht an die Nachbarspalte stoßen.
- Freie Werte nach K-005a: text-[15px] zu text-body, text-[14px] zu text-small, text-[13px] zu text-small.

projekt-konfigurator.tsx (nur JSX, className, JSX-Texte, Importe aus @/components/visual/):
- Importe: lucide-react (ArrowRight, Plus, Trash2) entfernt; GlyphPapierkorb, GlyphPfeilRechts, GlyphPlus, CheckDraw, SchliessplanGrafik aus @/components/visual/ ergänzt.
- Question: Titel text-small font-semibold, Hinweis text-small leading-snug text-foreground-muted (statt foreground-subtle).
- ListRow: Karte mit Rahmen durch Haarlinie border-t pt-4 ersetzt. Positionstitel als Mono-Etikett (font-mono text-caption uppercase tracking-label text-foreground-muted). Entfernen-Knopf min-h-touch, Glyph GlyphPapierkorb 16 px, Hover-Fläche surface-muted, Hover danger bleibt.
- Erfolgsansicht: Wurzel role="status"; CheckDraw (56 px) über der Meldung; Vorgangsnummer als Schriftfeld (Haarlinien, Mono-Label, Kennung font-mono text-title-sm tabular-nums); Schrittliste als Haarlinienliste mit Mono-Ziffer ohne Kreis; Überschriften text-title; Zusammenfassung SummaryList variante="schriftfeld".
- Fehler-Alert: role="alert".
- Schlüsselzahl im Schritt Schlüssel in font-mono tabular-nums, mit „Stück“.
- Bestand-Block (Schritt 4): Karte durch Haarlinie border-t pt-6 ersetzt.
- Abschluss: Vorschlag als Card mit Augenbraue (.eyebrow, „Vorschlag aus Ihren Angaben“) links 7/5, daneben rechts 5/7 die statische Schließplan-Zeichnung (SchliessplanGrafik, Papier bg-surface, mobil darunter). Systemtitel text-title-sm; Gründe text-small; Pfeil GlyphPfeilRechts.
- Kontaktdaten und Überblick: h3 text-title-sm; Zusammenfassung schriftfeld; Einwilligung min-h-touch.
- Alle Plus-Pfeile durch GlyphPlus ersetzt (drei Stellen). Alle Einzelwerte in text-[..], min-h-[..], tracking-wider, text-sm, text-lg, text-xl, text-2xl und text-xs entfernt.
- Unverändert: Hooks, Zustände, Handler, STEPS, INITIAL, recommend, SYSTEM_NAMES, buildSummary, doorLine, validateStep, Speicherschlüssel, FLOW_ID, alle Texte mit Inhalt, HINT-Konstanten, page.tsx-Datenladen und Bauform-Filter.

GEMEINSAME DATEIEN
- Ausnahme Logikwächter (wörtlich): params={{ system: ({ [SYSTEM_NAMES.gleichschliessung]: 'gleichschliessung', [SYSTEM_NAMES.z]: 'zentral', [SYSTEM_NAMES.hs]: 'haupt', [SYSTEM_NAMES.ghs]: 'generalhaupt' } as Record<string, string>)[recommendation.system] }} – Zuordnung des vorgeschlagenen Systems auf den Schließplan-Generator (reines Lesen, kein Handler, keine Bedingung). Der Orchestrator trägt sie ein; logik-ausnahmen.json unverändert.
- Wunsch: recommendation.system trägt nur den Anzeigenamen, daher die Zuordnung über SYSTEM_NAMES. Eine Schlüssel-Konstante wäre sauberer, läge aber in Teil A (nicht erlaubt).
- Versionshinweis: Paket nennt KERN 1.11, Aufgabe nennt 1.12. Gearbeitet nach 1.12 und D-041.
- Gemeinsame Dateien (globals.css, tailwind.config.ts, Registry, Layout, Bausteine) nicht verändert.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Fehler.
- npx eslint (beide Dateien): ohne Befund.
- npx vitest run src/components src/lib: 62 Dateien, 1118 Tests, grün. Keine Tests geändert oder gelockert.
- werte-suche.mjs (JSON: /root/sm24-bilder/E5-BAUMEISTER-25/werte-suche.json): keine Funde.
- grep lucide-react in beiden Dateien: kein Treffer.
- Logikwächter pruefen: Teil A gleich; Teil B nur die eine benannte Ausnahme.
- Gerendertes HTML (/root/sm24-bilder/E5-BAUMEISTER-25/seite.html): grep nach [Platzhalter, [PLZ], [Ort] ohne Treffer.
- Funktionsliste --nur F-06 (SM24_SCHRITTBILDER=/root/sm24-bilder/E5-BAUMEISTER-25/schritte): BESTANDEN, 11 Schritte, Absenden als Attrappe, kein Datensatz geschrieben. Das Werkzeug hat sein Protokoll im Standardordner _werkstatt/protokolle abgelegt.
- Bild-Sichtung: mobil, tablet und desktop ohne Abschnitt, Überlauf oder Leerfläche; Stückliste im Desktop-Raster mit Spaltenabstand nach Korrektur; Vorschlag im Abschlussschritt mit Zeichnung neben dem Text.
- Fehler in fremden Dateien: keine.
- Hilfsdateien: Eine Prüfdatei liegt unter /tmp/sm24-probe.html (Verstoß gegen die Ablagevorgabe; nicht im Repository; nicht löschbar). Maßgeblich ist /root/sm24-bilder/E5-BAUMEISTER-25/seite.html.
- Nicht geprüft: Erfolgsansicht (würde Absenden auslösen), Tablet-Bild des Vorschlags, Bedienung mit Tastatur am Gerät.

BILDBELEGE
- /root/sm24-bilder/E5-BAUMEISTER-25/schliessanlagen-konfigurator__mobil__ganz.jpg
- /root/sm24-bilder/E5-BAUMEISTER-25/schliessanlagen-konfigurator__tablet__ganz.jpg
- /root/sm24-bilder/E5-BAUMEISTER-25/schliessanlagen-konfigurator__desktop__ganz.jpg
- /root/sm24-bilder/E5-BAUMEISTER-25/schritte/01-wer-plant-das-projekt-.jpg
- /root/sm24-bilder/E5-BAUMEISTER-25/schritte/11-zusammenfassung-und-kontakt.jpg
- Protokolle: /root/sm24-bilder/E5-BAUMEISTER-25/bild-mobil.json, bild-tablet.json, bild-desktop.json

OFFENE FRAGEN
1. Arbeitskopf: Das Paket verlangt ein Fach-Icon, D-041 sagt ohne Icon. Umgesetzt ohne Icon. Bitte bestätigen.
2. Schließplan-Zeichnung zeigt Standardwerte (zwei Gruppen, vier Türen), nicht die Angaben. Die Regel „entfällt ohne Vorschlag“ ist nicht umgesetzt, da recommend immer ein System liefert. Soll die Zeichnung Anzahl Türen und Gruppen aus den Angaben übernehmen?
3. Neue Mikrotexte: Augenbraue „02 Fragen“ bei „Noch unsicher?“ und „Stück“ hinter der Schlüsselzahl. Bitte bestätigen oder ablehnen.
4. Erfolgsansicht und Vorschlag auf dem Tablet sind nicht als Bild belegt.
5. B-20 (Summen mit wechselndem key) für die Schlüsselzahl nicht umgesetzt, da das Paket es nicht verlangt.

=== ENDE E5-BAUMEISTER-25 · BEREIT ZUR RÜCKGABE ===
