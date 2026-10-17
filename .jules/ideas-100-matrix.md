# 100-Ideen Matrix (Red-Team Audit)

## KATEGORIE A: AWWWARDS-KINETIK & TAKTILE INTERAKTION (IDEEN 1 BIS 25)
### IDEA_001: Fluid Scroll Reveal für Hero-Sektion
- **Route**: `app/page.tsx`
- **Komponente**: `components/showcase/hero-section.tsx`
- **Spezifikation**: Implementierung sanfter Scroll-Animationen mit Federphysik für die Hero-Sektion.

### IDEA_002: Taktiles Hover-Feedback im Features Grid
- **Route**: `app/page.tsx`
- **Komponente**: `components/showcase/features-grid.tsx`
- **Spezifikation**: Hinzufügen mikro-haptischer Schattenverschiebungen (OKLCH) beim Hovern der Feature-Karten.

### IDEA_003: 3D Flip-Animation für Schlüsselarten
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/key-kinds.tsx`
- **Spezifikation**: Kinetische 3D-Karten-Drehungen für die verschiedenen Schlüsseltypen ohne Layout-Shifts.

### IDEA_004: SVG-Pfad-Zeichnung bei Scroll
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/schliessanlagen/system-erklaerung.tsx`
- **Spezifikation**: Die Verbindungslinien der Schließanlage werden beim Scrollen weich gezeichnet (Scroll-getrieben).

### IDEA_005: Magnetische Buttons im Kontaktformular
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/controls.tsx`
- **Spezifikation**: Buttons ziehen den Cursor leicht an, wenn er in der Nähe ist, implementiert mit Framer Motion oder reinem CSS.

### IDEA_006: Interaktive Schlüssel-Generierung
- **Route**: `app/page.tsx`
- **Komponente**: `components/visual/generators/schluessel.tsx`
- **Spezifikation**: Der Schlüssel wird basierend auf Cursor-Bewegungen dynamisch leicht verzerrt/beleuchtet.

### IDEA_007: Zähler-Animation für Preise
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/preis-anzeige.tsx`
- **Spezifikation**: Fließende Zähler-Animationen (Easing) beim Update des Preises.

### IDEA_008: Weiche Checkmark-Zeichnung
- **Route**: `app/page.tsx`
- **Komponente**: `components/visual/motion/check-draw.tsx`
- **Spezifikation**: Verbesserung der Checkmark-Zeichnung durch cubic-bezier(0.16, 1, 0.3, 1) Timing.

### IDEA_009: Dynamische Bemaßungspfeile
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/zylinder-mass.tsx`
- **Spezifikation**: Pfeile passen sich fließend an, wenn Werte per Slider geändert werden (Subpixel-Rendering).

### IDEA_010: Akkordeon mit fließenden Inhaltsübergängen
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/accordion.tsx`
- **Spezifikation**: Verwendung von CSS grid-template-rows (0fr zu 1fr) für butterweiches Aufklappen.

### IDEA_011: Drag & Drop Kinetik
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/photo-upload.tsx`
- **Spezifikation**: Die Upload-Zone pulsiert leicht und federt beim Loslassen des Bildes ein.

### IDEA_012: Subtile Neigungs-Effekte
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/card.tsx`
- **Spezifikation**: Karten neigen sich minimal basierend auf der Mausposition (CSS 3D Transform).

### IDEA_013: Mikro-Interaktionen für Kalendertage
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/termin-auswahl.tsx`
- **Spezifikation**: Tage vergrößern sich sanft mit OKLCH-Glow beim Hover.

### IDEA_042: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Route**: `app/page.tsx`
- **Komponente**: `components/showcase/spatial-bento-grid.tsx`
- **Spezifikation**: Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

### IDEA_015: Pulsierende Badges
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/badge.tsx`
- **Spezifikation**: Wichtige Badges erhalten ein minimales, weiches Pulsieren im Hintergrund.

### IDEA_016: Parallax Scroll im Header
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/layout/page-header.tsx`
- **Spezifikation**: Der Header-Inhalt bewegt sich leicht versetzt zum Hintergrund beim Scrollen.

### IDEA_017: Einblenden von Alerts mit physikalischer Dämpfung
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/alert.tsx`
- **Spezifikation**: Alerts springen nicht, sondern gleiten weich in den Viewport.

### IDEA_018: Lesefortschrittsbalken mit Glow
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/service-article.tsx`
- **Spezifikation**: Sanft wachsender Lesefortschrittsbalken in der Navigation mit OKLCH-Akzentfarbe.

### IDEA_019: Stufenweises Reveal von Texten
- **Route**: `app/page.tsx`
- **Komponente**: `components/visual/motion/reveal.tsx`
- **Spezifikation**: Texte werden zeilenweise mit minimalem Delay eingeblendet (Stagger-Effekt).

### IDEA_020: Zoom-Animation für den Schließplan
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/schliessplan.tsx`
- **Spezifikation**: Fluid Zooming in spezifische Bereiche des Plans mit View Transitions.

### IDEA_021: Ripple-Effekt für Primär-Buttons
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/button.tsx`
- **Spezifikation**: Subtiler Ripple-Effekt beim Klick, der in OKLCH-Tönen verblasst.

### IDEA_022: Federndes Auswählen von Optionen
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/option-card.tsx`
- **Spezifikation**: Gewählte Optionen federn kurz ein und erhalten einen klaren Rand-Fokus.

### IDEA_023: Hover-Delay für Info-Tipps
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/info-tip.tsx`
- **Spezifikation**: Tooltip erscheint nach 150ms mit einem sanften Fade-in und Slide-up.

### IDEA_024: Konfetti-Effekt (Dezent) bei Erfolg
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/bestaetigung.tsx`
- **Spezifikation**: Physikalisch korrekte, minimale Partikel-Animation nach Buchung.

### IDEA_025: Docking-Animation für Mobile Bar
- **Route**: `app/page.tsx`
- **Komponente**: `components/layout/mobile-action-bar.tsx`
- **Spezifikation**: Die Mobile Bar slidet weich rein, wenn nach oben gescrollt wird, mit Backdrop-Filter Fade.

## KATEGORIE B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG (IDEEN 26 BIS 50)
### IDEA_026: Tiefgehende FAQ-Integration für Autoschlüssel
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/service-article.tsx`
- **Spezifikation**: Ausbau des Textes auf > 800 Wörter mit schema.org FAQ-Graphen für SEO.

### IDEA_027: Vergleichsmatrix Mechanisch vs. Elektronisch
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/schliessanlagen/system-erklaerung.tsx`
- **Spezifikation**: Eine tabellarische Gegenüberstellung beider Systeme mit > 1000 Wörtern Erläuterung.

### IDEA_028: Ausführliche Prozess-Beschreibung
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/services/overview.tsx`
- **Spezifikation**: Detaillierte Schritt-für-Schritt-Anleitung der Dienstleistungen zur Autoritätssteigerung.

### IDEA_029: Erweiterter LocalBusiness Graph
- **Route**: `app/page.tsx`
- **Komponente**: `components/seo/json-ld.tsx`
- **Spezifikation**: Zusätzliche semantische Daten (Öffnungszeiten, Geo-Koordinaten) im Startseiten-JSON-LD.

### IDEA_030: Anfahrts- und Parkplatz-Ratgeber
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/layout/section.tsx`
- **Spezifikation**: Content-Erweiterung um detaillierte lokale Navigationshilfe (> 500 Wörter).

### IDEA_031: Markenspezifische Sicherheits-Fakten
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/vehicle-facts.tsx`
- **Spezifikation**: Detaillierte Auflistung der Wegfahrsperren-Technologien nach Autohersteller.

### IDEA_032: Glossar für Schließanlagen
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/schliessplan.tsx`
- **Spezifikation**: Ein eingebettetes Glossar für Fachbegriffe (z.B. Profilzylinder, Gleichschließung).

### IDEA_033: Zusammenfassung der Normen & Zertifikate
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/layout/summary-list.tsx`
- **Spezifikation**: Detaillierte Erläuterung der DIN-Normen für Einbruchschutz im Fließtext.

### IDEA_034: Erweiterte Vertrauensbeweise-Texte
- **Route**: `app/page.tsx`
- **Komponente**: `components/vertrauen/nachweise-liste.tsx`
- **Spezifikation**: Ausführliche Beschreibungen, wie die Zertifizierungen erlangt wurden.

### IDEA_035: Detaillierte Erläuterung der Funkschlüssel-Optionen
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/optionen.ts`
- **Spezifikation**: Langtext zu den Unterschieden zwischen Keyless Go und klassischem Funk.

### IDEA_036: Anleitung zum richtigen Messen
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/zylinder-mass.tsx`
- **Spezifikation**: Eine 800-Wörter-Anleitung, wie man Zylinder exakt abmisst, inklusive Fehlervermeidung.

### IDEA_037: Tiefe Fach-Fragen im Service-Bereich
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/ui/accordion.tsx`
- **Spezifikation**: Ein FAQ-Bereich mit extrem detaillierten Antworten zu Notfall-Szenarien.

### IDEA_038: Hilfetexte für Kontakt-Formulare
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/controls.tsx`
- **Spezifikation**: Kontextbezogene Erklärungen für jedes Formularfeld, um Abbrüche zu vermeiden.

### IDEA_039: Erweitertes Footer-Sitemap-Routing
- **Route**: `app/page.tsx`
- **Komponente**: `components/layout/site-footer.tsx`
- **Spezifikation**: Bessere interne Verlinkung mit kurzen Textbeschreibungen im Footer.

### IDEA_040: Transparenz-Text zur Preisgestaltung
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/preis-anzeige.tsx`
- **Spezifikation**: Ausführliche Erklärung (500 Wörter), wie sich der Preis eines Nachschlüssels zusammensetzt.

### IDEA_041: Historische Entwicklung der Schließtechnik
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/schliessanlagen/system-erklaerung.tsx`
- **Spezifikation**: Ein Fachartikel über die Evolution von mechanisch zu smart.

### IDEA_014_ALT: Ratgeber für den Notfall
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/services/emergency-tips.tsx`
- **Spezifikation**: Ein umfassender Guide: 'Was tun, wenn die Tür ins Schloss fällt?'

### IDEA_043: Erweiterte Kunden-Stories
- **Route**: `app/page.tsx`
- **Komponente**: `components/showcase/testimonials.tsx`
- **Spezifikation**: Ausformulierte Fallstudien statt kurzer Zitate (jeweils > 300 Wörter).

### IDEA_044: Technischer Hintergrund zu Transpondern
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/key-kinds.tsx`
- **Spezifikation**: Erklärung der RFID-Technologie im Autoschlüssel.

### IDEA_045: Erweiterte semantische Breadcrumbs
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/layout/breadcrumbs.tsx`
- **Spezifikation**: Bessere Strukturierung und Kontext-Erweiterung für Crawler.

### IDEA_046: Begleittexte für den Einsatz-Rechner
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/service-einsatz-rechner.tsx`
- **Spezifikation**: Erklärung der Einsatzgebiete und Anfahrtskosten-Logik.

### IDEA_047: Semantische Label für Mobile Actions
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/layout/mobile-action-bar.tsx`
- **Spezifikation**: Verbesserte Aria-Labels und unsichtbare Beschreibungstexte.

### IDEA_048: Aussagekräftigere Karten-Inhalte
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/card.tsx`
- **Spezifikation**: Erweiterung der Feature-Cards um spezifische Use-Cases.

### IDEA_049: Vorbereitungs-Checkliste für den Termin
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/termin-auswahl.tsx`
- **Spezifikation**: Ein 400-Wörter-Text: Was der Kunde zum Termin mitbringen muss.

### IDEA_050: Sicherheitsaspekte der Signalgebung
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/zutritt-signal.tsx`
- **Spezifikation**: Detaillierte Analyse, wie sichere Signale vor Replay-Attacken schützen.

## KATEGORIE C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE (IDEEN 51 BIS 75)
### IDEA_014: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/enterprise-roi-calculator.tsx`
- **Spezifikation**: Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere den umgebenden Fließtext auf 850 Wörter.

### IDEA_052: Interaktiver Preis-Kalkulator
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/calculator/rechner-bausteine.tsx`
- **Spezifikation**: Dynamischer Preisrechner für Autoschlüssel mit Live-Update via Server Actions.

### IDEA_053: Tür-Absicherung Konfigurator
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/calculator/tuer-absicherung-rechner.tsx`
- **Spezifikation**: Ein visuelles Tool zur Auswahl von Sicherheitskomponenten mit Sofort-Feedback.

### IDEA_054: KI-unterstützte Vorab-Analyse
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/photo-upload.tsx`
- **Spezifikation**: Ein Pseudo-KI Tool, das hochgeladene Bilder sofort im Client 'scannt' (optisches Feedback).

### IDEA_055: Vertrauens-Badge Counter
- **Route**: `app/page.tsx`
- **Komponente**: `components/vertrauen/nachweise-liste.tsx`
- **Spezifikation**: Ein Zähler für erfolgreiche Türöffnungen, der psychologisch Sicherheit suggeriert.

### IDEA_056: Dringlichkeits-Indikator
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/termin-auswahl.tsx`
- **Spezifikation**: Anzeige von 'Nur noch 2 Termine heute frei' zur Conversion-Steigerung.

### IDEA_057: Visueller ROI-Schieberegler für Schließanlagen
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/schliessplan.tsx`
- **Spezifikation**: Berechnet die Kostenersparnis gegenüber Einzelschlüsseln über 10 Jahre.

### IDEA_058: Interaktive Vorher-Nachher-Slider
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/service-einsatz-rechner.tsx`
- **Spezifikation**: Vergleich von ungesicherten vs. gesicherten Türen per Slider.

### IDEA_059: Optimistic Form Submission
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/controls.tsx`
- **Spezifikation**: Sofortiges UI-Feedback bei Absenden dank `useOptimistic` in React 19.

### IDEA_060: Sticky CTA bei Scroll-Tiefe > 50%
- **Route**: `app/page.tsx`
- **Komponente**: `components/showcase/cta-section.tsx`
- **Spezifikation**: Ein Conversion-optimierter Button, der erst ab bestimmter Tiefe erscheint.

### IDEA_061: Dynamische Ratenzahlungs-Vorschau
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/preis-anzeige.tsx`
- **Spezifikation**: Klarna/Paypal Split-Pay Berechnung live im Client.

### IDEA_062: Gamification der Sicherheitsprüfung
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/calculator/tuer-absicherung-rechner.tsx`
- **Spezifikation**: Ein Mini-Quiz zur Evaluierung der eigenen Haussicherheit.

### IDEA_063: Interaktives Checklisten-Tool
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/layout/summary-list.tsx`
- **Spezifikation**: Kunden können abgehakte Vorbereitungen speichern (localStorage).

### IDEA_064: Social Proof auf Buttons
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/button.tsx`
- **Spezifikation**: Kleine Avatare oder Sterne direkt neben dem primären CTA.

### IDEA_065: Dynamischer Filter für Schlüsselarten
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/key-kinds.tsx`
- **Spezifikation**: Echtzeit-Filtern nach Hersteller ohne Seiten-Reload.

### IDEA_066: Live Validierung mit Success-Glow
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/field.tsx`
- **Spezifikation**: Eingabefelder leuchten bei gültiger Eingabe sanft grün auf (OKLCH).

### IDEA_067: Visueller 'Passt-das?'-Simulator
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/zylinder-mass.tsx`
- **Spezifikation**: Ein Tool, das warnt, wenn Maße unplausibel sind.

### IDEA_068: Live Geo-Routing Schätzer
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/service-einsatz-rechner.tsx`
- **Spezifikation**: Eingabe der PLZ schätzt sofort die Anfahrtszeit.

### IDEA_069: Verknappungs-Alert
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/alert.tsx`
- **Spezifikation**: Dynamischer Alert bei hoher Auslastung im Notdienst.

### IDEA_070: Smart Defaults für Termine
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/termin-auswahl.tsx`
- **Spezifikation**: Vorauswahl des nächsten sinnvollen freien Slots.

### IDEA_071: Interaktiver 'Sicherheits-Score'
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/schliessanlagen/system-erklaerung.tsx`
- **Spezifikation**: Berechnet sich dynamisch anhand ausgewählter Optionen im Text.

### IDEA_072: Dynamische Headline-Personalisierung
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/layout/page-header.tsx`
- **Spezifikation**: Headline passt sich basierend auf der Uhrzeit an (z.B. 'Nacht-Notdienst').

### IDEA_073: Preisanker in Optionen
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/option-card.tsx`
- **Spezifikation**: Visuelle Hervorhebung der 'Bester Wert'-Option.

### IDEA_074: Newsletter Opt-in mit Sofort-Mehrwert
- **Route**: `app/page.tsx`
- **Komponente**: `components/layout/site-footer.tsx`
- **Spezifikation**: Interaktives Feld für E-Mail mit Micro-Animation bei Erfolg.

### IDEA_075: One-Click Kalender-Export
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/bestaetigung.tsx`
- **Spezifikation**: Sofortiger Download einer .ics Datei für den Termin.

## KATEGORIE D: EXTREME PERFORMANCE, ARCHITEKTUR & DX (IDEEN 76 BIS 100)
### IDEA_076: Implementierung von 'use cache'
- **Route**: `app/page.tsx`
- **Komponente**: `app/page.tsx`
- **Spezifikation**: Umstellung von alten Revalidation-Exports auf die neue Next.js 16 'use cache' Direktive.

### IDEA_077: CSS Subgrid Harmonisierung
- **Route**: `globals.css`
- **Komponente**: `globals.css`
- **Spezifikation**: Einführung von `grid-template-rows: subgrid` für alle Bento- und Card-Grids.

### IDEA_078: Container Queries für Schlüssel-Karten
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/key-kinds.tsx`
- **Spezifikation**: Umstellung von Media-Queries auf `@container` für modulare Komponenten.

### IDEA_079: AVIF Bild-Pipelines
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/image-placeholder.tsx`
- **Spezifikation**: Sicherstellung, dass alle Bilder über next/image mit AVIF formatiert werden.

### IDEA_080: Zero-Shift Webfont Optimierung
- **Route**: `globals.css`
- **Komponente**: `globals.css`
- **Spezifikation**: Verwendung von size-adjust in @font-face zur Vermeidung von Layout Shifts.

### IDEA_081: Off-Thread Berechnungen
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/generators/schliessplan.tsx`
- **Spezifikation**: Auslagerung schwerer Matrix-Kalkulationen in Web Worker.

### IDEA_082: Server Actions für alle Formulare
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/controls.tsx`
- **Spezifikation**: Vollständige Migration auf React 19 Server Actions ohne manuelles Fetching.

### IDEA_083: Zustands-Memoisierung
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/service-einsatz-rechner.tsx`
- **Spezifikation**: Strikte Vermeidung von Re-Renders in tiefen Rechner-Bäumen via React Compiler.

### IDEA_084: Statische Generierung von JSON-LD
- **Route**: `app/page.tsx`
- **Komponente**: `components/seo/json-ld.tsx`
- **Spezifikation**: Vorab-Berechnung von Schema.org Daten auf dem Server.

### IDEA_085: Optimistic Updates für Preise
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/preis-anzeige.tsx`
- **Spezifikation**: Verwendung von `useOptimistic` beim Wechseln von Schlüsseloptionen.

### IDEA_086: Intelligentes Lazy Loading
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/layout/section.tsx`
- **Spezifikation**: Intersection Observer basiertes Laden für schwere SVG-Visualisierungen.

### IDEA_087: Progressive Enhancement Upload
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/photo-upload.tsx`
- **Spezifikation**: Formular funktioniert auch ohne JS für grundlegenden Datei-Upload.

### IDEA_088: Isolierter Header-State
- **Route**: `app/page.tsx`
- **Komponente**: `components/layout/site-header.tsx`
- **Spezifikation**: Auslagerung des Mobile-Menu-States zur Reduzierung von Page-Rerenders.

### IDEA_089: CSS-only Akkordeons
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/ui/accordion.tsx`
- **Spezifikation**: Nutzung von `<details>` und `<summary>` für Zero-JS Funktionalität.

### IDEA_090: Striking OKLCH Transformation
- **Route**: `globals.css`
- **Komponente**: `globals.css`
- **Spezifikation**: Vollständige Entfernung von Hex/HSL Variablen zugunsten nativer OKLCH CSS Variablen.

### IDEA_091: SVG Sprite-Sheets
- **Route**: `app/page.tsx`
- **Komponente**: `components/visual/icons/icon-base.tsx`
- **Spezifikation**: Zusammenfassung aller Icons in einem einzigen Sprite-Sheet für Netzwerk-Performance.

### IDEA_092: Strikte Typisierung der Termine
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/autoschluessel/termin-auswahl.tsx`
- **Spezifikation**: Verwendung von Template-Literal-Types anstelle von Enums.

### IDEA_093: Dynamische Importe für große Tabs
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/schliessanlagen/system-erklaerung.tsx`
- **Spezifikation**: Laden der Tab-Inhalte via `next/dynamic`.

### IDEA_094: Native HTML5 Validierung
- **Route**: `app/kontakt/page.tsx`
- **Komponente**: `components/forms/field.tsx`
- **Spezifikation**: Strikte Nutzung von pattern und required Attributen vor JS-Validierung.

### IDEA_095: Entfernung unnötiger Wrapper-Divs
- **Route**: `app/page.tsx`
- **Komponente**: `components/ui/card.tsx`
- **Spezifikation**: Reduzierung der DOM-Tiefe in allen Karten-Komponenten.

### IDEA_096: Zustands-Colocation
- **Route**: `app/services/page.tsx`
- **Komponente**: `components/calculator/rechner-bausteine.tsx`
- **Spezifikation**: Verschieben von React-State so tief wie möglich im Komponentenbaum.

### IDEA_097: CSS Env Variables
- **Route**: `app/autoschluessel/page.tsx`
- **Komponente**: `components/layout/mobile-action-bar.tsx`
- **Spezifikation**: Nutzung von `env(safe-area-inset-bottom)` für iPhone Notch Support.

### IDEA_098: Reduzierung der CSS Spezifität
- **Route**: `globals.css`
- **Komponente**: `globals.css`
- **Spezifikation**: Einsatz von `@layer` in Tailwind v4 für sauberere Cascades.

### IDEA_099: Preload für wichtige Badges
- **Route**: `app/page.tsx`
- **Komponente**: `components/vertrauen/nachweise-liste.tsx`
- **Spezifikation**: Einbindung von `<link rel="preload">` für LCP-kritische Vertrauens-Icons.

### IDEA_100: Entfernung schwerer Motion-Libs
- **Route**: `app/schliessanlagen/page.tsx`
- **Komponente**: `components/visual/motion/reveal.tsx`
- **Spezifikation**: Rückbau von Framer Motion zugunsten nativer CSS-Transitions wo möglich.
