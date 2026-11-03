# E0-KUNDSCHAFTER-03 · Gestaltung, Bewegung, Icons und KERN 1.19

Stand 2026-11-02, Branch claude/affectionate-knuth-n7mjur. Nur gelesen. Pfade relativ zu /home/user/schluesselmacher24.

## GEÄNDERTE DATEIEN
Keine. Geschrieben wurde nur dieser Bericht.

## WAS UND WARUM

### 1 KERN 1.19 (docs/gestaltung/KERN.md, 337 Zeilen)
- K-001 Leitidee, wörtlich: „SCHLÜSSELMACHER24 sieht aus wie eine saubere Werkstattzeichnung: helles Papier, stahlblaue Linien, bemaßte Details in Mono-Schrift – und an den entscheidenden Stellen fräst eine Linie sichtbar das Profil, damit man Genauigkeit sieht, bevor man sie liest.“
- K-002 Marke, Zielgruppe: drei Zielgruppen, sechs Hauptaufgaben (Annahme).
- K-003 Gestaltungsprinzipien: sieben Tun-Lassen-Regeln.
- K-004 Stack: Next 16.3, React 19.2, Tailwind 3.4, Payload 3.90, Schriften über next/font, CSS im Dokument. K-004a: Technikfakten.
- K-005 Designsystem: Tokens, Typoskala, Abstände, Radien, Schatten, Ebenen, Touch-Ziele. K-005a: Umrechnungstabelle.
- K-006 Typografie: Schriften, Ersatzschriften, Raster, Muster E4-L-23, Kleinregeln E5-L-29.
- K-007 Bewegung: Dauern, Kurven, Regeln, Register B-01 bis B-29 (Zeilen 191 bis 221).
- K-008 SVG-Formsystem: Raster, Strichskala, Icon-Familie. K-008a: lucide-Zuordnung.
- K-009 Zustände, K-010 Ton, K-011 Budgets (LCP 2,5 s, CLS 0,1, INP 200 ms), K-012 Glossar. Dazu Annahmen (3) und Änderungen (1.0 bis 1.19).

### 2 Tokens
- Farben: alle HSL-Tripel „H S% L%“ (globals.css:74-127, area-theme.ts:31-103), in Tailwind als hsl(var(…)). Beispiele: background 214 45% 98,6%, foreground 222 34% 15%, primary 214 80% 40% (#145bb8), danger 0 58% 42%. Neun Bereichsfarben mit Farbtonabstand mindestens 30 Grad.
- Skalen: 4-px-Raster, section 56 bis 104 px, shell 1240 px, Radius 10, 6 und 4 px, Schatten raised und overlay, Schrift 12 bis 60 px in neun Stufen (tailwind.config.ts:115-125), Dauern 120, 180, 280, 400, 600, 900 ms, Strich 1,5 px, Icon-Strich 1,75 px.
- Werte außerhalb der Tokens: Die vorgegebene Suche findet 9 Treffer in 5 Dateien, nicht zehn: Marke.tsx (5, Backend), photo-upload.tsx:151, global-error.tsx:71, apple-icon.tsx:18, (site)/layout.tsx:76. Klammerwerte in Klassen: 0. Zusätzlich `.shell-wide` mit 1440 px (globals.css:269).

### 3 Schriften
- IBM Plex Sans (Display, 500, 600, 700): (site)/layout.tsx:18-23, next/font/google.
- Inter (Text, 400 bis 700): layout.tsx:25-30. KERN nennt 400 bis 600.
- IBM Plex Mono (400, 500, 600): layout.tsx:32-37. Alle latin, display swap.
- Ersatzschriften per @font-face, nur local(): globals.css:18-55. OG-Bilder: @fontsource/ibm-plex-sans (src/lib/og/bereichsbild.tsx:63-64).
- Fließtext mobil: Klasse text-body (tailwind.config.ts:118, globals.css:148), 15,0 px bei 390 px Breite, 16 px ab 1.200 px. AUFTRAG 12 verlangt 17 px.

### 4 Bewegung
- Mechanik: 15 Keyframes in globals.css:434-506 und 698, drei in tailwind.config.ts:196-208. Klasse sm24-draw in 14 TSX-Dateien, sm24-reveal in 10, sm24-pop in 12.
- JavaScript-Auslöser: InView (motion/in-view.tsx:43), FraesbahnBewegung (interaktiv/fraesbahn-bewegung.tsx:96-179, WAAPI), Seitenwechsel (motion/seitenwechsel.tsx, ViewTransition), startTransition (layout/site-header.tsx:197).
- Zentrales Modul: keines. Vorhanden sind motion/ (Bausteine) und src/lib/bewegung.ts, das nur prefers-reduced-motion liest. Kein Bewegungsschalter, kein Pause-Knopf, keine gespeicherte Wahl. Die Zeigerart regelt die Tailwind-Variante zeiger: (tailwind.config.ts:227).
- Reduziert: globale Regel globals.css:717-732, 19 motion-reduce-Klassen, bewegungReduziert() in JavaScript.
- data-motion: nur die Zustände wait und play (in-view.tsx:67, fraesbahn-bewegung.tsx:175). Keine Kennungen B-xx, obwohl AUFTRAG 12 sie je Animation verlangt. @starting-style: 0 Treffer.
- Register K-007: 28 von 29 Einträgen vollständig. B-04 teilweise, weil Section selbst nicht einblendet (section.tsx:41).
- Lücken ohne Eintrag: wachsende Bereichskante beim Überfahren (page.tsx:243), hover:brightness-110 (ui/button.tsx:36), 85 Farbübergänge (transition-colors; K-007 erlaubt nur Transform und Deckkraft), Farbanimation sm24-lesen-aktiv (globals.css:698-703).
- G-06 Dauerbewegung mit Pause: nicht vorhanden. Der Spinner dreht sich nur beim Laden.

### 5 Leuchten beim Überfahren (G-06)
Kein Glow im engeren Sinn: kein farbiger Schatten, keine Unschärfe, kein Verlauf. Kandidaten: Bereichsliste mit hover:bg-area-soft (page.tsx:238) und wachsender Bereichskante (page.tsx:243), Angebotskarten mit zeiger:hover:shadow-raised (page.tsx:402), ui/card.tsx:30. shadow-raised ist ein neutraler Schatten.

### 6 Startseiten-Animation (G-04, G-07)
- Datei: src/app/(site)/page.tsx:124-147, Generator profilschnitt.tsx (480 × 360), Fräser in interaktiv/fraesbahn-bewegung.tsx.
- Ablauf: gestrichelter Rohling, das Profil zeichnet sich (1,1 s, Start nach 0,3 s), die Fläche deckt sich auf, der Fräser fährt die Bahn und hebt ab. Ende bei 1,58 s (K-007: höchstens 1,6 s).
- Maße (viewBox-Einheiten, Konstanten im Kopf von profilschnitt.tsx): Gesamtlänge 432 (Reide bei 24, Spitze bei 456). Reide 100 × 104 (Verhältnis 0,96 zu 1). Halm 46 dick und 286 lang (6,2 zu 1). Bart 216 lang (4,7 zu 1 zur Dicke). Gesamtlänge zu Reidehöhe 4,15 zu 1. Ein Zielmaß steht weder im Code noch in KERN.
- G-04: Der Wandel Autoschlüssel, Profilzylinder, Schließanlage fehlt. Die Bereichsliste führt per Seitenwechsel (B-13) in die Rubrik (page.tsx:228-262).
- Hub-Titel im Code: „Wobei können wir helfen?“ (page.tsx:221). AUFTRAG 12: „Wobei können wir Ihnen helfen?“.

### 7 Icons
- 54 Fach-Icons (components/visual/icons/, ohne icon-base.tsx) und 39 Glyphen (components/visual/glyphen/). Alle 93 nutzen IconBase (icon-base.tsx:19-47): viewBox 0 0 48 48, currentColor, Strich 1,75 px über [data-sm24-icon] (globals.css:369-375).
- Registry: keine Sammeldatei für Fach-Icons. Zuordnung Bereich zu Icon: components/visual/bereich-icon.tsx (BEREICH_ICONS, neun Einträge). visual/registry.tsx gilt nur für Generatoren.
- Fach-Icons: alarmtechnik, anzahlung, aussenhautsicherung, autoschluessel, beratung-telefon, datenschutz, einsteckschloss, elektronische-zutrittsloesungen, fahrzeugmarke, fahrzeugoeffnung, foto-hochladen, funkschluessel, gleichschliessende-zylinder, halbzylinder, klappschluessel, knaufzylinder, kombinierte-konzepte, lieferung, mechanischer-schutz, mehrfachverriegelung, montage, nachweis, panik-alarmtaster, panik-fluchttuer, profilzylinder, pruefung, reparatur-austausch, rueckgabe, schliessanlagen, schluessel-kopieren, schluessel-nach-code, schluessel-nach-vorlage, schluessel-programmieren, schluesselbart-fraesen, schutzbeschlag, service-und-termin, sicherheitscheck, sicherheitstechnik, sicherungskarte, smart-key, smarte-funktionen, standort, technische-beratung, termin, transponder, tuer-und-schliesstechnik, tuerschliesser, tuerzusatzschloss, versand-paket, videoueberwachung, warenkorb, werkstatt, zahlung, zylinder-mass.
- Glyphen: alle 39 Namen stehen als Dateinamen im Verzeichnis components/visual/glyphen/.
- Fremde Sets: lucide, heroicons, react-icons fehlen in package.json und src (lucide nur im Test bestaetigung.test.tsx:74-77). Emojis: 0. Symbol ☐ (U+2610) in lib/druckansichten.ts:326, kein Emoji.

### 8 Grafik-Generatoren
ablauf.tsx: Ablaufzeichnung mit 2 bis 5 Stationen (B-23). code-fundstelle.tsx: Fundstelle der Code-Stelle am Bart (B-22). profilschnitt.tsx: gefrästes Profil der Startseite (B-01). schliessplan.tsx: Schließplan (B-14). schluessel.tsx: Schlüsselzeichnung mit Profil oder Funkbögen (B-21). stiftzuhaltung.tsx: Zylinderschnitt mit Stiften, Scroll-Szene (B-25). tuer-schutz.tsx: Tür mit Schutzpunkten (B-18). zutritt-signal.tsx: Medium, Funk, Leser, Freigabe (B-27). zylinder-mass.tsx: Maßzeichnung Maß A und B (B-17). Ohne Generator: grafik-basis.tsx (Helfer).

### 9 Logo (G-12)
- Bestand: Wortmarke als Text ohne Bilddatei (layout/site-header.tsx:152-160). Symbol: src/app/icon.svg (32 × 32), daraus favicon.ico (scripts/favicon.mjs), apple-icon.tsx (180 px), manifest.ts:42-44. Teilen-Bild: app/(site)/opengraph-image.tsx. Strukturdaten: components/seo/json-ld.tsx.
- Befund: icon.svg nutzt feste Hex-Werte und zwei Verläufe (Zeilen 3 und 7), beides Tailwind-Standardfarben. G-47 verlangt currentColor.
- _werkstatt/ausbau/logo/ enthält nur .gitkeep.

### 10 Anti-Slop-Vorbefund S1 bis S9
- S1 Verstoß: Inter wird geladen (layout.tsx:25-30). Roboto nur als Ersatzname (globals.css:20, global-error.tsx:20, lib/mail/html.ts:53, lib/druckansichten.ts:44).
- S2 Verstoß: Standardfarben in icon.svg und apple-icon.tsx:18 (#0f172a). Hex außerhalb der Tokens: layout.tsx:76 (benannte Ausnahme D-015, Wert #f7f9fb, der Token ergibt rechnerisch #fafbfd), global-error.tsx:12-17, lib/mail/html.ts:43-50, druckansichten.ts. Tailwind-Paletten in Klassen: 0. Lila und Indigo: 0.
- S3 Verstoß: zwei Verläufe in icon.svg. Kein Glas, Blur, Aurora oder Partikel (0). globals.css:292 nutzt linear-gradient nur für einen Strich.
- S4 ohne Befund: keine Standard-Sets, keine Emojis.
- S5 vorläufig: rounded-lg in 83 von 132 Radius-Klassen (63 Prozent). Keine Standardschatten, kein pauschales Hover-Vergrößern.
- S6 vorläufig: Die Startseite hat ein Raster mit Icon, Titel und Text (der Hub, erlaubt). Die Angebotskarten sind nur zwei (page.tsx:399-411). 12 Seitendateien nutzen mehrspaltige Raster: Sichtung nötig.
- S7 ohne Befund: keine Wellen. Die Profillinie als Trenner ist nach K-003 erlaubt.
- S8 ohne Befund auf Code-Ebene (section.tsx:41 setzt nur InView). Anteil je Ansicht per Sichtung.
- S9 Verstoß: 14 Floskel-Treffer, z. B. service-und-termin/page.tsx:278, 314, 324; tuer-und-schliesstechnik/page.tsx:44, 156, 207; schluessel-nach-vorlage/page.tsx:211; lib/data/defaults/standard-articles.ts:8. Gedankenstriche: 1.642 in 301 Dateien, davon 1.029 außerhalb von Kommentarzeilen (Heuristik, inkl. content/*.json). Ausrufezeichen: 0.

## GEMEINSAME DATEIEN (Vorschläge für KERN 2.0, nicht geändert)
1. K-004 gegen K-004a: „experimental.inlineCss“ (next.config.ts:58-64) widerspricht „keine experimentellen Flags“.
2. K-004: Next.js 16.3 auf den Stand aus package.json bringen (^16.4.3).
3. K-005: Tokens card, popover und muted streichen (ohne Verwendung); destructive nur als destructive-foreground führen.
4. K-005: Farbraum festlegen (AUFTRAG 12: OKLCH; Code und Tests: HSL).
5. K-006: Gewichte Plex Sans 500 und Inter 700 nachtragen.
6. K-006 und K-005: text-body mobil auf 17 px anheben oder die AUFTRAG-Regel ändern.
7. K-007: Farbübergänge (B-29) und sm24-lesen-aktiv als Ausnahme aufnehmen oder entfernen.
8. K-007: Einträge B-30 (Bereichskante, page.tsx:243) und B-31 (hover:brightness, ui/button.tsx:36) anlegen; B-04 als teilweise führen.
9. K-007: data-motion-Kennungen je Animation einführen oder die AUFTRAG-Forderung streichen; @starting-style einplanen.
10. D-015 und layout.tsx:76: Wert auf #fafbfd bringen oder aus --background berechnen.
11. Markenblau: E-Mail (lib/mail/html.ts:43-50), Druck und Backend nutzen #1d5fd1, die Site-Primärfarbe ist #145bb8. Eine Farbe festlegen.
12. icon.svg auf currentColor ohne Verlauf umstellen; apple-icon.tsx:18 Hintergrund aus einem Token ziehen.
13. Texte: Hub-Titel (page.tsx:221) auf „Wobei können wir Ihnen helfen?“ bringen; Gedankenstriche in layout.tsx:47 und page.tsx:222 ersetzen.

## PRÜFUNG UND ERGEBNIS
- framer-motion: grep -rln framer-motion src ergibt 1 Datei (components/visual/README.md:427, nur Text). Kein Import. Die Abhängigkeit steht in package.json:42; D-004 überlässt das Entfernen dem Inhaber.
- Schriftfamilien mit Fundstelle: Plex Sans, Inter, Plex Mono (layout.tsx:18-37), Ersatzfamilien (globals.css:18-55), OG-Paket (bereichsbild.tsx:63).
- S1 bis S9 vollständig: vier Verstöße (S1, S2, S3, S9), zwei vorläufige Befunde (S5, S6), S8 nur per Sichtung, S4 und S7 ohne Befund.
- Register: 29 Einträge, 28 vollständig, B-04 teilweise, vier Lücken.
- Klassen sauber: keine nackten transition-Klassen, kein transition-all, keine Zahlen-Dauern.

## BELEGE
Nur Lesebefehle (grep und Zählung je Datei). Token-Quellen: globals.css:73-172, tailwind.config.ts:15-221, lib/visual/area-theme.ts:31-103.

## OFFENE FRAGEN
1. „Die vorhandene Bewegungsbibliothek“ (AUFTRAG 12): meint sie framer-motion (D-004: ungenutzt) oder das CSS-System?
2. „Das vorhandene Leuchten“ (G-06): welche Fläche ist gemeint? Kandidaten in Abschnitt 5, einen echten Glow gibt es nicht.
3. Zielmaß für G-07 (Länge zu Reidehöhe). Die Quelle FACHWISSEN.md fehlt noch.
4. Fließtext mobil 15 px (KERN) oder 17 px (AUFTRAG 12). Touch-Ziele 44 px (KERN) oder 48 px für Kacheln (AUFTRAG 12).
5. Die Einzelliste je Animation mit Datei und Zeile fehlt, weil die Wortgrenze gilt. Soll der Orchestrator dafür eine Protokolldatei freigeben?
6. S5, S6 und S8 brauchen eine Sichtung am Bild.
7. Gedankenstriche in content/ (inkl. content/startwerte/): Migration vor oder nach E1?
