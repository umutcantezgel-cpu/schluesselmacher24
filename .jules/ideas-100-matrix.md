# PHILOSOPHICAL 100-IDEAS MATRIX

## KATEGORIE A: AWWWARDS-KINETIK & TAKTILE INTERAKTION (IDEEN 1 BIS 25)

### IDEA_001: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/showcase/spatial-bento-grid.tsx`
- **Specification**: Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

### IDEA_002: Kinetischer Scroll-Dämpfer für Section-Übergänge
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/layout/section.tsx`
- **Specification**: Implementierung einer sanften Scroll-Kinetik mittels framer-motion (cubic-bezier(0.16, 1, 0.3, 1)), die Sektionen beim Betreten des Viewports leicht abdämpft, ohne den nativen Scroll zu entführen.

### IDEA_003: Haptisches Feedback auf Primär-Buttons
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/ui/button.tsx`
- **Specification**: Einführung eines CSS-basierten Mikro-Feedbacks auf Button-Klicks, bei dem der Canvas kurz pulsiert, simuliert durch scale-Transformationen und einem extrem leichten Drop-Shadow (oklch(0.1 0 0 / 0.05)).

### IDEA_004: Hover-getriebene SVG-Explosion für Icons
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/card.tsx`
- **Specification**: Die statischen Lucide-Icons in den Quick-Entries werden durch animierte SVGs ersetzt, deren Pfade sich beim Hovern organisch rekonfigurieren.

### IDEA_005: Taktiler Schieberegler mit Magnet-Rastung
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/slider.tsx`
- **Specification**: Ein Custom-Slider für die Anzahlungs-Berechnung, der beim Erreichen runder Beträge visuell und (wenn API verfügbar) per Vibration einrastet.

### IDEA_006: Schweizer 8px-Raster-Kinetik
- **Target Route**: `app/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Target Component**: `components/layout/grid.tsx`
- **Specification**: Einführung einer strikten, Grid-basierten Fade-in-Animation, die Elemente strikt entlang des 8px-Rhythmus aufbaut.

### IDEA_007: Fluid Typography Scaling Transition
- **Target Route**: `app/ratgeber/page.tsx`
- **Target Component**: `components/ui/typography.tsx`
- **Specification**: Schriftgrößen-Übergänge bei Container-Größenänderungen durch CSS clamp() und CSS-Transitions für extrem fließende Lesbarkeit unterbrechen.

### IDEA_008: Mikro-Mikro-Interaktionen (Hover State Delays)
- **Target Route**: `app/elektronische-zutrittsloesungen/konfigurator/page.tsx`
- **Target Component**: `components/ui/card.tsx`
- **Specification**: Gestaffelte Hover-Eingänge (z. B. Icon erscheint 50ms nach Card-Border-Highlight) für mehr dreidimensionale Tiefe in den Bento-Karten.

### IDEA_009: Farbwellen auf Formular-Inputs (Focus State)
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/input.tsx`
- **Specification**: Wenn ein Input-Feld fokussiert wird, läuft ein subtiler OKLCH-Lichtreflex über den Rahmen, gesteuert durch mask-image und CSS-Animation.

### IDEA_010: Elastische Tab-Navigation für Konfiguratoren
- **Target Route**: `app/schliessanlagen/konfigurator/page.tsx`
- **Target Component**: `components/forms/flow-shell.tsx`
- **Specification**: Tab-Wechsel in FlowShell erhalten eine physikalische Federung (spring animation), bei der der aktive Tab-Balken weich zur nächsten Position gleitet.

### IDEA_011: Parallax-Tiefeneffekt auf Platzhalter-Bildern
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/image-placeholder.tsx`
- **Specification**: Die ImagePlaceholder reagieren minimal auf die Mausposition, um den Anschein räumlicher Tiefe zu erzeugen (Tilt-Effekt).

### IDEA_012: Pulsierende Skeleton-Loader (Sync State)
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/ui/button.tsx`
- **Specification**: Während Server Actions laufen, verwandelt sich der Button in einen Skeleton-Loader, dessen Puls genau dem Herzschlag (60bpm) entspricht.

### IDEA_013: Akkordeon-Aufklapp-Kinetik mit Height-Auto
- **Target Route**: `app/ratgeber/page.tsx`
- **Target Component**: `components/ui/accordion.tsx`
- **Specification**: Framer-Motion getriebene FAQ-Akkordeons, die das 'height: auto' Problem elegant lösen und ohne Layout-Ruckler aufschwingen.

### IDEA_014: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
- **Target Route**: `app/services/page.tsx`
- **Target Component**: `components/calculator/enterprise-roi-calculator.tsx`
- **Specification**: Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere den umgebenden Fließtext auf 850 Wörter.

### IDEA_015: Visuelle Fortschritts-Fäden (Scroll-Triggered)
- **Target Route**: `app/ratgeber/page.tsx`
- **Target Component**: `components/layout/progress.tsx`
- **Specification**: Eine vertikale 1px-Linie am Rand (oklch(0.8 0 0)), die sich beim Scrollen füllt und den Lesefortschritt der Seite darstellt.

### IDEA_016: Dynamische Cursor-Blends (Spotlight-Effekt)
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/ui/modal.tsx`
- **Specification**: Ein sanft abgedunkelter Hintergrund bei Modal-Öffnung, wobei der Bereich um den Cursor leicht erhellt bleibt.

### IDEA_017: Reaktive Dropdown-Menüs (Staggered Children)
- **Target Route**: `app/schliessanlagen/konfigurator/page.tsx`
- **Target Component**: `components/forms/select.tsx`
- **Specification**: Dropdowns klappen nicht einfach auf, sondern die Kind-Elemente faden gestaffelt ein (stagger delay von 20ms).

### IDEA_018: Magnetische Buttons in Hero-Sektionen
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/button.tsx`
- **Specification**: Der 'Ablauf starten' Button wird vom Cursor angezogen, wenn sich dieser im Umkreis von 30px befindet.

### IDEA_019: Glasmorphismus-Overlays mit OKLCH-Tint
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/ui/toast.tsx`
- **Specification**: Toast-Benachrichtigungen erhalten einen streng regulierten Backdrop-Filter (Blur 12px) gemischt mit einem weißen, halbtransparenten OKLCH-Farbton.

### IDEA_020: Viszerale Fehlerzustände (Shake-Kinetik)
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/input.tsx`
- **Specification**: Fehlerhafte Eingaben lösen keinen plötzlichen roten Rahmen aus, sondern ein sanftes horizontales Rütteln des Eingabefeldes.

### IDEA_021: Stufenloses Morphing für Such-Inputs
- **Target Route**: `app/ratgeber/page.tsx`
- **Target Component**: `components/ui/search.tsx`
- **Specification**: Ein Such-Icon dehnt sich bei Klick fließend zu einem vollen Input-Feld aus, ohne benachbarte Elemente zu verschieben.

### IDEA_022: Echtzeit-Validierungs-Pings
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/input.tsx`
- **Specification**: Wenn ein Zod-Schema ein Feld während der Eingabe als gültig erkennt, blinkt kurz ein subtiler, grüner Punkt neben dem Feld auf.

### IDEA_023: Kinematische Tooltips (Spring Physics)
- **Target Route**: `app/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Target Component**: `components/ui/tooltip.tsx`
- **Specification**: Info-Icons öffnen Tooltips nicht instantan, sondern schnellen wie an einem Gummiband in ihre Endposition.

### IDEA_024: Sanfte Image-Reveals bei Lazy Loading
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/image.tsx`
- **Specification**: Wenn echte Bilder geladen werden, poppen sie nicht auf, sondern faden über einen sanften Graustufen-zu-Farbe Filter ein.

### IDEA_025: Waben-Grid für Produkt-Features
- **Target Route**: `app/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Target Component**: `components/showcase/honeycomb.tsx`
- **Specification**: Ein hexagonales, reaktives Grid-Layout für spezielle Zylinder-Eigenschaften, das sich auf Hover wie ein Puzzleteil heraushebt.

## KATEGORIE B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG (IDEEN 26 BIS 50)

### IDEA_026: Deep-Dive Fachartikel: Zylinder-Sicherheitsklassen
- **Target Route**: `app/gleichschliessende-zylinder/page.tsx`
- **Target Component**: `components/content/deep-dive.tsx`
- **Specification**: Erweiterung der Seite um 900 Worte tiefgreifende Expertise zu VdS-Klassen und DIN-Normen für Schließzylinder, inklusive Vergleichsmatrix.

### IDEA_027: FAQ-Maximierung für Autoschlüssel
- **Target Route**: `app/autoschluessel/page.tsx`
- **Target Component**: `components/content/faq-accordion.tsx`
- **Specification**: Integration von 20 hyper-spezifischen FAQs zum Thema Wegfahrsperren, Transponder und Anlern-Prozessen (1200+ Wörter).

### IDEA_028: Semantischer Ratgeber: Schließanlagen planen
- **Target Route**: `app/schliessanlagen/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Ein umfassender Leitfaden (1500 Worte) über die Strukturierung von Generalhauptschlüsselanlagen im Gewerbebau.

### IDEA_029: Glossar-Tooltips für Fachbegriffe
- **Target Route**: `app/gleichschliessende-zylinder/page.tsx`
- **Target Component**: `components/content/glossary-term.tsx`
- **Specification**: Begriffe wie 'Not- und Gefahrenfunktion' werden im Fließtext unterstrichelt und erklären sich bei Hover über semantisch korrekte Tooltips.

### IDEA_030: Historische Entwicklung der Zylindertechnik
- **Target Route**: `app/tuer-und-schliesstechnik/page.tsx`
- **Target Component**: `components/content/history.tsx`
- **Specification**: Ein narrativer, historischer Abschnitt (850 Wörter), der die Evolution mechanischer Schließsysteme bis heute beleuchtet.

### IDEA_031: Case Study: Bürokomplex-Sicherheit
- **Target Route**: `app/elektronische-zutrittsloesungen/page.tsx`
- **Target Component**: `components/content/case-study.tsx`
- **Specification**: Detaillierte fiktive, aber realistische Fallstudie (1000 Worte) über die Umrüstung eines Bürogebäudes auf elektronische Zutrittslösungen.

### IDEA_032: Vergleich: Mechanik vs. Mechatronik
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/content/comparison.tsx`
- **Specification**: Eine tiefgehende textliche und tabellarische Gegenüberstellung (900 Worte) der Vor- und Nachteile beider Systeme.

### IDEA_033: Ratgeber: Schlüsselverlust bei Mietwohnungen
- **Target Route**: `app/ratgeber/schluesselverlust/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Umfassender Ratgeber (1100 Worte) zu rechtlichen und praktischen Schritten beim Verlust eines Zentralschlüssels.

### IDEA_034: Lexikon der Autoschlüssel-Typen
- **Target Route**: `app/autoschluessel/page.tsx`
- **Target Component**: `components/content/lexicon.tsx`
- **Specification**: Detaillierte Abhandlung (1300 Worte) über Infrarot-, Funk- und Keyless-Go-Systeme quer durch alle Marken.

### IDEA_035: Sicherheits-Audit Leitfaden
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/content/audit-guide.tsx`
- **Specification**: Ein 800-Worte Leitfaden für Eigenheimbesitzer, um Schwachstellen an Fenstern und Türen selbst zu erkennen.

### IDEA_036: Erklärung der Codierungs-Verfahren
- **Target Route**: `app/schluessel-nach-code/page.tsx`
- **Target Component**: `components/content/explanation.tsx`
- **Specification**: Tiefgang (900 Worte) über das Fräsen nach Code, wie Codes ermittelt werden und warum Originale erhalten bleiben.

### IDEA_037: Die Rolle der Sicherungskarte
- **Target Route**: `app/schliessanlagen/page.tsx`
- **Target Component**: `components/content/legal.tsx`
- **Specification**: Umfassender Text (800 Worte) über den rechtlichen und technischen Schutz durch Sicherungskarten bei Schließanlagen.

### IDEA_038: Nachhaltigkeit in der Sicherheitstechnik
- **Target Route**: `app/elektronische-zutrittsloesungen/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Artikel (850 Worte) über Reparierbarkeit, langlebige Materialien und Batteriemanagement bei elektronischen Zylindern.

### IDEA_039: Vorbeugender Einbruchschutz: Statistiken & Fakten
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/content/statistics.tsx`
- **Specification**: Integration aktueller Kriminalstatistiken und polizeilicher Empfehlungen (1000 Worte) zur Sensibilisierung.

### IDEA_040: Wie funktioniert ein Wendeschlüsselsystem?
- **Target Route**: `app/gleichschliessende-zylinder/page.tsx`
- **Target Component**: `components/content/technical.tsx`
- **Specification**: Detaillierte technische Erklärung (850 Worte) des Aufbaus und der Vorteile von Bohr- und Ziehschutz bei Wendeschlüsseln.

### IDEA_041: Ratgeber: Türschlösser winterfest machen
- **Target Route**: `app/ratgeber/pflege/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Ein 800-Worte Beitrag über die Pflege von Mechanik und Elektronik bei Frost und hoher Luftfeuchtigkeit.

### IDEA_042: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/showcase/spatial-bento-grid.tsx`
- **Specification**: Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

### IDEA_043: Smarte vs. klassische Türspione
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Vergleich und textliche Ausarbeitung (850 Worte) über Sichtfelder, Display-Vorteile und Datenschutz bei digitalen Türspionen.

### IDEA_044: Einsteckschlösser: Maße & Dornmaße erklärt
- **Target Route**: `app/tuer-und-schliesstechnik/page.tsx`
- **Target Component**: `components/content/tutorial.tsx`
- **Specification**: Ein 900-Worte Tutorial, wie man das Dornmaß und Entfernungsmaß für neue Einsteckschlösser korrekt misst.

### IDEA_045: Der Wegfahrsperren-Generationen-Guide
- **Target Route**: `app/autoschluessel/page.tsx`
- **Target Component**: `components/content/tech-guide.tsx`
- **Specification**: Detaillierte Analyse (1000 Worte) über die Entwicklung von Transpondern (Crypto 48, Megamos, etc.).

### IDEA_046: Schutz vor Lockpicking & Schlagschlüsseln
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/content/security-guide.tsx`
- **Specification**: Erklärtext (850 Worte) über Angriffsvektoren und wie moderne Zylinder durch Taumelstifte dagegenwirken.

### IDEA_047: Integration elektronischer Zutrittssysteme ins Smarthome
- **Target Route**: `app/elektronische-zutrittsloesungen/page.tsx`
- **Target Component**: `components/content/smarthome.tsx`
- **Specification**: Ein 950-Worte Artikel über API-Anbindungen, Matter und Thread-Protokolle bei modernen Türschlössern.

### IDEA_048: Die 5 größten Fehler beim Zylinder-Kauf
- **Target Route**: `app/ratgeber/kaufberatung/page.tsx`
- **Target Component**: `components/content/article.tsx`
- **Specification**: Ein Ratgeber-Artikel (850 Worte) zur Vermeidung von Messfehlern und falschen Sicherheitsklassen.

### IDEA_049: Brandschutz & Fluchtwege bei Schließanlagen
- **Target Route**: `app/schliessanlagen/page.tsx`
- **Target Component**: `components/content/legal-tech.tsx`
- **Specification**: Rechtlicher und technischer Leitfaden (1100 Worte) zu Panikschlössern und freilaufenden Zylindern in öffentlichen Gebäuden.

### IDEA_050: Wie funktioniert die Schlüssel-Nachbestellung nach Vorlage?
- **Target Route**: `app/schluessel-nach-vorlage/page.tsx`
- **Target Component**: `components/content/process-explainer.tsx`
- **Specification**: Detaillierter 800-Worte Prozess-Walkthrough über die optische Vermessung und das CNC-Fräsen von Schlüsseln.

## KATEGORIE C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE (IDEEN 51 BIS 75)

### IDEA_051: Interaktiver Zylinder-Maß-Rechner
- **Target Route**: `app/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Target Component**: `components/calculator/cylinder-calc.tsx`
- **Specification**: Ein visuelles Tool, bei dem Kunden die Türblattstärke und Beschlagdicke eingeben, um automatisch die korrekten Zylindermaße (z.B. 30/35) berechnet zu bekommen.

### IDEA_052: Live-Preis-Oszillator für Autoschlüssel
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/calculator/price-estimator.tsx`
- **Specification**: Ein reaktives Diagramm (Bento-Card), das den geschätzten Preisrahmen anhand von Fahrzeugmarke und Schlüsseltyp mittels React 19 useOptimistic visualisiert.

### IDEA_053: Dynamischer Vorher-Nachher Slider für Sicherheit
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/ui/before-after-slider.tsx`
- **Specification**: Ein interaktiver Slider, der eine ungesicherte vs. eine durch Beschläge gesicherte Tür (als Vektor-Grafik) gegenüberstellt.

### IDEA_054: ROI-Rechner für Schließanlagen vs. Einzelschlösser
- **Target Route**: `app/schliessanlagen/konfigurator/page.tsx`
- **Target Component**: `components/calculator/roi-calc.tsx`
- **Specification**: Tool, das die Gesamtkosten einer Anlage inklusive Schlüsselverlust-Risiko im Vergleich zu isolierten Zylindern über 10 Jahre berechnet.

### IDEA_055: Visualisierer für Hierarchie-Ebenen (ZHS/GHS)
- **Target Route**: `app/schliessanlagen/page.tsx`
- **Target Component**: `components/showcase/hierarchy-graph.tsx`
- **Specification**: Ein interaktiver D3/React-Graph, bei dem der Kunde Gruppenschlüssel und Hauptschlüssel per Drag-and-Drop auf Türen verteilen kann, um das Prinzip zu verstehen.

### IDEA_056: Interaktiver Schlüsselanhänger-Konfigurator
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/accessory-picker.tsx`
- **Specification**: Ein Mini-Tool im Autoschlüssel-Flow, um Zubehör (Hüllen, Anhänger) direkt visuell an den konfigurierten Schlüssel zu heften.

### IDEA_057: Checkliste: Ist meine Tür sicher?
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/forms/quiz.tsx`
- **Specification**: Ein reaktives Quiz (10 Fragen) mit Server Actions, das am Ende einen Security-Score und direkte Handlungsempfehlungen liefert.

### IDEA_058: Smart-Home Kompatibilitäts-Prüfer
- **Target Route**: `app/elektronische-zutrittsloesungen/page.tsx`
- **Target Component**: `components/calculator/compatibility-checker.tsx`
- **Specification**: Eingabefeld, in dem der Nutzer sein aktuelles Smarthome-System (z.B. Apple Home, Hue) wählt und sofort passende elektronische Zylinder gefiltert bekommt.

### IDEA_059: Vertrauens-Badge-Rotator mit Live-Prüfung
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/trust-badge.tsx`
- **Specification**: Dynamische Anzeige der Fachbetriebs-Zertifikate, die per Hover eine verifizierte Server-Time-Validation (Zeitstempel) anzeigt.

### IDEA_060: Fotoupload-Analyzer (Client-Side Preview)
- **Target Route**: `app/schluessel-nach-vorlage/anfrage/page.tsx`
- **Target Component**: `components/forms/photo-upload.tsx`
- **Specification**: Tool im Vorlage-Flow, das das hochgeladene Schlüsselfoto clientseitig scannt (mittels Canvas/WebWorker), um Schattenwurf oder Unschärfe direkt abzumahnen.

### IDEA_061: Interaktive Karte der Sperrzonen (Servicegebiet)
- **Target Route**: `app/service-und-termin/page.tsx`
- **Target Component**: `components/calculator/service-area-checker.tsx`
- **Specification**: Eine Postleitzahlen-Eingabe mit instantaner Vektor-Karten-Rückmeldung (Grün/Gelb/Rot) für die Vor-Ort-Verfügbarkeit.

### IDEA_062: Dynamischer Lieferzeiten-Simulator
- **Target Route**: `app/schluessel-nach-code/page.tsx`
- **Target Component**: `components/ui/delivery-simulator.tsx`
- **Specification**: Zeigt basierend auf dem aktuellen Wochentag und der Uhrzeit (Server-Zeit) an, wann ein Schlüssel nach Code voraussichtlich eintrifft.

### IDEA_063: Gamifizierter Schließ-Simulator
- **Target Route**: `app/gleichschliessende-zylinder/page.tsx`
- **Target Component**: `components/showcase/key-simulator.tsx`
- **Specification**: Mini-Interaktion (SVG-Animation), bei der der Nutzer einen Schlüssel mit dem Cursor ins Schloss zieht, um den Unterschied zwischen Standard und Wendeschlüssel zu spüren.

### IDEA_064: Reaktiver Profilzylinder-Exploder
- **Target Route**: `app/tuer-und-schliesstechnik/page.tsx`
- **Target Component**: `components/showcase/explode-view.tsx`
- **Specification**: Ein interaktives SVG, das den Zylinder in seine Einzelteile (Stifte, Federn, Kern) zerlegt, wenn der Nutzer darüber scrollt (Scroll-basiertes Entpacken).

### IDEA_065: Budget-Slider für Sicherheitstechnik
- **Target Route**: `app/sicherheitstechnik/page.tsx`
- **Target Component**: `components/calculator/budget-slider.tsx`
- **Specification**: Kunde stellt ein Gesamtbudget (z.B. 500€) ein und das Tool generiert via Server Action das optimale Paket (z.B. 1 Querriegel + 1 VdS-Zylinder).

### IDEA_066: Verlustkosten-Simulator für Autoschlüssel
- **Target Route**: `app/autoschluessel/page.tsx`
- **Target Component**: `components/calculator/loss-simulator.tsx`
- **Specification**: Berechnet interaktiv die Kosten 'Ersatzschlüssel jetzt machen lassen' (150€) vs. 'Alle Schlüssel weg, Steuergerät muss neu' (1200€) basierend auf dem Fahrzeugmodell.

### IDEA_067: Live-Vergleichs-Matrix für Codelinien
- **Target Route**: `app/schluessel-nach-code/page.tsx`
- **Target Component**: `components/ui/comparison-table.tsx`
- **Specification**: Eine per useTransition gefilterte Tabelle, die Codelinien-Profile direkt beim Tippen sortiert und vergleicht.

### IDEA_068: Interaktiver Schlüsselbund-Gewicht-Rechner
- **Target Route**: `app/gleichschliessende-zylinder/page.tsx`
- **Target Component**: `components/calculator/weight-calc.tsx`
- **Specification**: Ein spaßiges, psychologisches Tool zur Conversion bei Gleichschließungen: Berechnet das Gewicht, das man einspart, wenn 5 Zylinder über einen statt über 5 Schlüssel laufen.

### IDEA_069: Social-Proof Live-Ticker (Simuliert/Echt)
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/social-proof.tsx`
- **Specification**: Subtiles Einblenden in der Ecke: 'Vor 2 Stunden wurde ein Zylinder nach Leipzig versandt' – gesteuert über Server-seitige anonymisierte Historien-Daten.

### IDEA_070: Dynamische Urlaubs-Blocker Visualisierung
- **Target Route**: `app/service-und-termin/page.tsx`
- **Target Component**: `components/ui/calendar-heatmap.tsx`
- **Specification**: Ein Kalender-Bento-Modul, das die `blocked-days.json` als Heatmap darstellt und sofort Dringlichkeit erzeugt ('Noch 3 Termine vor unserem Betriebsurlaub frei').

### IDEA_071: Fahrzeug-Datenbank Schnellsuche (Typeahead)
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/autocomplete.tsx`
- **Specification**: Im Autoschlüssel-Flow eine Suche implementieren, die mit Next.js 16 Partial Prerendering extrem schnell Vorschläge liefert (Autovervollständigung).

### IDEA_072: Interaktiver Panikschloss-Erklärer
- **Target Route**: `app/tuer-und-schliesstechnik/page.tsx`
- **Target Component**: `components/showcase/panic-lock.tsx`
- **Specification**: Ein Button, den man 'drücken' kann, um visuell (CSS) den Unterschied zwischen der Fluchtseite (öffnet immer) und der gesperrten Seite zu sehen.

### IDEA_073: Batterielaufzeit-Rechner für E-Zylinder
- **Target Route**: `app/elektronische-zutrittsloesungen/page.tsx`
- **Target Component**: `components/calculator/battery-calc.tsx`
- **Specification**: Nutzer gibt 'Öffnungen pro Tag' ein und das Tool berechnet die voraussichtliche Laufzeit in Monaten (CR2-Batterien).

### IDEA_074: Visueller Anlagen-Code Decoder
- **Target Route**: `app/schliessanlagen/page.tsx`
- **Target Component**: `components/calculator/decoder.tsx`
- **Specification**: Ein Tool für Bestandskunden, um kryptische Schließanlagen-Nummern auf ihrem Schlüssel in eine lesbare Erklärung (Hersteller, Jahr, Typ) zu decodieren.

### IDEA_075: Dynamisches 'Was brauche ich'-Entscheidungsbaum-Bento
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/decision-tree.tsx`
- **Specification**: Ein 3-Fragen-Modul auf der Startseite, das Kunden direkt zur richtigen Unterseite routet (Bsp: 'Verloren' -> 'Ersatz', 'Nachmachen' -> 'Kopie').

## KATEGORIE D: EXTREME PERFORMANCE, ARCHITEKTUR & DX (IDEEN 76 BIS 100)

### IDEA_076: Strikte Subgrid-Architektur für Produkt-Grids
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/layout/section.tsx`
- **Specification**: Implementierung von `grid-template-rows: subgrid` über 3 Ebenen, um Überschriften, Texte und Buttons in den Card-Grids mathematisch exakt auf der gleichen Baseline zu fixieren.

### IDEA_077: Next.js 'use cache' Memoisierung für Stammdaten
- **Target Route**: `app/autoschluessel/page.tsx`
- **Target Component**: `lib/data.ts`
- **Specification**: Einführung der neuen React 19 `use cache` Direktive für alle `getVehicles`, `getSettings` Aufrufe, um Dateisystem-I/O während des SSR drastisch zu reduzieren.

### IDEA_078: Container Queries für FlowShell-Formulare
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/flow-shell.tsx`
- **Specification**: Umstellung von @media auf @container-Queries im Checkout-Prozess, sodass die Formular-Layouts (Zweispaltig, Einspaltig) basierend auf der tatsächlichen Breite der Card und nicht des Viewports umbrechen.

### IDEA_079: Zero-Layout-Shift Webfont-Optimierung
- **Target Route**: `app/layout.tsx`
- **Target Component**: `app/layout.tsx`
- **Specification**: Einsatz von `next/font/local` mit exakt berechneten `adjustFontFallback` Parametern (size-adjust) für die Inter und IBM Plex Sans, um CLS absolut auf 0 zu zwingen.

### IDEA_080: JSON-LD Graph Typisierung mit schema-dts
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/seo/json-ld.tsx`
- **Specification**: Migration aller SEO-Metadaten von generischem Any-JSON zu strikten TypeScript `satisfies Graph` Maps, um fehlende strukturierte Daten zur Compile-Zeit abzufangen.

### IDEA_081: AVIF-Hero Image Pipeline
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/image-placeholder.tsx`
- **Specification**: Austausch der Placeholder-Bilder durch ein Bild-Komponenten-System, das Next.js Image nutzt, aber zwingend AVIF priorisiert und Preload-Header für das Hero-Motiv setzt.

### IDEA_082: React 19 useTransition für Filter-UIs
- **Target Route**: `app/schluessel-nach-code/page.tsx`
- **Target Component**: `components/forms/filter.tsx`
- **Specification**: Integration von `useTransition` in den Codelinien-Shop, um das Einfrieren der UI beim serverseitigen Filtern von großen JSON-Datenmengen zu verhindern.

### IDEA_083: Server-Action Validierung mit Zod-Action-Middleware
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `lib/actions.ts`
- **Specification**: Abkapseln aller Formular-Submits in eine eigene HOF (Higher Order Function), die das Zod-Parsing erzwingt, bevor die Kernlogik (z.B. Speichern der Anfrage) erreicht wird.

### IDEA_084: Fluid Typography mit CSS clamp()
- **Target Route**: `app/globals.css`
- **Target Component**: `app/globals.css`
- **Specification**: Vollständige Entfernung von text-sm/md/lg Klassen zugunsten semantischer CSS-Variablen (--text-body), die per `clamp(1rem, 2vw, 1.25rem)` stufenlos skalieren.

### IDEA_085: Strict OKLCH Color Tokenization
- **Target Route**: `tailwind.config.ts`
- **Target Component**: `tailwind.config.ts`
- **Specification**: Konvertierung aller verbliebenen HEX/RGB oder Tailwind-Standard-Farben (zinc, slate) in das OKLCH-Farbprofil für absolute P3-Farbraum-Präzision im Light-Mode.

### IDEA_086: Prefetch-Strategie für komplexe Konfiguratoren
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/ui/button.tsx`
- **Specification**: Einbau von Intent-basiertem Prefetching: Wenn der Mauszeiger länger als 100ms auf dem Button 'Ablauf starten' ruht, wird die nächste Route im Hintergrund geholt.

### IDEA_087: Hydration-Guard HOC für LocalStorage-States
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/utils/client-only.tsx`
- **Specification**: Entwicklung eines generischen `<ClientOnly>` Wrappers für Komponenten, die auf `useFlow` (LocalStorage) basieren, um React Hydration-Errors endgültig zu eliminieren.

### IDEA_088: Zustand Store Persistenz-Optimierung
- **Target Route**: `app/schliessanlagen/konfigurator/page.tsx`
- **Target Component**: `lib/store.ts`
- **Specification**: Konfiguration des Zustand-Stores mit einem throttled-Listener (Lodash), damit nicht jeder Tastendruck in langen Formularen sofort das Dateisystem/LocalStorage flutet.

### IDEA_089: Vollständige Entfernung von 'use client' im Layout
- **Target Route**: `app/layout.tsx`
- **Target Component**: `app/layout.tsx`
- **Specification**: Audit und Refactoring aller Provider und Root-Layout-Komponenten, um sicherzustellen, dass die oberste Baum-Ebene zu 100% als React Server Component gerendert wird.

### IDEA_090: CSS-Modules für hoch-spezifische Bento-Grids
- **Target Route**: `app/page.tsx`
- **Target Component**: `components/showcase/spatial-bento-grid.module.css`
- **Specification**: Auslagerung der komplexen Grid-Areas und Subgrid-Definitionen aus den Tailwind-Utility-Klassen in dedizierte CSS-Modules, um die TSX-Lesbarkeit zu retten.

### IDEA_091: Serverseitige Cache-Invalidierung via Tags
- **Target Route**: `app/admin/page.tsx`
- **Target Component**: `lib/actions.ts`
- **Specification**: Nutzung von Next.js 15+ `revalidateTag` in den Admin-Action-Routen, um die Caches der betroffenen Content-Seiten sofort bei Backend-Änderungen zu löschen, anstatt auf Timeouts zu warten.

### IDEA_092: Tailwind 4.x Kompatibilitäts-Vorbereitung
- **Target Route**: `tailwind.config.ts`
- **Target Component**: `tailwind.config.ts`
- **Specification**: Audit der `tailwind.config.ts` und Umstellung auf reine CSS-Variablen-Steuerung, um für das kommende CSS-only Konfigurationsmodell von Tailwind 4 gerüstet zu sein.

### IDEA_093: Strict Type-Mapping für JSON Content-Files
- **Target Route**: `lib/data.ts`
- **Target Component**: `lib/data.ts`
- **Specification**: Generierung von Typen direkt aus den JSON-Schema Definitionen der Content-Dateien, anstatt manuell Interface-Duplikate in TypeScript zu pflegen.

### IDEA_094: Optimistic UI Updates im Warenkorb
- **Target Route**: `app/warenkorb/page.tsx`
- **Target Component**: `components/cart/cart-item.tsx`
- **Specification**: Nutzung von `useOptimistic` beim Löschen oder Ändern der Anzahl von Artikeln, um ein verzögerungsfreies Frontend-Erlebnis trotz Server-Rundlauf zu garantieren.

### IDEA_095: Dynamic Import für schwergewichtige SVG-Komponenten
- **Target Route**: `app/tuer-und-schliesstechnik/page.tsx`
- **Target Component**: `components/showcase/explode-view.tsx`
- **Specification**: Auslagern von komplexen Explosions-Zeichnungen (Zylinder-Anatomie) via `next/dynamic`, um das anfängliche JavaScript-Bundle der Seite drastisch zu reduzieren.

### IDEA_096: CSS `text-wrap: balance` für Hero-Headlines
- **Target Route**: `app/globals.css`
- **Target Component**: `app/globals.css`
- **Specification**: Globale Anwendung von `text-wrap: balance` auf alle h1 und h2 Tags, um algorithmisch perfekte Zeilenumbrüche ohne Orphan-Wörter zu garantieren (verhindert 'Hängende-Wörter').

### IDEA_097: Barrierefreiheit: Focus-Visible Disziplin
- **Target Route**: `app/globals.css`
- **Target Component**: `components/ui/button.tsx`
- **Specification**: Entfernung von Standard-Outlines zugunsten von hoch-spezifischen `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` für Tastatur-Nutzer.

### IDEA_098: Error Boundaries auf Route-Ebene
- **Target Route**: `app/schliessanlagen/error.tsx`
- **Target Component**: `app/schliessanlagen/error.tsx`
- **Specification**: Implementierung dedizierter `error.tsx` Dateien in allen komplexen Konfigurator-Routen mit einer fallback-UI, die den Nutzer sanft zum Start zurückführt statt abzustürzen.

### IDEA_099: Edge-Runtime Kompatibilität für Form-Actions
- **Target Route**: `lib/actions.ts`
- **Target Component**: `lib/actions.ts`
- **Specification**: Prüfung und Refactoring von Node-spezifischen APIs in den Form-Handlern, damit diese perspektivisch in der Vercel Edge-Runtime ablaufen können.

### IDEA_100: React 19 Form Status Integration
- **Target Route**: `app/autoschluessel/anfrage/page.tsx`
- **Target Component**: `components/forms/flow-shell.tsx`
- **Specification**: Migration aller manuellen Loading-States (`const [isPending, startTransition] = useTransition()`) in Formularen zur nativen `useFormStatus` Hook für sauberen Code.
