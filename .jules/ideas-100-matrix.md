# 100-Ideen Matrix für Schluesselmacher24

## KATEGORIE A: AWWWARDS-KINETIK & TAKTILE INTERAKTION

### IDEA_001
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Idee:** Physikalische Federdämpfung (spring physics) bei Hover über Fahrzeugmarken-Karten, mit dynamischer Schatten-Adaption (oklch(0 0 0 / 0.05)).

### IDEA_002
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/schliessplan.tsx`
- **Idee:** Scroll-getriebene SVG-Animation der Schließplan-Hierarchie, die sich flüssig beim Scrollen aufbaut (framer-motion useScroll).

### IDEA_003
- **Ziel-Route:** `src/app/(site)/kasse/page.tsx`
- **Ziel-Komponente:** `src/components/forms/controls.tsx`
- **Idee:** Mikro-haptisches Feedback bei der Auswahl von Zahlungsmethoden (Scale-Down 0.98, border-color transition zu oklch(0.6 0.15 250)).

### IDEA_004
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Ziel-Komponente:** `src/components/ui/accordion.tsx`
- **Idee:** Fluides Layout-Morphing beim Öffnen von Accordion-Elementen mit View Transitions API, keine abrupten Höhenänderungen.

### IDEA_005
- **Ziel-Route:** `src/app/(site)/warenkorb/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`
- **Idee:** Magnetische Buttons für Checkout-Aktionen, bei denen der Button dem Mauszeiger leicht folgt (Framer Motion useMouse).

### IDEA_006
- **Ziel-Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/flow/flow-shell.tsx`
- **Idee:** Dynamische Hintergrund-Unschärfe (backdrop-blur) bei Modal-Übergängen zwischen Formularschritten.

### IDEA_007
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`
- **Idee:** Taktiles Feedback-System bei Drag&Drop von Berechtigungsgruppen mit Cursor-Locking.

### IDEA_008
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Idee:** Kinetische Drag&Drop Zone für Datei-Uploads, die bei Enter physikalisch wackelt (Damping: 10, Stiffness: 400).

### IDEA_009
- **Ziel-Route:** `src/app/page.tsx`
- **Ziel-Komponente:** `src/components/ui/image-placeholder.tsx`
- **Idee:** Parallax-Scroll-Effekte für Hero-Bilder, sanft gekoppelt an die Scroll-Velocity.

### IDEA_010
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Idee:** Stufenloser Listenfilter, bei dem gefilterte Elemente nicht verschwinden, sondern weich auf opacity: 0 und height: 0 animieren.

### IDEA_011
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-code/shop-liste.tsx`
- **Idee:** 3D-Neigung (Tilt-Effekt) der Produktkarten basierend auf relativer Mausposition (Transform: perspective(1000px) rotateX...).

### IDEA_012
- **Ziel-Route:** `src/app/(site)/service-und-termin/terminstatus/page.tsx`
- **Ziel-Komponente:** `src/components/visual/motion/check-draw.tsx`
- **Idee:** Erweitertes, konfetti-artiges SVG-Feuerwerk nach Eingabe einer erfolgreichen Vorgangsnummer.

### IDEA_013
- **Ziel-Route:** `src/app/(site)/autoschluessel/smart-key/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/key-kinds.tsx`
- **Idee:** Bento-Grid Hover-Reveal: Cursor-Fokus erzeugt einen weichen, maskierten Verlauf hinter den Schlüssel-Cards.

### IDEA_014
- **Ziel-Route:** `src/app/services/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/enterprise-roi-calculator.tsx`
- **Idee:** Interaktiver Enterprise ROI- und Ladezeit-Kalkulator: Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere den umgebenden Fließtext auf 850 Wörter.

### IDEA_015
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
- **Idee:** Reaktive Verbindungs-Linien (SVG) zwischen zusammengehörigen Zylindergruppen, die live mitgezeichnet werden.

### IDEA_016
- **Ziel-Route:** `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/schluessel.tsx`
- **Idee:** Interaktive 2.5D SVG-Vorschau des Schlüssels, der beim Scrollen aus dem Profil-Rohling "herausgefräst" wird.

### IDEA_017
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/components/ui/badge.tsx`
- **Idee:** Fluid Tag-Cloud für Kategorien, die physikalisch kollidieren und sich neu anordnen (d3-force).

### IDEA_018
- **Ziel-Route:** `src/app/(site)/rechtliches/datenschutz/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/rechtliches/datenschutz/page.tsx`
- **Idee:** Animierter Lese-Fortschrittsbalken, organisch integriert in die Scrollbar (oklch(0.8 0.1 260)).

### IDEA_019
- **Ziel-Route:** `src/app/(site)/standorte/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/standorte/page.tsx`
- **Idee:** Interaktive, SVG-basierte Schweizer Karte mit Ripple-Effekten bei den verfügbaren Standorten.

### IDEA_020
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/components/schliessanlagen/system-erklaerung.tsx`
- **Idee:** Schicht-Aufbau-Animation von Schließanlagen-Systemen durch Scroll-Triggered Opacity und Y-Translate.

### IDEA_021
- **Ziel-Route:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/zutritt-signal.tsx`
- **Idee:** Visuelle Darstellung von Funkwellen (SVG), deren Frequenz und Amplitude sich bei Hover ändern.

### IDEA_022
- **Ziel-Route:** `src/app/(site)/service-und-termin/vor-ort/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/service-und-termin/vor-ort/page.tsx`
- **Idee:** Wabendes Hintergrund-Muster (Grid-Noise), das subtil auf Scroll-Richtung reagiert.

### IDEA_023
- **Ziel-Route:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Idee:** Konfetti- und Morph-Animation beim erfolgreichen Abschluss der Bestellung (Staging zu Success State).

### IDEA_024
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/sicherheitstechnik/[slug]/page.tsx`
- **Idee:** Fließende Typografie: Überschriften wachsen sanft (Clamp + View Transitions), wenn Unterseiten geladen werden.

### IDEA_025
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/termin-auswahl.tsx`
- **Idee:** Micro-Interactions beim Auswählen eines Zeitslots: weiche Expansion, Schatten-Vertiefung (AAA-Kontrast) und Klick-Ripple.

## KATEGORIE B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG

### IDEA_026
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/page.tsx`
- **Idee:** Erweiterung des Einleitungstextes auf >800 Wörter mit detaillierten Definitionen zu Transpondern, WFS und Rohlingen.

### IDEA_027
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schliessanlagen/page.tsx`
- **Idee:** Einfügen einer detaillierten Vergleichsmatrix (Generalhauptschlüssel vs. Zentralanlage) mit 850 Wörtern Begleittext.

### IDEA_028
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Idee:** Tiefgehende Fach-FAQ-Architektur (10 Fragen) zur DIN-Norm von Sicherheitsbeschlägen und Zylindern.

### IDEA_029
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Idee:** Technischer Prozess-Schritt-Guide (>900 Wörter) zur Migration von mechanischen zu elektronischen Anlagen.

### IDEA_030
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Idee:** Erstellung eines Lexikons zur Code-Entschlüsselung (Silca, JMA) mit 1200 Wörtern Inhaltsvolumen.

### IDEA_031
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-vorlage/page.tsx`
- **Idee:** Integration einer Matrix zur Identifikation von Kopierschutz-Merkmalen (Patente, Markenrecht, Frässpuren).

### IDEA_032
- **Ziel-Route:** `src/app/(site)/ratgeber/autoschluessel-verloren-was-tun/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/ratgeber/[slug]/page.tsx`
- **Idee:** Aufwertung des Beitrags auf Autoritäts-Niveau: 1500 Wörter, Checklisten, juristische Pflichten gegenüber der Versicherung.

### IDEA_033
- **Ziel-Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/service-und-termin/page.tsx`
- **Idee:** Detail-Erläuterung der SLA (Service Level Agreements) und Notdienst-Prozesse (>800 Wörter).

### IDEA_034
- **Ziel-Route:** `src/app/(site)/standorte/[city]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/standorte/[city]/page.tsx`
- **Idee:** Hyperlokale Content-Maximierung: Ergänzung ortsspezifischer Kriminalitäts-Statistiken und Sicherheits-Empfehlungen (850 Wörter pro Stadt).

### IDEA_035
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Idee:** Markenspezifische Historie der Wegfahrsperren (z.B. VW Immo 1-5) als Deep-Dive Text zur Stärkung der SEO-Autorität.

### IDEA_036
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/gleichschliessende-zylinder/page.tsx`
- **Idee:** Erweiterte Anleitung zum korrekten Ausmessen von Zylindern mit >1000 Wörtern und strukturierten Tabellen.

### IDEA_037
- **Ziel-Route:** `src/app/(site)/rechtliches/datenschutz/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/rechtliches/datenschutz/page.tsx`
- **Idee:** Glossar zur DSGVO im Handwerkskontext (Videoüberwachung, Schlüsselaufbewahrung).

### IDEA_038
- **Ziel-Route:** `src/app/(site)/rechtliches/agb/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/rechtliches/agb/page.tsx`
- **Idee:** Plain-English Zusammenfassung (TL;DR) über den juristischen Texten zur besseren UX.

### IDEA_039
- **Ziel-Route:** `src/app/(site)/kasse/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/kasse/page.tsx`
- **Idee:** Ergänzung von Trust-Content (Sicherheit der Transaktion, SSL-Erklärung, PCI-DSS) im Checkout.

### IDEA_040
- **Ziel-Route:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Idee:** Deep-Dive (1100 Wörter) in die OBD-Programmierung, Token-Kosten und EEPROM-Technik.

### IDEA_041
- **Ziel-Route:** `src/app/(site)/autoschluessel/smart-key/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/smart-key/page.tsx`
- **Idee:** Vergleich Keyless-Go vs. klassischer Funkschlüssel (Reichweite, Relay-Attacks) mit 900 Wörtern.

### IDEA_042
- **Ziel-Route:** `src/app/page.tsx`
- **Ziel-Komponente:** `src/components/showcase/spatial-bento-grid.tsx`
- **Idee:** Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex: Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

### IDEA_043
- **Ziel-Route:** `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- **Idee:** Technische Abhandlung (850 Wörter) über CNC-Frästechnik vs. manuelles Kopieren, Toleranzen und Materialhärte.

### IDEA_044
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Idee:** Detaillierter Anforderungskatalog an KfW-Förderfähigkeit im Rahmen des Einbruchschutzes.

### IDEA_045
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx`
- **Idee:** Begleitende Fallstudie (Case Study) eines KMU-Migrationsprojekts integriert in den Konfigurator-Flow.

### IDEA_046
- **Ziel-Route:** `src/app/(site)/service-und-termin/vor-ort/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/service-und-termin/vor-ort/page.tsx`
- **Idee:** Checkliste für den Vor-Ort-Service (Was der Kunde vorbereiten muss) auf >800 Wörter ausgebaut.

### IDEA_047
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Idee:** Glossar der Schließanlagen-Begrifflichkeiten (Sicherungskarte, Profilzylinder, Prioritätsfunktion).

### IDEA_048
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`
- **Idee:** Hersteller-Spezifische Content-Silos (z.B. ABUS, BKS) mit detaillierter Erläuterung der Code-Zusammensetzung.

### IDEA_049
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Idee:** Wörterbuch der Türmechanik (Dornmaß, Entfernungsmaß, Stulp) mit strukturierten Schema-Daten.

### IDEA_050
- **Ziel-Route:** `src/app/(site)/ratgeber/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/ratgeber/[slug]/page.tsx`
- **Idee:** Ergänzung von "Expert Quotes" (Expertenzitaten) und strukturierten Autoren-Profilen (Schema.org Person).

## KATEGORIE C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE

### IDEA_051
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/service-einsatz-rechner.tsx`
- **Idee:** Interaktiver Kostensimulator für Vor-Ort vs. Werkstatt-Service (React 19 useOptimistic, Server Actions).

### IDEA_052
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/tuer-absicherung-rechner.tsx`
- **Idee:** Budgetrechner für Gebäudegrößen (Gewerblich vs. Privat), der sofort Schätzpreise ausgibt.

### IDEA_053
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/rechner-bausteine.tsx`
- **Idee:** TCO-Kalkulator (Total Cost of Ownership) über 5 Jahre: Mechanik (Schlüsselverlust) vs. Elektronik.

### IDEA_054
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/tuer-absicherung-rechner.tsx`
- **Idee:** Interaktiver Vorher-Nachher-Slider zur visuellen Darstellung des Sicherheits-Gewinns bei Panzerriegeln.

### IDEA_055
- **Ziel-Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/flow/flow-shell.tsx`
- **Idee:** Live-Anzeige gesparter Zeit gegenüber Vertragswerkstätten im Fortschrittsbalken.

### IDEA_056
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/forms/controls.tsx`
- **Idee:** Dynamisches Filter-System mit sofortigem Update (React 19 startTransition) zur schnellen Code-Identifikation.

### IDEA_057
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
- **Idee:** Visueller Zylinder-Längen-Konfigurator: Eingabe der Maße verändert die SVG-Generatoren in Echtzeit.

### IDEA_058
- **Ziel-Route:** `src/app/(site)/warenkorb/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/warenkorb/warenkorb-ansicht.tsx`
- **Idee:** Gamifizierte "Missing-to-Free-Shipping" Bar, basierend auf Server Actions.

### IDEA_059
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/preis-anzeige.tsx`
- **Idee:** Interaktiver "Was passiert, wenn alle Schlüssel weg sind"-Kostensimulator.

### IDEA_060
- **Ziel-Route:** `src/app/(site)/service-und-termin/anfrage/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/service-und-termin/anfrage/anfrage-formular.tsx`
- **Idee:** Intelligente Dringlichkeits-Einstufung (AI-Heuristik) basierend auf Freitext-Eingabe (via Server Action).

### IDEA_061
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Idee:** Client-Side (WASM) Vorprüfung hochgeladener Schlüsselbilder auf Schärfe und Helligkeit.

### IDEA_062
- **Ziel-Route:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Idee:** Referral-Widget nach Abschluss: "Gutscheincode für Freunde generieren" (Action State).

### IDEA_063
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`
- **Idee:** Radar-Chart Generierung der aktuellen Heimsicherheit am Ende des Checks (SVG).

### IDEA_064
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Idee:** Interaktiver Diagnose-Baum ("Tür klemmt", "Schlüssel hakt") mit Lösungs-Empfehlungen.

### IDEA_065
- **Ziel-Route:** `src/app/(site)/autoschluessel/smart-key/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/vehicle-facts.tsx`
- **Idee:** Dynamische Verfügbarkeits-Ampel (Ersatzteile auf Lager) basierend auf der Modellauswahl.

### IDEA_066
- **Ziel-Route:** `src/app/(site)/kasse/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/kasse/kasse-formular.tsx`
- **Idee:** Live PLZ-Validierung und automatische Erkennung der Stadt über externe API ohne Reload.

### IDEA_067
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx`
- **Idee:** Export-to-PDF Funktion (Server Action), um die Konfiguration als hübsches Angebot herunterzuladen.

### IDEA_068
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/elektronische-zutrittsloesungen/konfigurator/zutritt-konfigurator.tsx`
- **Idee:** ROI-Dashboard-Einblendung am Ende der Konfiguration: Gesparte Zeit im Admin-Bereich.

### IDEA_069
- **Ziel-Route:** `src/app/(site)/service-und-termin/terminstatus/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/service-und-termin/terminstatus/status-formular.tsx`
- **Idee:** Magic Link Anforderung für den Status, um 2FA und PIN-Eingaben zu umgehen.

### IDEA_070
- **Ziel-Route:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/preis-anzeige.tsx`
- **Idee:** Transparenz-Rechner: Aufschlüsselung der Kosten in Hardware, Software-Lizenzen, Arbeitszeit.

### IDEA_071
- **Ziel-Route:** `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/key-kinds.tsx`
- **Idee:** Interaktive Material-Wahl (Messing vs. Stahl) mit unmittelbarem Preis-Feedback.

### IDEA_072
- **Ziel-Route:** `src/app/page.tsx`
- **Ziel-Komponente:** `src/components/ui/accordion.tsx`
- **Idee:** Dynamische FAQs auf der Startseite: Sortierung passt sich automatisch der User-Journey (Referrer) an.

### IDEA_073
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-code/[slug]/bestell-formular.tsx`
- **Idee:** Tool-Tip Lexikon: Fachbegriffe im Bestellformular bekommen beim Hover kleine Explainer-Cards.

### IDEA_074
- **Ziel-Route:** `src/app/(site)/standorte/[city]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/standorte/[city]/page.tsx`
- **Idee:** Interaktiver "Bin ich im Servicegebiet?" Rechner mit PLZ-Radiusprüfung.

### IDEA_075
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/ratgeber/page.tsx`
- **Idee:** Lesezeichen-Funktion (LocalStorage + Action State), um Artikel für später zu speichern.

## KATEGORIE D: EXTREME PERFORMANCE, ARCHITEKTUR & DX

### IDEA_076
- **Ziel-Route:** `src/app/layout.tsx`
- **Ziel-Komponente:** `src/app/layout.tsx`
- **Idee:** Implementierung von Next.js 15 "use cache" Direktiven für alle statischen Content-Seiten.

### IDEA_077
- **Ziel-Route:** `src/app/globals.css`
- **Ziel-Komponente:** `src/app/globals.css`
- **Idee:** Migration der Grid-Systeme auf CSS Subgrid, um Kartenhöhen über Container-Grenzen hinweg anzugleichen.

### IDEA_078
- **Ziel-Route:** `src/components/ui/image-placeholder.tsx`
- **Ziel-Komponente:** `src/components/ui/image-placeholder.tsx`
- **Idee:** Einführung von Container Queries (@container) in allen Cards für intrinsisch responsive Layouts ohne Media-Queries.

### IDEA_079
- **Ziel-Route:** `src/app/layout.tsx`
- **Ziel-Komponente:** `src/app/layout.tsx`
- **Idee:** AVIF-Hero-Pipelines: Aufbau einer automatisierten Image-Optimization-Pipeline via Sharp für WebP/AVIF.

### IDEA_080
- **Ziel-Route:** `src/app/layout.tsx`
- **Ziel-Komponente:** `src/app/layout.tsx`
- **Idee:** Zero-Shift Webfont-Optimierung (font-display: optional, preconnect, size-adjust) für IBM Plex Sans.

### IDEA_081
- **Ziel-Route:** `src/components/flow/flow-shell.tsx`
- **Ziel-Komponente:** `src/components/flow/flow-shell.tsx`
- **Idee:** Zustand-Store Re-Architektur: Umstellung auf persistierte Slices für atomare Formular-Updates.

### IDEA_082
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/page.tsx`
- **Idee:** Radikale Reduktion der Client-JS Payload durch serverseitiges Rendering der Akkordeons (HTML <details> native).

### IDEA_083
- **Ziel-Route:** `src/components/visual/generators/grafik-basis.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/grafik-basis.tsx`
- **Idee:** Memoization der SVG-Generatoren-Ausgabe auf Edge-Ebene zur Entlastung des Servers.

### IDEA_084
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schliessanlagen/konfigurator/projekt-konfigurator.tsx`
- **Idee:** Web Worker Offloading für komplexe Berechnungen großer Schließpläne (z.B. >500 Zylinder).

### IDEA_085
- **Ziel-Route:** `src/components/forms/photo-upload.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Idee:** Streaming Multipart-Uploads direkt in den S3-Bucket ohne Node.js Middle-man (Presigned URLs).

### IDEA_086
- **Ziel-Route:** `src/components/ui/button.tsx`
- **Ziel-Komponente:** `src/components/ui/button.tsx`
- **Idee:** Strikte OKLCH-Migration in Tailwind v4: Entfernung aller CSS-Variablen zugunsten nativer Tailwind-oklch-Support.

### IDEA_087
- **Ziel-Route:** `src/app/layout.tsx`
- **Ziel-Komponente:** `src/components/seo/json-ld.tsx`
- **Idee:** Automatisierte Schema.org Graph-Generierung (schema-dts) für alle Breadcrumbs, Produkte und FAQs dynamisch.

### IDEA_088
- **Ziel-Route:** `src/app/(site)/rechtliches/cookie-einstellungen/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/rechtliches/cookie-einstellungen/cookie-einstellungen.tsx`
- **Idee:** CSP (Content Security Policy) Strict Mode Evaluierung und Nonce-Generierung per Middleware.

### IDEA_089
- **Ziel-Route:** `src/app/(site)/kasse/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/kasse/kasse-formular.tsx`
- **Idee:** Optimistic UI Updates bei Zahlungsart-Wechsel zur Reduktion der wahrgenommenen Latenz auf 0ms.

### IDEA_090
- **Ziel-Route:** `src/components/layout/site-header.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Idee:** Off-Main-Thread Ausführung von Drittanbieter-Scripts (z.B. Analytics, falls später hinzugefügt) per Partytown.

### IDEA_091
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Idee:** Turbopack Incremental Cache für Fahrzeugdaten (stale-while-revalidate 86400).

### IDEA_092
- **Ziel-Route:** `src/components/ui/accordion.tsx`
- **Ziel-Komponente:** `src/components/ui/accordion.tsx`
- **Idee:** Ersetzung von Framer Motion in simplen UI-Elementen durch reine CSS View Transitions (Astro-like).

### IDEA_093
- **Ziel-Route:** `src/app/sitemap.ts`
- **Ziel-Komponente:** `src/app/sitemap.ts`
- **Idee:** Dynamische XML-Sitemap Generierung gestreamt für >1000 generierte Produktseiten.

### IDEA_094
- **Ziel-Route:** `src/components/forms/controls.tsx`
- **Ziel-Komponente:** `src/components/forms/controls.tsx`
- **Idee:** A11y-Audit: Sicherstellung perfekter Tastatur-Fokussierung (Focus-Visible) mit OKLCH Outline-Offsets.

### IDEA_095
- **Ziel-Route:** `src/app/robots.txt`
- **Ziel-Komponente:** `src/app/robots.ts`
- **Idee:** Robots.txt Tuning: Aggressiveres Crawl-Delay für Bots zum Schutz der Formular-Endpunkte.

### IDEA_096
- **Ziel-Route:** `src/components/visual/registry.tsx`
- **Ziel-Komponente:** `src/components/visual/registry.tsx`
- **Idee:** Tree-Shaking Optimierung der SVG-Icons durch Umstellung auf named exports und dynamic imports.

### IDEA_097
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/schluessel-nach-code/shop-liste.tsx`
- **Idee:** Prefetching-Heuristiken: Hover Intent Erkennung lädt die Routen-Daten erst bei >100ms Hover.

### IDEA_098
- **Ziel-Route:** `src/components/layout/site-footer.tsx`
- **Ziel-Komponente:** `src/components/layout/site-footer.tsx`
- **Idee:** Inline-Critical-CSS für die Above-The-Fold Elemente extrahieren (Reduktion FCP).

### IDEA_099
- **Ziel-Route:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/bestellung/[id]/page.tsx`
- **Idee:** Einsatz von React 19 `use` Hook für das Auflösen des Order-Promises direkt im Render-Tree (Suspense Boundary).

### IDEA_100
- **Ziel-Route:** `src/components/visual/motion/motion-style.ts`
- **Ziel-Komponente:** `src/components/visual/motion/motion-style.ts`
- **Idee:** Reduzierung von Layout-Thrashing durch Bündelung der DOM-Lese/Schreib-Vorgänge (fastdom).
