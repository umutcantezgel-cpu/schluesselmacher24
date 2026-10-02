# Red-Team 100-Ideen Matrix

## A: AWWWARDS-KINETIK & TAKTILE INTERAKTION (1-25)
### IDEA_001: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/showcase/spatial-bento-grid.tsx`
- **Spec:** Überführung der Feature-Karten in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.
- **Score:** 9.95

### IDEA_002: Magnetischer Cursor-Attraktor für CTA-Buttons
- **Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Component:** `components/ui/magnetic-button.tsx`
- **Spec:** Implementierung einer framer-motion Federphysik, die den Cursor im 20px Radius um den primären "Anfrage"-Button anzieht und sanft einrasten lässt (Swiss Light Mode konform).
- **Score:** 8.5

### IDEA_003: Parallax-Scroll-Dämpfung für das Hero-Motiv
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/hero/parallax-hero.tsx`
- **Spec:** Subtile Scroll-Transformation des Werkstatt-Fotos mit einer Dämpfungsrate von 0.05, um Kinetik ohne visuelles Rauschen zu erzeugen.
- **Score:** 7.8

### IDEA_004: Mikro-Haptisches Feedback bei Accordion-Toggle
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/ui/accordion-haptic.tsx`
- **Spec:** Integration eines 150ms oklch-basierten Ripple-Effekts auf den FAQ-Accordions, gekoppelt mit einer federnden Expansion.
- **Score:** 7.2

### IDEA_005: Fluid Hover-Zustände für Marken-Logos
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/brands/brand-grid.tsx`
- **Spec:** Graustufen-Bilder (oklch) gleiten bei Hover durch einen weichen 400ms CSS-Filter-Übergang zur originalen Farbgebung, ohne Layout-Verschiebungen.
- **Score:** 7.5

### IDEA_006: Interaktive SVG-Pfad-Animation für Schlüsselprofile
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/visuals/svg-key-path.tsx`
- **Spec:** Scroll-getriebene Animation, die das Fräsen eines Schlüssels über einen SVG-Pfad (stroke-dashoffset) darstellt.
- **Score:** 8.1

### IDEA_007: Taktiles Feedback für Konfigurator-Schieberegler
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/configurator/tactile-slider.tsx`
- **Spec:** Schieberegler im Zylinder-Konfigurator wackeln bei Grenzwerten subtil und verändern ihre oklch-Sättigung.
- **Score:** 8.9

### IDEA_008: Kinetische Typografie für Section-Eyebrows
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/typography/kinetic-eyebrow.tsx`
- **Spec:** Die Eyebrows (z.B. "Schnelleinstieg") rotieren bei Sichtbarkeit buchstabenweise mit 50ms Verzögerung ein.
- **Score:** 6.5

### IDEA_009: Fluid Bento-Expansion bei Klick
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/layout/fluid-bento.tsx`
- **Spec:** Bento-Grid-Elemente im Ratgeber öffnen sich inline ohne Navigationswechsel über Layout-Animationen (framer-motion).
- **Score:** 8.3

### IDEA_010: Scroll-Velocity basierte Skalierung der Teaser
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/cards/velocity-card.tsx`
- **Spec:** Ratgeber-Teaser skalieren um max 2% abhängig von der Scroll-Geschwindigkeit des Nutzers.
- **Score:** 7.9

### IDEA_011: Dynamischer Schattenwurf bei Karten-Hover
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/ui/directional-shadow-card.tsx`
- **Spec:** Schatten (box-shadow) berechnet sich nach der relativen Mausposition zum Zentrum der Karte für räumliche Tiefe.
- **Score:** 8.6

### IDEA_012: Elegante Page-Transition mit Blend-Modus
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/transitions/page-blend.tsx`
- **Spec:** Seitenübergänge nutzen einen Mix-Blend-Mode mit einem oklch-neutralen Overlay für seidenweiche Übergänge.
- **Score:** 7.1

### IDEA_013: Sticky Scroll-Stapel für Leistungsphasen
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/layout/sticky-stack.tsx`
- **Spec:** Die 5 Phasen stapeln sich beim Scrollen übereinander wie physische Karten.
- **Score:** 8.4

### IDEA_014: Inertia-Scrolling für Tab-Navigation
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/navigation/inertia-tabs.tsx`
- **Spec:** Horizontale Tabs in der Bestellübersicht erhalten ein trägheitsbasiertes Scroll-Verhalten per JS-Physik.
- **Score:** 7.6

### IDEA_015: Kontextuelle Hover-Aura um Icons
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/icons/aura-icon.tsx`
- **Spec:** Icons erhalten eine subtile oklch-basierte Aura, die bei Mausnähe an Intensität gewinnt.
- **Score:** 6.8

### IDEA_016: Animierte Skeleton-Lader mit Shimmer
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/loading/shimmer-skeleton.tsx`
- **Spec:** Warenkorb lädt mit seidenweichen, oklch-harmonisierten Shimmer-Effekten ohne harte Kontraste.
- **Score:** 7.4

### IDEA_017: Reaktive Formular-Labels mit Morphing
- **Route:** `src/app/(site)/kasse/page.tsx`
- **Component:** `components/forms/morphing-input.tsx`
- **Spec:** Labels von Input-Feldern morphen nahtlos in den Border der Inputs bei Fokus.
- **Score:** 8.2

### IDEA_018: Hover-Kinetik für den "Zur Kasse"-Button
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/ui/spring-button.tsx`
- **Spec:** Pfeil-Icon im Button bewegt sich um 2px nach rechts mit einer Spring-Animation bei Hover.
- **Score:** 6.1

### IDEA_019: Fortschrittsanzeige als kreisendes SVG
- **Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Component:** `components/progress/circular-svg-progress.tsx`
- **Spec:** Im Autoschlüssel-Ablauf wächst der Fortschritt als organische SVG-Linie rund um den Container.
- **Score:** 8

### IDEA_020: Drag-to-Reorder in Konfigurator-Listen
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/configurator/draggable-list.tsx`
- **Spec:** Taktiles Drag-and-Drop von Zylinder-Konfigurationen mit framer-motion und haptischem Feedback.
- **Score:** 8.7

### IDEA_021: Mikro-Vibration bei Formular-Fehlern
- **Route:** `src/app/(site)/kasse/page.tsx`
- **Component:** `components/forms/vibrating-input.tsx`
- **Spec:** Input-Felder vibrieren leicht (x-Achse) bei fehlerhafter Validierung, unterstützt von weichem Rot (oklch).
- **Score:** 7.9

### IDEA_022: Aufklappbare 3D-Karten für Marken
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/brands/3d-brand-card.tsx`
- **Spec:** Marken-Logos rotieren bei Klick leicht in die 3D-Ebene, um Details preiszugeben.
- **Score:** 8.5

### IDEA_023: Text-Reveal Animation für Headlines
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/typography/reveal-headline.tsx`
- **Spec:** Headlines im Hero-Bereich werden durch eine Maske weich nach oben ins Sichtfeld geschoben.
- **Score:** 7.3

### IDEA_024: Interaktive Daten-Visualisierung von Zylinder-Maßen
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/visuals/dynamic-cylinder-svg.tsx`
- **Spec:** SVG-Darstellung eines Zylinders passt sich live an die eingegebenen Maße an.
- **Score:** 9.1

### IDEA_025: Sanfter Parallax im Standort-Map-Hero
- **Route:** `src/app/(site)/standorte/page.tsx`
- **Component:** `components/maps/parallax-map.tsx`
- **Spec:** Hintergrundkarte bewegt sich leicht gegenläufig zur Scrollrichtung.
- **Score:** 6.9

## B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG (26-50)
### IDEA_026: Deep-Dive Vergleichsmatrix Schließanlagen
- **Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Component:** `components/content/comparison-matrix.tsx`
- **Spec:** Inhaltliche Erweiterung auf > 800 Wörter mit einer technischen Vergleichstabelle der Profilzylinder-Systeme.
- **Score:** 8.5

### IDEA_027: Fach-FAQ Architektur für Autoschlüssel
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/faq/semantic-faq.tsx`
- **Spec:** Semantisch verschachteltes FAQ mit Schema.org Anreicherung und detaillierten technischen Antworten.
- **Score:** 8.2

### IDEA_028: Historie und Technik der Schlüssel-Codes
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/content/history-block.tsx`
- **Spec:** Ausbau der Seite "Schlüssel nach Code" mit historischen und technischen Hintergründen zur CNC-Fräsung.
- **Score:** 7.8

### IDEA_029: Prozessschritte der Sicherheits-Analyse
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/content/process-steps.tsx`
- **Spec:** Detaillierte Beschreibung des 10-Schritte-Audits vor Ort auf der Sicherheitstechnik-Seite (Inhalt > 800 Wörter).
- **Score:** 8.6

### IDEA_030: Ratgeber-Silo: Türöffnung ohne Zerstörung
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/content/methodology-guide.tsx`
- **Spec:** Einbettung einer tiefgehenden Erklärung der Sperrwerkzeuge und Methoden in die Ratgeber-Hub-Seite.
- **Score:** 7.5

### IDEA_031: Begriffslexikon: Elektronische Zutrittssysteme
- **Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Component:** `components/content/glossary-list.tsx`
- **Spec:** Umfangreiches Glossar zu RFID, NFC und Biometrie direkt auf der Hauptseite integriert.
- **Score:** 8.1

### IDEA_032: Transparenz-Report: Warum Preise variieren
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/content/transparency-report.tsx`
- **Spec:** Ein 600-Wörter-Block über Preisbildung bei Autoschlüsseln (Transponder vs. Mechanik).
- **Score:** 8.8

### IDEA_033: Materialkunde: Tür- und Schließtechnik
- **Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Component:** `components/content/material-science.tsx`
- **Spec:** Detaillierte Analyse von Messing vs. gehärtetem Stahl in Zylindern zur semantischen Autorität.
- **Score:** 7.9

### IDEA_034: Fallstudien-Sektion für Standorte
- **Route:** `src/app/(site)/standorte/page.tsx`
- **Component:** `components/content/local-case-studies.tsx`
- **Spec:** Erweiterung der Standortseite um lokale Case-Studies realer Absicherungs-Projekte.
- **Score:** 8.3

### IDEA_035: Mythen-Check: Gleichschließende Zylinder
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/content/myth-buster.tsx`
- **Spec:** Eine Sektion, die häufige Missverständnisse über Sicherheitseinbußen bei Gleichschließung aufklärt.
- **Score:** 7.7

### IDEA_036: Schritt-für-Schritt Anleitung zur Code-Findung
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/content/code-locator-guide.tsx`
- **Spec:** Visueller und textueller Leitfaden, wo Kunden ihren Schlüsselcode finden.
- **Score:** 8.4

### IDEA_037: Experten-Interview: Einbruchprävention
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/content/expert-interview.tsx`
- **Spec:** Fließtext-Interview mit einem Sicherheitsexperten direkt in der Sicherheitstechnik-Seite (> 800 W).
- **Score:** 8

### IDEA_038: Normen und Zertifikate erklärt
- **Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Component:** `components/content/standards-explainer.tsx`
- **Spec:** Auflistung und Erklärung der DIN-Normen für Schließzylinder zur Steigerung der Autorität.
- **Score:** 8.5

### IDEA_039: Vor- und Nachteile von Funkschlüsseln
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/content/keyless-analysis.tsx`
- **Spec:** Tiefgehende Analyse von Keyless-Go Risiken und Schutzmaßnahmen (Faraday-Käfig).
- **Score:** 8.2

### IDEA_040: Service-Level-Agreements im Detail
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/content/sla-details.tsx`
- **Spec:** Ausbau der Service-Seite um exakte Reaktionszeiten und SLAs bei Notöffnungen.
- **Score:** 7.6

### IDEA_041: Ökologische Aspekte der Schlüsselherstellung
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/content/eco-statement.tsx`
- **Spec:** Einbettung von Nachhaltigkeits-Infos zur Messing-Wiederverwertung.
- **Score:** 6.8

### IDEA_042: Rechtliche Rahmenbedingungen für Videoüberwachung
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/content/legal-framework.tsx`
- **Spec:** Ausbau der Recht-Sektion auf der Sicherheitstechnik-Seite (DSGVO-Tiefenanalyse).
- **Score:** 8.7

### IDEA_043: Entwicklung der Autoschlüssel-Transponder
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/content/transponder-history.tsx`
- **Spec:** Historischer Abriss von 1995 bis heute zur Demonstration von Fachwissen.
- **Score:** 7.4

### IDEA_044: Kosten-Nutzen-Analyse elektronischer Zutritt
- **Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Component:** `components/content/roi-analysis-text.tsx`
- **Spec:** Detaillierter Text-Vergleich von mechanisch vs. elektronisch für Unternehmen.
- **Score:** 8.6

### IDEA_045: Anatomie eines Hochsicherheits-Zylinders
- **Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Component:** `components/content/cylinder-anatomy.tsx`
- **Spec:** Explosionsgrafik-beschreibender Text mit extrem hohem Detailgrad (> 800 Wörter).
- **Score:** 8.3

### IDEA_046: Ratgeber: Die richtige Zylinderlänge messen
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/content/measuring-guide.tsx`
- **Spec:** Textuelle Masterclass zur Messung mit Schieblehre und Zollstock.
- **Score:** 8.9

### IDEA_047: Versand- und Verpackungs-Philosophie
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/content/shipping-philosophy.tsx`
- **Spec:** Erweiterung der Warenkorb-Seite um vertrauensbildende Versand-Details.
- **Score:** 7.2

### IDEA_048: Wartung und Pflege von Schließanlagen
- **Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Component:** `components/content/maintenance-guide.tsx`
- **Spec:** Tiefgehende Pflegehinweise (Graphitspray vs. Spezialöl) auf der Schließanlagen-Seite.
- **Score:** 8.1

### IDEA_049: Das "Secure-by-Design" Prinzip
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/content/secure-by-design.tsx`
- **Spec:** Architektonische Sicherheitskonzepte für Neubauten detailliert erläutert.
- **Score:** 7.9

### IDEA_050: Technologie-Stack der CNC-Fräsen
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/content/cnc-tech-stack.tsx`
- **Spec:** Einblick in die Maschinen (Silca etc.), die für Code-Schlüssel genutzt werden.
- **Score:** 8.4

## C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE (51-75)
### IDEA_051: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/calculator/enterprise-roi-calculator.tsx`
- **Spec:** Reaktiver Schieberegler mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere Fließtext auf 850 Wörter.
- **Score:** 9.85

### IDEA_052: Dynamischer Autoschlüssel-Preis-Schätzer
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/calculator/car-key-estimator.tsx`
- **Spec:** Native React 19 Action Form mit Schiebereglern für Marke, Baujahr und Verlustart für sofortige Preisschätzung.
- **Score:** 9.2

### IDEA_053: Vorher-Nachher Slider für Sicherheitstechnik
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/interactive/before-after-slider.tsx`
- **Spec:** Interaktiver Bild-Slider (oklch), der eine ungesicherte Tür gegen eine hochgesicherte Variante blendet.
- **Score:** 8.6

### IDEA_054: Zylinder-Maß-Simulator in Echtzeit
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/interactive/cylinder-dimension-simulator.tsx`
- **Spec:** Interaktives Tool zur Eingabe von A/B Maßen, das sofort visuell warnt, falls asymmetrische Extreme erreicht werden.
- **Score:** 9

### IDEA_055: Interaktiver Entscheidungsbaum: Mechanik vs Elektronik
- **Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Component:** `components/interactive/decision-tree.tsx`
- **Spec:** Ein interaktives Quiz mit 3 Fragen, das zur idealen Zutrittslösung führt, verarbeitet via Server Actions.
- **Score:** 8.9

### IDEA_056: Live-Verfügbarkeits-Indikator für Termine
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/widgets/live-availability.tsx`
- **Spec:** Pulsierender Indikator (oklch(0.7 0.15 150) für Grün) zeigt simulierte/echte Werkstatt-Auslastung an.
- **Score:** 8.4

### IDEA_057: Vertrauens-Dashboard: Letzte erfolgreiche Fräsungen
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/widgets/trust-feed.tsx`
- **Spec:** Ein rollierender Feed von anonymisierten, frisch gefrästen Schlüsseln zur Social-Proof-Generierung.
- **Score:** 8.1

### IDEA_058: Interaktives Preis-Kompositions-Diagramm
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/visuals/price-composition-chart.tsx`
- **Spec:** Ein Donut-Chart (SVG), das die Preisbestandteile eines Autoschlüssels (Bart, Transponder, Anlernen) bei Hover aufschlüsselt.
- **Score:** 8.7

### IDEA_059: Code-Karten-Scanner Simulator
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/interactive/code-card-scanner.tsx`
- **Spec:** Ein UI-Mockup, das verdeutlicht, wie Kunden ihre Schlüsselkarte abfotografieren sollten (mit Fehler-Erkennungsvisualisierung).
- **Score:** 8.3

### IDEA_060: Sicherheits-Level-Tachometer
- **Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Component:** `components/interactive/security-tachometer.tsx`
- **Spec:** Interaktives Tacho-Element, das den berechneten Sicherheitsgrad nach Eingabe von Schloss-Typen anzeigt.
- **Score:** 8.8

### IDEA_061: Smart-Filter für Ratgeber-Artikel
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/filters/smart-article-filter.tsx`
- **Spec:** Nutzt useTransition für sofortige Filterung der Ratgeber-Artikel nach Tags (Auto, Haus, Tresor) ohne Ladezeiten.
- **Score:** 8.5

### IDEA_062: Interaktive Karte der Einsatzgebiete
- **Route:** `src/app/(site)/standorte/page.tsx`
- **Component:** `components/maps/interactive-service-map.tsx`
- **Spec:** SVG-basierte Karte, die Hover-States für verschiedene Landkreise und deren Anfahrtskosten bietet.
- **Score:** 8.2

### IDEA_063: Checkliste: Was tun bei Schlüsselverlust?
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/interactive/loss-checklist.tsx`
- **Spec:** Interaktive ToDo-Liste im Browser, deren Zustand im LocalStorage gesichert wird (Client Component).
- **Score:** 8

### IDEA_064: Schließanlagen-Hierarchie-Builder
- **Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Component:** `components/interactive/hierarchy-builder.tsx`
- **Spec:** Ein visuelles Drag-and-Drop Tool, um eine simple Master-Key Hierarchie zu skizzieren (Visualisierung).
- **Score:** 9.3

### IDEA_065: Dynamische Rabatt-Berechnung im Warenkorb
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/widgets/animated-discount-counter.tsx`
- **Spec:** Echtzeit-Berechnung von Mengenrabatten bei Zylindern mit animierter Counter-Komponente.
- **Score:** 8.6

### IDEA_066: Konfigurator-Fortschritt-Speicher
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/configurator/save-progress.tsx`
- **Spec:** Ein "Konfiguration speichern" Button, der einen Magic Link via Server Action generiert.
- **Score:** 8.9

### IDEA_067: Interaktiver Einbruch-Gefahren-Radar
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/interactive/risk-radar.tsx`
- **Spec:** Tool zur Auswahl der Wohnsituation (EG, MFH), das die gefährdetsten Einstiegspunkte farblich markiert.
- **Score:** 9.1

### IDEA_068: Gamifizierter Fahrzeug-Selektor
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/filters/gamified-brand-selector.tsx`
- **Spec:** Marken-Auswahl nutzt große, durchsuchbare und visuell filterbare Grid-Elemente für blitzschnelle Selektion.
- **Score:** 8.4

### IDEA_069: Echtzeit-Validierung für Schlüssel-Codes
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/forms/code-validator.tsx`
- **Spec:** Client-seitige Pattern-Validierung (Regex) für typische Code-Formate (Silca, Keyline) mit grünem Check-Feedback.
- **Score:** 8.7

### IDEA_070: Interaktives Zeitstrahl-Widget für Reparaturen
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/visuals/interactive-timeline.tsx`
- **Spec:** Zeigt den typischen Ablauf einer Zylinder-Reparatur als anklickbaren Zeitstrahl.
- **Score:** 7.8

### IDEA_071: Warenkorb-Upsell mit One-Click-Hinzufügen
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/cart/smart-upsell.tsx`
- **Spec:** Intelligente Vorschläge (z.B. Graphitspray zu Zylindern) mit einem nativen Formular für sofortiges Add-to-Cart.
- **Score:** 8.9

### IDEA_072: Visuelle Profilerkennung für Schlüssel
- **Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Component:** `components/interactive/profile-matcher.tsx`
- **Spec:** Ein kleines Tool, bei dem Nutzer die Rillen ihres Schlüssels grob nachklicken können, um das System zu bestimmen.
- **Score:** 9.4

### IDEA_073: Notfall-Button mit pulsierender Dringlichkeit
- **Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Component:** `components/widgets/emergency-fab.tsx`
- **Spec:** Ein schwebender Button für "Schlüssel im Auto eingeschlossen" mit extrem hoher Konversions-Psychologie.
- **Score:** 8.2

### IDEA_074: Feedback-Loop: "War dieser Artikel hilfreich?"
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/widgets/feedback-loop.tsx`
- **Spec:** Daumen Hoch/Runter Mechanik am Ende von Ratgebern, gekoppelt an eine React 19 Action.
- **Score:** 7.5

### IDEA_075: Dynamisches Trust-Badge-Grid
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/widgets/trust-badges.tsx`
- **Spec:** Zertifikate (VdS etc.) werden in einem Grid dargestellt, das bei Hover detaillierte Tooltips zur Bedeutung einblendet.
- **Score:** 8

## D: EXTREME PERFORMANCE, ARCHITEKTUR & DX (76-100)
### IDEA_076: Next.js 16 "use cache" Memoisierung für Marken
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `app/(site)/autoschluessel/marken/page.tsx`
- **Spec:** Die Marken-Übersicht wird komplett auf Server-Ebene über die neue use cache Direktive extrem performant bereitgestellt.
- **Score:** 9

### IDEA_077: Container Queries (@container) für Bento-Grids
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/showcase/bento-grid.tsx`
- **Spec:** Umbau der Startseiten-Cards von Media-Queries auf Container-Queries für perfekte Modul-Kapselung.
- **Score:** 8.8

### IDEA_078: AVIF-Hero-Pipelines für Werkstatt-Bilder
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/hero/image-hero.tsx`
- **Spec:** Strikte Erzwingung von AVIF-Formaten für alle ImagePlaceholders zur Halbierung der LCP-Zeit.
- **Score:** 8.5

### IDEA_079: Zero-Shift Webfont-Optimierung
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `app/layout.tsx`
- **Spec:** Nutzung von next/font/local mit size-adjust zur vollständigen Eliminierung von CLS durch IBM Plex Sans.
- **Score:** 8.9

### IDEA_080: CSS Subgrid Harmonisierung für Formulare
- **Route:** `src/app/(site)/kasse/page.tsx`
- **Component:** `components/forms/checkout-form.tsx`
- **Spec:** Die komplexen Kassen-Formulare nutzen subgrid, um Labels und Inputs kolumnenübergreifend perfekt auszurichten.
- **Score:** 8.6

### IDEA_081: Entfernung toter onClick Handler (Silent Logic Death)
- **Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Component:** `components/ui/accordion.tsx`
- **Spec:** Audit und Bereinigung von leeren Arrow-Functions in Accordion- und Tab-Komponenten.
- **Score:** 9.2

### IDEA_082: Hydration-Guard für LocalStorage
- **Route:** `src/app/(site)/warenkorb/page.tsx`
- **Component:** `components/cart/cart-provider.tsx`
- **Spec:** Sicherstellung, dass der Warenkorb-State nicht serverseitig rendert und so Hydration-Mismatches verursacht.
- **Score:** 9.4

### IDEA_083: Typisierung von Schema.org mit schema-dts
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/seo/json-ld.tsx`
- **Spec:** Strikte Validierung aller JSON-LD Blobs im Ratgeber durch TypeScript `satisfies Graph`.
- **Score:** 8.7

### IDEA_084: React 19.2+ useActionState für Kontakt
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `components/forms/contact-form.tsx`
- **Spec:** Umbau des Kontaktformulars auf den neuen useActionState Hook für robustes Error-Handling ohne useEffect.
- **Score:** 9.3

### IDEA_085: Strikte OKLCH-Variablen-Sicherung
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `tailwind.config.ts`
- **Spec:** Entfernen jeglicher HEX/RGB Werte aus Tailwind-Klassen und Ersetzen durch semantische CSS-Variablen.
- **Score:** 8.9

### IDEA_086: Preloading von Konfigurator-Assets
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Spec:** SVG-Assets für den Zylinder-Konfigurator werden per rel="preload" im Head injiziert.
- **Score:** 8.2

### IDEA_087: Eliminierung von schwerem Drittanbieter-Code
- **Route:** `src/app/(site)/standorte/page.tsx`
- **Component:** `components/ui/carousel.tsx`
- **Spec:** Ersetzen einer schweren Carousel-Library durch eine native CSS-Scroll-Snap Lösung für Standorte.
- **Score:** 9.1

### IDEA_088: Prefetching-Optimierung für Ratgeber-Links
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `components/navigation/article-link.tsx`
- **Spec:** Gezieltes hover-basiertes Prefetching der Artikel-Routen statt globalem Prefetch.
- **Score:** 8.4

### IDEA_089: Dynamische Importe für schwere SVG-Graphen
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/visuals/dynamic-cylinder-svg.tsx`
- **Spec:** Der Zylinder-SVG-Visualisierer wird via next/dynamic nur bei Bedarf im Client geladen.
- **Score:** 8.8

### IDEA_090: Vermeidung bedingter Render-Löcher
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/brands/brand-list.tsx`
- **Spec:** Sicherstellung, dass leere Arrays (z.B. keine Suchergebnisse bei Marken) elegante Fallback-Layouts haben.
- **Score:** 9

### IDEA_091: Server-seitige Paginierung für Ratgeber
- **Route:** `src/app/(site)/ratgeber/page.tsx`
- **Component:** `app/(site)/ratgeber/page.tsx`
- **Spec:** Umbau der Client-Paginierung auf URL-basierte searchParams, um SEO und Performance zu maximieren.
- **Score:** 8.5

### IDEA_092: Memoisierung von Konfigurator-Berechnungen
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/configurator/price-calculator.tsx`
- **Spec:** Nutzung von React.useMemo für die Preisberechnung im Zylinder-Konfigurator zur Vermeidung von Re-Rendern.
- **Score:** 8.3

### IDEA_093: Isolierung von Zustand im Autoschlüssel-Ablauf
- **Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Component:** `components/forms/car-key-store.ts`
- **Spec:** Nutzung von atomarem Zustand (z.B. Zustand/Jotai) statt massivem Context-Provider, um Re-Renders zu minimieren.
- **Score:** 8.7

### IDEA_094: Reduzierung von DOM-Tiefe bei Cards
- **Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Component:** `components/ui/card.tsx`
- **Spec:** Refactoring der Card-Komponenten, um unnötige Wrapper-Divs zu entfernen und das CSS zu verschlanken.
- **Score:** 8.1

### IDEA_095: Sicherstellung von Bild-Dimensionen
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/ui/image-placeholder.tsx`
- **Spec:** Allen <img> und <Image> Tags explizite width/height Attribute zuweisen, um Layout-Shifts zu verhindern.
- **Score:** 9.5

### IDEA_096: Entkopplung von Suchfeld-Eingaben
- **Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Component:** `components/forms/search-input.tsx`
- **Spec:** Implementierung eines useDebounce-Hooks für das Marken-Suchfeld zur Schonung des Main-Threads.
- **Score:** 8.6

### IDEA_097: Strikte Typisierung der Server Action Responses
- **Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Component:** `actions/contact.ts`
- **Spec:** Definition von robusten Discriminated Unions für Success/Error States bei Formularen.
- **Score:** 9.2

### IDEA_098: Automatisierte a11y-Checks für Kontraste
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `styles/colors.css`
- **Spec:** Integration eines Scripts zur Prüfung, ob alle OKLCH Farben AAA-Kontrast auf reinem Weiß garantieren.
- **Score:** 8.9

### IDEA_099: Effizientes State-Reset bei Routenwechsel
- **Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Component:** `components/configurator/reset-guard.tsx`
- **Spec:** Einbau eines Guards, der den Konfigurator-Status beim Verlassen der Seite gezielt bereinigt.
- **Score:** 8.4

### IDEA_100: Optimierung der SVG-Pfade
- **Route:** `src/app/(site)/page.tsx`
- **Component:** `components/icons/index.tsx`
- **Spec:** Manuelles Verschlanken und SVGO-Kompression für alle inline-SVGs, um die Bundle-Größe zu minimieren.
- **Score:** 8
