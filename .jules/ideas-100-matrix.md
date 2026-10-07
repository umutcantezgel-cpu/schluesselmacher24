# 100-IDEAS MATRIX

## IDEA_001: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/ratgeber/[slug]/page.tsx
- **Target Component:** src/components/calculator/tuer-absicherung-rechner.tsx
- **Specification:** Überführung der bestehenden Struktur in src/components/calculator/tuer-absicherung-rechner.tsx in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

## IDEA_002: Physikalische Federdämpfung für Navigationselemente
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx
- **Target Component:** src/components/layout/mobile-action-bar.tsx
- **Specification:** Erweiterung von src/components/layout/mobile-action-bar.tsx um eine framer-motion gesteuerte spring-animation (stiffness: 400, damping: 25) für ein taktiles Feedback-Gefühl beim Hovern.

## IDEA_003: Scroll-getriebene SVG-Draw-On Animation für Bereichs-Icons
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schluessel-nach-vorlage/page.tsx
- **Target Component:** src/components/layout/page-header.tsx
- **Specification:** Implementierung einer scroll-timeline basierten SVG-Pfad-Animation in src/components/layout/page-header.tsx zur graduellen Enthüllung der Konturen beim Herunterscrollen.

## IDEA_004: Mikro-haptisches Feedback auf primären Call-to-Actions
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/warenkorb/page.tsx
- **Target Component:** src/components/autoschluessel/termin-auswahl.tsx
- **Specification:** Nutzung von navigator.vibrate und skalierenden CSS-Transforms in src/components/autoschluessel/termin-auswahl.tsx für spürbares haptisches Feedback auf mobilen Geräten.

## IDEA_005: Fluide Hover-Zustände mit OKLCH-Gradients
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/kasse/page.tsx
- **Target Component:** src/components/schliessanlagen/system-erklaerung.tsx
- **Specification:** Einbau eines radialen OKLCH-Gradients als Hintergrund für src/components/schliessanlagen/system-erklaerung.tsx, dessen Zentrum dem Mauszeiger folgt.

## IDEA_006: Kinetische Scroll-Snap Architektur für Service-Abschnitte
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schluessel-nach-code/page.tsx
- **Target Component:** src/components/visual/motion/reveal.tsx
- **Specification:** Einführung von CSS scroll-snap-type: y mandatory in src/components/visual/motion/reveal.tsx für präzises Ansteuern der Content-Blöcke.

## IDEA_007: Parallax-Tiefeneffekt auf Trust-Badges
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schluessel-nach-code/[slug]/page.tsx
- **Target Component:** src/components/visual/generators/code-fundstelle.tsx
- **Specification:** Anwendung eines dezenten translateZ(20px) Effekts in Kombination mit perspective(1000px) auf src/components/visual/generators/code-fundstelle.tsx.

## IDEA_008: Reaktives Cursor-Tracking für Formular-Felder
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/page.tsx
- **Target Component:** src/components/forms/option-card.tsx
- **Specification:** Hinzufügen von onPointerMove Handlern zu src/components/forms/option-card.tsx, um eine subtile Highlight-Aura um das Element zu rendern.

## IDEA_009: In-View Reveal mit gestaffelter Sub-Element-Verzögerung
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/sicherheitstechnik/page.tsx
- **Target Component:** src/components/autoschluessel/key-kinds.tsx
- **Specification:** Staffelung von Animations-Verzögerungen für Kinder von src/components/autoschluessel/key-kinds.tsx über CSS --stagger-delay Variablen.

## IDEA_010: Magnetische Button-Kanten bei Cursor-Annäherung
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/sicherheitstechnik/[slug]/page.tsx
- **Target Component:** src/components/calculator/service-einsatz-rechner.tsx
- **Specification:** Berechnung des Abstands zum Cursor in src/components/calculator/service-einsatz-rechner.tsx und leichte Anziehungskraft per translate(), wenn der Cursor sich auf 50px nähert.

## IDEA_011: WebGL basierte Glaseffekte auf Floating Action Bars
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx
- **Target Component:** src/components/ui/button.tsx
- **Specification:** Ersatz der einfachen Hintergrundfarbe in src/components/ui/button.tsx durch einen backdrop-filter: blur(12px) mit leichter Noise-Textur.

## IDEA_012: Morphing-Shapes bei Kategorie-Wechseln
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/tuer-und-schliesstechnik/page.tsx
- **Target Component:** src/components/layout/section.tsx
- **Specification:** Einsatz von clip-path: polygon() in src/components/layout/section.tsx mit CSS-Transitions für sanfte Formwandlungen bei Statusänderungen.

## IDEA_013: Adaptive Outline-Rings bei Keyboard-Fokus
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx
- **Target Component:** src/components/autoschluessel/bestaetigung.tsx
- **Specification:** Strikte Definition von :focus-visible Ringen in src/components/autoschluessel/bestaetigung.tsx (2px solid oklch(0.6 0.2 260)) mit ring-offset.

## IDEA_014: Sticky-Header mit logarithmischer Größenanpassung
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/bestellung/[id]/page.tsx
- **Target Component:** src/components/visual/bereich-icon.tsx
- **Specification:** Verknüpfung der Höhe von src/components/visual/bereich-icon.tsx mit der aktuellen Scroll-Position über Intersection Observers für flüssiges Verkleinern.

## IDEA_015: Elastische Pull-to-Refresh Simulation im Mobile View
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/gleichschliessende-zylinder/page.tsx
- **Target Component:** src/components/visual/motion/draw-on.tsx
- **Specification:** Imitation eines elastischen Ziehens in src/components/visual/motion/draw-on.tsx bei Touch-Gesten am oberen Rand mittels transform: translateY().

## IDEA_016: Interaktive Daten-Visualisierung für Schließpläne
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx
- **Target Component:** src/components/forms/controls.tsx
- **Specification:** Erweiterung von src/components/forms/controls.tsx um interaktive D3.js gestützte Diagramme, die beim Hovern detaillierte Datenpunkte zeigen.

## IDEA_017: Taktile Slider für Preis-Kalkulatoren
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/elektronische-zutrittsloesungen/page.tsx
- **Target Component:** src/components/ui/accordion.tsx
- **Specification:** Austausch der Standard-Range-Inputs in src/components/ui/accordion.tsx durch maßgeschneiderte taktile Slider mit visuellem Feedback.

## IDEA_018: Hover-ausgelöste Lottie-Animationen für Feature-Icons
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx
- **Target Component:** src/components/forms/photo-upload.tsx
- **Specification:** Integration von Lottie-Playern in src/components/forms/photo-upload.tsx, die abspielen, sobald der Benutzer mit dem Element interagiert.

## IDEA_019: Sanfte Route-Transitions mit View Transitions API
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schliessanlagen/page.tsx
- **Target Component:** src/components/ui/card.tsx
- **Specification:** Nutzung der nativen View Transitions API für src/components/ui/card.tsx, um Navigations-Sprünge als fließende Bewegungen darzustellen.

## IDEA_020: Dynamische Schatten-Intensität basierend auf Umgebungslicht
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/schliessanlagen/konfigurator/page.tsx
- **Target Component:** src/components/layout/site-footer.tsx
- **Specification:** Anpassung der box-shadow Alpha-Werte in src/components/layout/site-footer.tsx basierend auf systemweiten prefers-color-scheme und Helligkeitswerten.

## IDEA_021: Isometrische 3D-Kippeffekte auf Info-Cards
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/service-und-termin/terminstatus/page.tsx
- **Target Component:** src/components/autoschluessel/preis-anzeige.tsx
- **Specification:** Rotieren von src/components/autoschluessel/preis-anzeige.tsx um die X- und Y-Achse relativ zur Mausposition für einen pseudo-3D Effekt.

## IDEA_022: Gepulste Outline-Effekte bei wichtigen Warnungen
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/service-und-termin/anfrage/page.tsx
- **Target Component:** src/components/vertrauen/nachweise-liste.tsx
- **Specification:** Hinzufügen einer unendlichen keyframe-Animation zu src/components/vertrauen/nachweise-liste.tsx, die den outline-offset periodisch vergrößert und ausblendet.

## IDEA_023: Echtzeit-Partikeleffekte bei erfolgreichem Formular-Submit
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/service-und-termin/page.tsx
- **Target Component:** src/components/visual/motion/in-view.tsx
- **Specification:** Auslösen einer canvas-basierten Konfetti/Partikel-Explosion über src/components/visual/motion/in-view.tsx nach erfolgreicher Aktion.

## IDEA_024: Scroll-gekoppelte Fortschrittsbalken am oberen Bildschirmrand
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/service-und-termin/vor-ort/page.tsx
- **Target Component:** src/components/visual/generators/zutritt-signal.tsx
- **Specification:** Fixierung eines minimalen Balkens in src/components/visual/generators/zutritt-signal.tsx, der über scroll() linear von 0 auf 100% Breite wächst.

## IDEA_025: Sanftes Blur-Reveal für Lazy-Loaded Bilder
- **Category:** AWWWARDS_KINETICS
- **Target Route:** src/app/(site)/service-und-termin/kontakt/page.tsx
- **Target Component:** src/components/forms/field.tsx
- **Specification:** Starten von src/components/forms/field.tsx mit filter: blur(20px) und sanftes Animieren zu blur(0) bei Eintreten in den Viewport.

## IDEA_026: Inhaltliche Vertiefung zu hochsicheren Zylindersystemen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/impressum/page.tsx
- **Target Component:** src/components/layout/site-header.tsx
- **Specification:** Ausbau der Route src/app/(site)/rechtliches/impressum/page.tsx auf über 800 Wörter, mit Fokus auf Bohr- und Ziehschutz, inkl. schema.org/FAQPage Auszeichnung.

## IDEA_027: Detaillierte Matrix für Schließanlagen-Typen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/cookie-einstellungen/page.tsx
- **Target Component:** src/components/calculator/tuer-absicherung-rechner.tsx
- **Specification:** Hinzufügen einer detaillierten HTML-Tabelle in src/app/(site)/rechtliches/cookie-einstellungen/page.tsx, die Z-Anlagen, HS-Anlagen und GHS-Anlagen gegenüberstellt.

## IDEA_028: Technische FAQ zur Autoschlüssel-Codierung
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/versand-und-zahlung/page.tsx
- **Target Component:** src/components/layout/mobile-action-bar.tsx
- **Specification:** Ergänzung von src/app/(site)/rechtliches/versand-und-zahlung/page.tsx um 10 tiefgehende technische Fragen und Antworten zum Anlernen von Transpondern.

## IDEA_029: Erweiterte Prozess-Schritte für Vor-Ort Service
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/widerruf/page.tsx
- **Target Component:** src/components/layout/page-header.tsx
- **Specification:** Gliederung der Route src/app/(site)/rechtliches/widerruf/page.tsx in klare nummerierte Abschnitte, die den genauen Ablauf von Anruf bis Türöffnung beschreiben.

## IDEA_030: Semantische Strukturierung von Sicherheits-Tipps
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/agb/page.tsx
- **Target Component:** src/components/autoschluessel/termin-auswahl.tsx
- **Specification:** Überarbeitung der Überschriften-Hierarchie (H1-H4) in src/app/(site)/rechtliches/agb/page.tsx, um SEO-Autorität für Long-Tail-Keywords zu stärken.

## IDEA_031: Deep-Dive in elektronische Zutrittskontrollen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/rechtliches/datenschutz/page.tsx
- **Target Component:** src/components/schliessanlagen/system-erklaerung.tsx
- **Specification:** Erweiterung des Textes in src/app/(site)/rechtliches/datenschutz/page.tsx um Abschnitte zu RFID, Bluetooth Low Energy und biometrischen Scannern.

## IDEA_032: Umfassende Historie der Schlüsselanfertigung
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/artikel/page.tsx
- **Target Component:** src/components/visual/motion/reveal.tsx
- **Specification:** Hinzufügen eines historischen Kontext-Abschnitts in src/app/(site)/artikel/page.tsx, der die Entwicklung von Bartschlüsseln zu Wendeschlüsseln zeigt.

## IDEA_033: Vergleich von mechanischem vs. elektronischem Schutz
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/artikel/[slug]/page.tsx
- **Target Component:** src/components/visual/generators/code-fundstelle.tsx
- **Specification:** Integration eines strukturierten Pro/Contra-Bereichs in src/app/(site)/artikel/[slug]/page.tsx für verschiedene Sicherheits-Konzepte.

## IDEA_034: Glossar für Fachbegriffe der Schließtechnik
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/standorte/page.tsx
- **Target Component:** src/components/forms/option-card.tsx
- **Specification:** Erstellung einer Definitions-Liste (<dl>) in src/app/(site)/standorte/page.tsx, die Begriffe wie 'Gefahrenfunktion' und 'Freilauf' erklärt.

## IDEA_035: Schritt-für-Schritt Anleitung zur Zylinder-Ausmessung
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/standorte/[city]/page.tsx
- **Target Component:** src/components/autoschluessel/key-kinds.tsx
- **Specification:** Einbetten einer ausführlichen, bebilderten Text-Anleitung in src/app/(site)/standorte/[city]/page.tsx, wie man das Innen- und Außenmaß korrekt abliest.

## IDEA_036: Detaillierte Beschreibung von Smart-Key Technologien
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/marken/page.tsx
- **Target Component:** src/components/calculator/service-einsatz-rechner.tsx
- **Specification:** Ergänzung der Seite src/app/(site)/autoschluessel/marken/page.tsx um technische Details zu Kessy und Keyless-Go Systemen und deren Sicherheit.

## IDEA_037: Erklärung der DIN-Normen für Sicherheitstüren
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx
- **Target Component:** src/components/ui/button.tsx
- **Specification:** Erläuterung der Widerstandsklassen (RC1-RC6) nach DIN EN 1627 im Kontext der Seite src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx.

## IDEA_038: Ausführlicher Ratgeber zur Einbruchprävention
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/marken/[make]/page.tsx
- **Target Component:** src/components/layout/section.tsx
- **Specification:** Verfassen eines 1000-Wörter umfassenden Ratgebers in src/app/(site)/autoschluessel/marken/[make]/page.tsx, basierend auf Polizei-Empfehlungen (K-EINBRUCH).

## IDEA_039: Experten-Interview Integration im Content
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/funkschluessel/page.tsx
- **Target Component:** src/components/autoschluessel/bestaetigung.tsx
- **Specification:** Einfügen eines fiktiven oder echten Experten-Interviews im Q&A-Format auf src/app/(site)/autoschluessel/funkschluessel/page.tsx zur Steigerung der Trust-Signale.

## IDEA_040: Case Studies für Firmen-Schließanlagen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/programmieren/page.tsx
- **Target Component:** src/components/visual/bereich-icon.tsx
- **Specification:** Darstellung realer Anwendungsfälle für komplexe Gebäude auf src/app/(site)/autoschluessel/programmieren/page.tsx, mit detaillierten Schließplänen.

## IDEA_041: Erweiterung der Standort-Spezifika und lokaler Gegebenheiten
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/anfrage/page.tsx
- **Target Component:** src/components/visual/motion/draw-on.tsx
- **Specification:** Lokalisierung des Inhalts auf src/app/(site)/autoschluessel/anfrage/page.tsx mit spezifischen Informationen zu Anfahrtszeiten und regionalen Besonderheiten.

## IDEA_042: Ausarbeitung rechtlicher Rahmenbedingungen für Schlüsselkopien
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/page.tsx
- **Target Component:** src/components/forms/controls.tsx
- **Specification:** Präzisierung der rechtlichen Anforderungen (z.B. Sicherungskarte) für die Nachbestellung auf src/app/(site)/autoschluessel/page.tsx.

## IDEA_043: Detaillierte Materialkunde für Schlüsselrohlinge
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/kopieren/page.tsx
- **Target Component:** src/components/ui/accordion.tsx
- **Specification:** Beschreibung der Unterschiede zwischen Messing, Neusilber und Stahl-Rohlingen auf src/app/(site)/autoschluessel/kopieren/page.tsx.

## IDEA_044: Tiefgehende Analyse von Wegfahrsperren-Systemen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/nachmachen/page.tsx
- **Target Component:** src/components/forms/photo-upload.tsx
- **Specification:** Detaillierte technische Erklärung der Transponder-Chips (z.B. Megamos, Texas Instruments) auf src/app/(site)/autoschluessel/nachmachen/page.tsx.

## IDEA_045: Spezifische Problemlösungs-Szenarien für blockierte Zylinder
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/smart-key/page.tsx
- **Target Component:** src/components/ui/card.tsx
- **Specification:** Schritt-für-Schritt Troubleshooting-Guide auf src/app/(site)/autoschluessel/smart-key/page.tsx für Situationen, in denen der Schlüssel klemmt.

## IDEA_046: Erweiterte Wartungstipps für mechanische Schließzylinder
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx
- **Target Component:** src/components/layout/site-footer.tsx
- **Specification:** Ergänzung von Pflegehinweisen (Grafitpulver vs. Spezialöl) zur Verlängerung der Lebensdauer auf src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx.

## IDEA_047: Detaillierte Anleitung für Notöffnungs-Szenarien
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx
- **Target Component:** src/components/autoschluessel/preis-anzeige.tsx
- **Specification:** Transparente Darstellung der zerstörungsfreien Öffnungsmethoden (z.B. Sperrhaken, Elektropick) auf src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx.

## IDEA_048: Ausführliche Beschreibung des Fräsprozesses
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(payload)/admin/[[...segments]]/page.tsx
- **Target Component:** src/components/vertrauen/nachweise-liste.tsx
- **Specification:** Erklärung der CNC-gesteuerten Schlüssel-Fräsmaschinen und ihrer Toleranzen auf src/app/(payload)/admin/[[...segments]]/page.tsx.

## IDEA_049: Semantische Aufbereitung der Garantiebedingungen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/ratgeber/page.tsx
- **Target Component:** src/components/visual/motion/in-view.tsx
- **Specification:** Klarstrukturierte Aufbereitung der Gewährleistung bei nachgemachten Schlüsseln auf src/app/(site)/ratgeber/page.tsx.

## IDEA_050: Integration strukturierter Daten für lokale Dienstleistungen
- **Category:** SEMANTIC_AUTHORITY
- **Target Route:** src/app/(site)/ratgeber/[slug]/page.tsx
- **Target Component:** src/components/visual/generators/zutritt-signal.tsx
- **Specification:** Einbettung von umfangreichem JSON-LD auf src/app/(site)/ratgeber/[slug]/page.tsx zur Spezifizierung der angebotenen lokalen Schlüsseldienst-Leistungen.

## IDEA_051: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx
- **Target Component:** src/components/forms/field.tsx
- **Specification:** Entwicklung eines reaktiven Schieberegler-Tools in src/components/forms/field.tsx mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid auf der Route src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx.

## IDEA_052: Dynamischer Preisrechner für Autoschlüssel-Kopien
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schluessel-nach-vorlage/page.tsx
- **Target Component:** src/components/layout/site-header.tsx
- **Specification:** Einbau eines mehrstufigen Dropdowns in src/components/layout/site-header.tsx, das basierend auf Marke, Modell und Baujahr den exakten Preis berechnet.

## IDEA_053: Vorher-Nachher Slider für Türabsicherungen
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/warenkorb/page.tsx
- **Target Component:** src/components/calculator/tuer-absicherung-rechner.tsx
- **Specification:** Implementierung eines interaktiven Image-Sliders in src/components/calculator/tuer-absicherung-rechner.tsx, um eine Tür vor und nach der Montage eines Querriegels zu zeigen.

## IDEA_054: Interaktiver Schließanlagen-Konfigurator mit React Server Actions
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/kasse/page.tsx
- **Target Component:** src/components/layout/mobile-action-bar.tsx
- **Specification:** Nutzung von Server Actions in src/components/layout/mobile-action-bar.tsx, um Schließplan-Konfigurationen in Echtzeit serverseitig zu validieren und Preise zu berechnen.

## IDEA_055: Echtzeit-Verfügbarkeits-Prüfer für Vor-Ort Service
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schluessel-nach-code/page.tsx
- **Target Component:** src/components/layout/page-header.tsx
- **Specification:** Eingabe von Postleitzahlen in src/components/layout/page-header.tsx, um über eine Server Action sofort die geschätzte Ankunftszeit anzuzeigen.

## IDEA_056: Schritt-für-Schritt Fehlerdiagnose-Assistent
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schluessel-nach-code/[slug]/page.tsx
- **Target Component:** src/components/autoschluessel/termin-auswahl.tsx
- **Specification:** Erstellung eines interaktiven Wizards in src/components/autoschluessel/termin-auswahl.tsx, der durch gezielte Fragen (z.B. 'Steckt der Schlüssel noch?') die Lösung eingrenzt.

## IDEA_057: Bento-Grid für Fahrzeugmodell-Auswahl
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/page.tsx
- **Target Component:** src/components/schliessanlagen/system-erklaerung.tsx
- **Specification:** Umbau der Fahrzeugauswahl in src/components/schliessanlagen/system-erklaerung.tsx zu einem visuell ansprechenden CSS-Grid mit Hersteller-Logos.

## IDEA_058: Interaktive Karte für Service-Gebiete
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/sicherheitstechnik/page.tsx
- **Target Component:** src/components/visual/motion/reveal.tsx
- **Specification:** Integration einer interaktiven SVG-Karte in src/components/visual/motion/reveal.tsx, auf der Benutzer ihr Einsatzgebiet auswählen können.

## IDEA_059: Drag & Drop Foto-Upload für Schlüssel-Identifikation
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/sicherheitstechnik/[slug]/page.tsx
- **Target Component:** src/components/visual/generators/code-fundstelle.tsx
- **Specification:** Erweiterung von src/components/visual/generators/code-fundstelle.tsx um eine Drag & Drop Zone mit sofortiger Bild-Vorschau und HEIC-zu-JPEG Konvertierung im Browser.

## IDEA_060: Progressive Disclosure Formular für komplexe Anfragen
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx
- **Target Component:** src/components/forms/option-card.tsx
- **Specification:** Aufteilen langer Formulare in src/components/forms/option-card.tsx in kleine, übersichtliche Schritte mit Fortschrittsbalken und Animationen.

## IDEA_061: Gamifizierter Sicherheits-Score Rechner
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/tuer-und-schliesstechnik/page.tsx
- **Target Component:** src/components/autoschluessel/key-kinds.tsx
- **Specification:** Ein interaktives Quiz in src/components/autoschluessel/key-kinds.tsx, bei dem Nutzer Punkte für Sicherheitsmaßnahmen sammeln und einen Score erhalten.

## IDEA_062: Live-Chat Integration mit intelligentem Routing
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx
- **Target Component:** src/components/calculator/service-einsatz-rechner.tsx
- **Specification:** Einbettung eines schwebenden Chat-Widgets in src/components/calculator/service-einsatz-rechner.tsx, das bei inaktiven Nutzern proaktiv Hilfe anbietet.

## IDEA_063: Personalisierte Empfehlungs-Engine für Schließzylinder
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/bestellung/[id]/page.tsx
- **Target Component:** src/components/ui/button.tsx
- **Specification:** Basierend auf 3 Fragen in src/components/ui/button.tsx generiert eine Server Action die perfekte Produktempfehlung.

## IDEA_064: Dynamische Preis-Staffelungs-Tabelle
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/gleichschliessende-zylinder/page.tsx
- **Target Component:** src/components/layout/section.tsx
- **Specification:** Anzeige von Mengenrabatten in src/components/layout/section.tsx, die sich bei Anpassung der Stückzahl-Inputs in Echtzeit aktualisieren.

## IDEA_065: Interaktiver Vergleichs-Slider (Elektronisch vs Mechanisch)
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx
- **Target Component:** src/components/autoschluessel/bestaetigung.tsx
- **Specification:** Ein UI-Slider in src/components/autoschluessel/bestaetigung.tsx, der beim Verschieben die Kostenvorteile beider Systeme gegeneinander aufrechnet.

## IDEA_066: Visueller Zylinder-Konfigurator (Längen-Auswahl)
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/elektronische-zutrittsloesungen/page.tsx
- **Target Component:** src/components/visual/bereich-icon.tsx
- **Specification:** Interaktive SVG in src/components/visual/bereich-icon.tsx, bei der Nutzer an Enden ziehen können, um die Zylinderlänge (A/B) einzustellen.

## IDEA_067: Echtzeit-Feedback-Ringe in Formularen
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx
- **Target Component:** src/components/visual/motion/draw-on.tsx
- **Specification:** Grüne/Rote Outline-Ringe um Input-Felder in src/components/visual/motion/draw-on.tsx, die bereits während der Eingabe validiert werden.

## IDEA_068: Kontextbezogene Trust-Badges je nach Auswahl
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schliessanlagen/page.tsx
- **Target Component:** src/components/forms/controls.tsx
- **Specification:** Einblenden spezifischer Zertifizierungs-Logos in src/components/forms/controls.tsx, sobald Nutzer geschäftsrelevante Optionen auswählen.

## IDEA_069: Interaktive Timeline für Service-Ablauf
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/schliessanlagen/konfigurator/page.tsx
- **Target Component:** src/components/ui/accordion.tsx
- **Specification:** Darstellung der Arbeitsschritte in src/components/ui/accordion.tsx als klickbare Timeline mit detaillierten Popovers.

## IDEA_070: Social-Proof Popups (z.B. 'Zuletzt gebucht in...')
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/service-und-termin/terminstatus/page.tsx
- **Target Component:** src/components/forms/photo-upload.tsx
- **Specification:** Dezente Benachrichtigungen in src/components/forms/photo-upload.tsx, die Authentizität und hohe Nachfrage suggerieren.

## IDEA_071: Dynamische Dringlichkeits-Indikatoren bei Notdienst
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/service-und-termin/anfrage/page.tsx
- **Target Component:** src/components/ui/card.tsx
- **Specification:** Visuelle Hervorhebung der Notdienst-Nummer in src/components/ui/card.tsx mit pulsierenden roten Akzenten außerhalb der Geschäftszeiten.

## IDEA_072: Personalisierte Anrede und URL-Parameter Übernahme
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/service-und-termin/page.tsx
- **Target Component:** src/components/layout/site-footer.tsx
- **Specification:** Auslesen von UTM-Parametern in src/components/layout/site-footer.tsx zur Anpassung der Überschriften ('Speziell für Sie in München').

## IDEA_073: Interaktiver Schlüssel-Finder basierend auf Fragen
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/service-und-termin/vor-ort/page.tsx
- **Target Component:** src/components/autoschluessel/preis-anzeige.tsx
- **Specification:** Ein Chatbot-ähnliches Interface in src/components/autoschluessel/preis-anzeige.tsx, das Nutzer zum richtigen Schlüsseltyp navigiert.

## IDEA_074: Erweiterte Filterung für Ratgeber-Artikel
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/service-und-termin/kontakt/page.tsx
- **Target Component:** src/components/vertrauen/nachweise-liste.tsx
- **Specification:** Implementierung von URL-State-basierten Filtern in src/components/vertrauen/nachweise-liste.tsx (React 19 useTransition) für sofortige Artikel-Sortierung.

## IDEA_075: Lokaler Speicher für begonnene Konfigurationen (Local Storage sync)
- **Category:** CONVERSION_AND_TOOLS
- **Target Route:** src/app/(site)/rechtliches/impressum/page.tsx
- **Target Component:** src/components/visual/motion/in-view.tsx
- **Specification:** Speichern der Formulardaten von src/components/visual/motion/in-view.tsx im Local Storage, um Abbrüche bei Reloads zu verhindern, synchronisiert mit React Context.

## IDEA_076: Next.js 16 'use cache' Memoisierung für API-Calls
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/rechtliches/cookie-einstellungen/page.tsx
- **Target Component:** src/components/visual/generators/zutritt-signal.tsx
- **Specification:** Aktivierung der 'use cache' Direktive in src/components/visual/generators/zutritt-signal.tsx (wo anwendbar, unter Beachtung von dynamischen Routen) zur Reduzierung von Latenzen.

## IDEA_077: CSS Subgrid Harmonisierung für Formulare
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/rechtliches/versand-und-zahlung/page.tsx
- **Target Component:** src/components/forms/field.tsx
- **Specification:** Einsatz von grid-template-columns: subgrid in src/components/forms/field.tsx, um Labels und Inputs über verschachtelte Komponenten hinweg exakt auszurichten.

## IDEA_078: Container Queries (@container) für kartenbasierte Layouts
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/rechtliches/widerruf/page.tsx
- **Target Component:** src/components/layout/site-header.tsx
- **Specification:** Austausch von @media durch @container in src/components/layout/site-header.tsx, damit die Komponente sich an den verfügbaren Platz im Grid anpasst.

## IDEA_079: AVIF-Hero-Pipelines mit automatischem Fallback
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/rechtliches/agb/page.tsx
- **Target Component:** src/components/calculator/tuer-absicherung-rechner.tsx
- **Specification:** Konfiguration der Next.js Image-Komponente in src/components/calculator/tuer-absicherung-rechner.tsx zur Bevorzugung von AVIF-Formaten für 20% kleinere Hero-Bilder.

## IDEA_080: Zero-Shift Webfont-Optimierung (font-display: optional)
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/rechtliches/datenschutz/page.tsx
- **Target Component:** src/components/layout/mobile-action-bar.tsx
- **Specification:** Anpassung der next/font Konfiguration in src/components/layout/mobile-action-bar.tsx auf display: 'optional' mit size-adjust zur Vermeidung jeglicher Layout-Shifts.

## IDEA_081: Strikte Typisierung der SearchParams (Promises)
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/artikel/page.tsx
- **Target Component:** src/components/layout/page-header.tsx
- **Specification:** Aktualisierung von src/components/layout/page-header.tsx, sodass 'searchParams' als Promise<{ [key: string]: string | string[] | undefined }> typisiert und explizit mit 'await' aufgelöst wird.

## IDEA_082: Migration von useFormState zu useActionState (React 19)
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/artikel/[slug]/page.tsx
- **Target Component:** src/components/autoschluessel/termin-auswahl.tsx
- **Specification:** Refactoring von src/components/autoschluessel/termin-auswahl.tsx: Ersetzen von ReactDOM useFormState durch React 19 useActionState für sauberes State-Handling.

## IDEA_083: Prefetching-Optimierung für kritische Pfade
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/standorte/page.tsx
- **Target Component:** src/components/schliessanlagen/system-erklaerung.tsx
- **Specification:** Gezieltes Einsetzen von <Link prefetch={true}> in src/components/schliessanlagen/system-erklaerung.tsx für die wichtigsten User-Journeys zur Reduzierung der wahrgenommenen Ladezeit.

## IDEA_084: Eliminierung von ungenutztem CSS über Tailwind Config
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/standorte/[city]/page.tsx
- **Target Component:** src/components/visual/motion/reveal.tsx
- **Specification:** Überprüfung der Tailwind-Klassen in src/components/visual/motion/reveal.tsx und Entfernen nicht existierender oder redundanter Utilities.

## IDEA_085: Streaming SSR für komplexe Konfiguratoren
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/marken/page.tsx
- **Target Component:** src/components/visual/generators/code-fundstelle.tsx
- **Specification:** Einpacken langsamer Datenabfragen in src/components/visual/generators/code-fundstelle.tsx in <Suspense> Boundaries für sofortiges Streaming der App-Shell.

## IDEA_086: Reduzierung der Client-Side JS-Bundle Größe
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx
- **Target Component:** src/components/forms/option-card.tsx
- **Specification:** Verschieben von Logik aus Client-Komponenten in Server-Actions in src/components/forms/option-card.tsx, um das JS-Bundle zu verkleinern.

## IDEA_087: Dynamische Importe (next/dynamic) für schwere UI-Komponenten
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/marken/[make]/page.tsx
- **Target Component:** src/components/autoschluessel/key-kinds.tsx
- **Specification:** Lazy-Loading von Drittanbieter-Scripts oder schweren Diagramm-Bibliotheken in src/components/autoschluessel/key-kinds.tsx via next/dynamic.

## IDEA_088: Optimierung der LCP (Largest Contentful Paint) Bilder
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/funkschluessel/page.tsx
- **Target Component:** src/components/calculator/service-einsatz-rechner.tsx
- **Specification:** Hinzufügen des 'priority' Attributs zum Hero-Bild in src/components/calculator/service-einsatz-rechner.tsx zur Verbesserung der Core Web Vitals.

## IDEA_089: Einführung von React Compiler / Forget
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/programmieren/page.tsx
- **Target Component:** src/components/ui/button.tsx
- **Specification:** Vorbereitung von src/components/ui/button.tsx auf den React Compiler durch Entfernen unnötiger useMemo und useCallback Hooks.

## IDEA_090: Entfernung leerer onClick Handler
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/anfrage/page.tsx
- **Target Component:** src/components/layout/section.tsx
- **Specification:** Aufspüren und Löschen von () => {} Platzhalter-Handlern in src/components/layout/section.tsx, die zu 'Silent Logic Death' führen.

## IDEA_091: Hydration-Mismatch Behebung durch useEffect Guards
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/page.tsx
- **Target Component:** src/components/autoschluessel/bestaetigung.tsx
- **Specification:** Absichern von Fenster-Zugriffen (window.localStorage) in src/components/autoschluessel/bestaetigung.tsx durch serverseitige Fallbacks und useEffect.

## IDEA_092: Ersetzen von 'as any' durch Tuple-Typen
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/kopieren/page.tsx
- **Target Component:** src/components/visual/bereich-icon.tsx
- **Specification:** Behebung von TypeScript-Schwächen in src/components/visual/bereich-icon.tsx durch strikte Typisierung statt unsauberer 'as any' Casts.

## IDEA_093: Strikte Null-Checks in Daten-Adaptern
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/nachmachen/page.tsx
- **Target Component:** src/components/visual/motion/draw-on.tsx
- **Specification:** Implementierung strikter Überprüfungen für optionale Chaining-Rückgaben in src/components/visual/motion/draw-on.tsx zur Vermeidung von Runtime-Errors.

## IDEA_094: Vercel Edge Caching für statische Assets
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/smart-key/page.tsx
- **Target Component:** src/components/forms/controls.tsx
- **Specification:** Konfiguration von Cache-Control Headern in API-Routen, die von src/components/forms/controls.tsx aufgerufen werden.

## IDEA_095: Optimierung der layout.tsx Re-Renders
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx
- **Target Component:** src/components/ui/accordion.tsx
- **Specification:** Refactoring der Prop-Drilling Struktur in src/components/ui/accordion.tsx, um unnötige Re-Renders der gesamten Seite zu vermeiden.

## IDEA_096: Einbau robuster Error Boundaries
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx
- **Target Component:** src/components/forms/photo-upload.tsx
- **Specification:** Hinzufügen spezifischer error.tsx Dateien für den Route-Segment von src/components/forms/photo-upload.tsx zur eleganten Fehlerbehandlung.

## IDEA_097: Zugänglichkeits-Verbesserung: ARIA-Labels für Icons
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(payload)/admin/[[...segments]]/page.tsx
- **Target Component:** src/components/ui/card.tsx
- **Specification:** Auditierung von src/components/ui/card.tsx und Ergänzung fehlender aria-labels und role-Attribute an interaktiven Elementen.

## IDEA_098: Reduzierung der DOM-Tiefe in Listen-Ansichten
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/ratgeber/page.tsx
- **Target Component:** src/components/layout/site-footer.tsx
- **Specification:** Vereinfachung des HTML-Markups in src/components/layout/site-footer.tsx durch Entfernen überflüssiger div-Wrapper (div-soup).

## IDEA_099: Server-Side Validation mit Zod für alle Formulare
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/ratgeber/[slug]/page.tsx
- **Target Component:** src/components/autoschluessel/preis-anzeige.tsx
- **Specification:** Integration von Zod-Schemas zur Validierung aller Eingabedaten in den Server Actions von src/components/autoschluessel/preis-anzeige.tsx.

## IDEA_100: Sicherstellen von AAA-Kontrastverhältnissen in CSS Variables
- **Category:** EXTREME_PERFORMANCE
- **Target Route:** src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx
- **Target Component:** src/components/vertrauen/nachweise-liste.tsx
- **Specification:** Überprüfung und Anpassung der HSL/OKLCH Farbwerte in src/components/vertrauen/nachweise-liste.tsx zur strikten Einhaltung der WCAG AAA Vorgaben.
