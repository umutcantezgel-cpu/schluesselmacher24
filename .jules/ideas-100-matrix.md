## IDEA_001: Kinetische Mikrointeraktion für Haupt-Buttons
Ziel: src/components/ui/button.tsx
Spezifikation: Integration einer gedämpften Federphysik beim Hover (Framer Motion spring) und eines feinen, dem Cursor folgenden Spotlight-Glows zur taktilen Rückmeldung.

## IDEA_002: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
Ziel: src/app/(site)/page.tsx (Feature Cards)
Spezifikation: Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

## IDEA_003: Flüssige SVG-Pfad-Animation für Profilschnitte
Ziel: src/components/visual/generators/profilschnitt.tsx
Spezifikation: Die SVG-Pfade werden durch Scroll-Trigger schrittweise gezeichnet (stroke-dashoffset), um den Fräsprozess visuell und ohne externe Videos erlebbar zu machen.

## IDEA_004: Parallaktisches 3D-Tilt auf Service-Karten
Ziel: src/components/autoschluessel/key-kinds.tsx
Spezifikation: Mouse-Move Tracking mit maximal 5 Grad Neigung und subtilen Schattenverschiebungen zur Erhöhung der Materialität der Schlüsselkarten.

## IDEA_005: Magnetische Cursor-Bindung für primäre CTAs
Ziel: src/components/layout/mobile-action-bar.tsx
Spezifikation: Wenn der Cursor in die Nähe der Buttons kommt, werden diese sanft zum Cursor hingezogen, was die Click-Through-Rate durch haptische Vorfreude steigert.

## IDEA_006: Morphing-Transitions bei Schlüssel-Konfigurationen
Ziel: src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx
Spezifikation: Layout-Morphing mit Framer Motion bei der Auswahl verschiedener Zylindertypen, um harte Umbrüche durch fließende Formwandlung zu ersetzen.

## IDEA_007: Partikelemission bei erfolgreicher Code-Eingabe
Ziel: src/components/visual/interaktiv/code-fundstelle-interaktiv.tsx
Spezifikation: Sobald ein gültiger Code-Typ identifiziert wird, emittiert das Input-Feld winzige oklch-konforme Partikel für 400ms als Bestätigungs-Feedback.

## IDEA_008: Glashomorphe Overlay-Blur-Transitions
Ziel: src/components/ui/alert.tsx
Spezifikation: Ersatz solider Warnmeldungen durch Glassmorphismus (backdrop-filter: blur(12px) mit oklch(0.988 0.002 260 / 0.8)), um den Schweizer Layering-Stil zu betonen.

## IDEA_009: Staggered Fade-Up für Breadcrumbs
Ziel: src/components/layout/breadcrumbs.tsx
Spezifikation: Beim initialen Seitenladen erscheinen die Breadcrumb-Segmente nacheinander mit 50ms Verzögerung und einer weichen y-Translation von 10px.

## IDEA_010: Skew-Scroll-Effekt für Textblöcke
Ziel: src/components/layout/section.tsx
Spezifikation: Während schnellen Scrollens neigen sich die Sections minimal (max 2 Grad), um die Geschwindigkeit visuell zu übertragen, stabilisieren sich bei Stillstand sofort.

## IDEA_011: Interaktive Hover-Zustände auf SVG-Icons
Ziel: src/components/visual/icons/icon-base.tsx
Spezifikation: Path-Morphing innerhalb der SVG-Icons bei Hover, z.B. das Schloss-Icon schließt/öffnet sich sanft, um semantische Reaktivität zu bieten.

## IDEA_012: Haptisches Scroll-Snapping für Produktgalerien
Ziel: src/components/autoschluessel/schluesselarten-reihe.tsx
Spezifikation: CSS Scroll-Snap (mandatory) kombiniert mit einer Scale-Transformation des aktiven Elements im Viewport (1.05x), um Fokus zu lenken.

## IDEA_013: Ripple-Effekt mit OKLCH-Gradients
Ziel: src/components/ui/button.tsx
Spezifikation: Bei Klick auf sekundäre Buttons entsteht ein sanfter Ripple-Effekt, der transparente, helle OKLCH-Verläufe nutzt statt harscher weißer Kreise.

## IDEA_014: Schwebende Label-Transitions in Formularen
Ziel: src/components/forms/field.tsx
Spezifikation: Floating Labels, die sich mit einer Federphysik nach oben links bewegen und verkleinern, wenn das Eingabefeld fokussiert wird.

## IDEA_015: Reveal-Animation für Akkordeons mit Höhen-Messung
Ziel: src/components/ui/accordion.tsx
Spezifikation: Statt hartem display:none nutzen wir ResizeObserver und animate-height für eine butterweiche Expansion der Akkordeon-Inhalte.

## IDEA_016: Dynamische Strichstärken (Variable Fonts) nach Scroll-Tiefe
Ziel: src/components/layout/page-header.tsx
Spezifikation: Die font-variation-settings des Main-Headings (weight) verringern sich sanft beim Scrollen, um mehr Platz für den Content zu machen.

## IDEA_017: Kinetische Typografie-Hover auf Links
Ziel: src/components/recht/rechtstext.tsx
Spezifikation: Inline-Links erhalten einen underline, der beim Hover von rechts nach links mit transform-origin animiert wird.

## IDEA_018: Smooth-Scroll Progress-Indikator
Ziel: src/components/layout/site-header.tsx
Spezifikation: Eine 2px hohe Ladeleiste am oberen Rand (oklch-Akzentfarbe), die den Lese-Fortschritt auf langen Ratgeber-Artikeln visualisiert.

## IDEA_019: Drag-to-Compare Vorher-Nachher Slider
Ziel: src/components/visual/interaktiv/live-schluessel.tsx
Spezifikation: Ein interaktiver Slider, um Rohling und gefrästen Schlüssel durch Ziehen (mit Touch-Support) direkt zu vergleichen.

## IDEA_020: Pulsierende Status-Indikatoren für Verfügbarkeit
Ziel: src/components/autoschluessel/termin-auswahl.tsx
Spezifikation: Grüne Statuspunkte (oklch(0.85 0.15 150)) für freie Termine pulsieren sanft (opacity 0.6 zu 1), um Aufmerksamkeit zu lenken.

## IDEA_021: Micro-Interaktionen auf Glyphen
Ziel: src/components/visual/glyphen/haken.tsx
Spezifikation: Der Haken zeichnet sich selbst in 200ms nach dem Erscheinen, anstatt sofort statisch sichtbar zu sein.

## IDEA_022: Konfetti-Explosion bei Formularabschluss
Ziel: src/components/autoschluessel/bestaetigung.tsx
Spezifikation: Subtile, monochrome (Schweizer Stil) Partikel-Animation als Reward-System nach erfolgreicher Buchung.

## IDEA_023: Skeleton-Loading mit Shimmer-Sweep
Ziel: src/components/ui/image-placeholder.tsx
Spezifikation: Statt statischem Grau wird ein hochperformanter CSS-Linear-Gradient-Sweep (60fps) für Ladezustände implementiert.

## IDEA_024: 3D-Rotierende Schlüssel-Visualisierung
Ziel: src/components/visual/schluesselart-zeichnung.tsx
Spezifikation: Bei Drag/Swipe kann die schematische Zeichnung leicht auf der X/Y-Achse rotiert werden (CSS 3D Transform).

## IDEA_025: Hover-Zoom auf Standort-Karten
Ziel: src/components/visual/einsatzradius.tsx
Spezifikation: Das Kartenbild skaliert bei Hover um 1.03x innerhalb eines overflow-hidden Containers, um Interaktivität zu signalisieren.

## IDEA_026: Themenspezifische FAQ-Schema Integration
Ziel: src/app/(site)/autoschluessel/nachmachen/page.tsx
Spezifikation: Ausbau der Seite um 800 Wörter mit tiefgehenden technischen Erklärungen zum Klon-Vorgang, versehen mit validem FAQPage JSON-LD Schema.

## IDEA_027: Vergleichsmatrix Original vs. Nachbau
Ziel: src/app/(site)/autoschluessel/kopieren/page.tsx
Spezifikation: Hinzufügen einer detaillierten HTML-Tabelle (mit Subgrid-Ausrichtung), die Lebensdauer, Reichweite und Materialqualität von Schlüsseln vergleicht (> 900 Wörter gesamt).

## IDEA_028: Historie und Technik der Wegfahrsperre
Ziel: src/app/(site)/autoschluessel/programmieren/page.tsx
Spezifikation: Ein tiefgehender redaktioneller Block, der die Evolution von Transpondern (Crypto 48, etc.) erklärt, um thematische Autorität bei Suchmaschinen aufzubauen.

## IDEA_029: Leitfaden: Schlüsselverlust im Ausland
Ziel: src/app/(site)/ratgeber/page.tsx
Spezifikation: Ein neuer Abschnitt mit Checklisten, rechtlichen Schritten und Notfallkontakten, um den Content auf über 1000 Wörter zu bringen.

## IDEA_030: Glossar der Schließtechnik
Ziel: src/app/(site)/sicherheitstechnik/page.tsx
Spezifikation: Fachbegriffe wie 'Stiftzuhaltung', 'Bohrmuldenprofil' und 'Zylinderkern' werden in einem iterativen Definitions-Listen-Format (DL/DT/DD) ausführlich erklärt.

## IDEA_031: Case-Study: Einbruchschutz-Nachrüstung
Ziel: src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx
Spezifikation: Detaillierte Fallstudie (850 Wörter) über die Schwachstellenanalyse eines Altbaus und die konkreten Maßnahmen zur KFW-konformen Absicherung.

## IDEA_032: Schritt-für-Schritt Anleitung Zylinder-Messen
Ziel: src/app/(site)/schluessel-nach-code/page.tsx
Spezifikation: Ausführlicher Text (750 Wörter), der genau beschreibt, wie man das Außen- und Innenmaß am Stulp misst, inklusive Fehlervermeidung.

## IDEA_033: Die Anatomie eines Smart-Keys
Ziel: src/app/(site)/autoschluessel/smart-key/page.tsx
Spezifikation: Dekonstruktion der Komponenten (Batterie, Platine, Notschlüssel, RFID-Spule) in einem langen Textabschnitt mit über 800 Wörtern.

## IDEA_034: Mythen vs. Fakten zur Fahrzeugöffnung
Ziel: src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx
Spezifikation: Aufklärung über beschädigungsfreie Methoden (Lishi-Picks, Luftkissen) im Kontrast zu Hollywood-Mythen, um Vertrauen zu schaffen (>900 Wörter).

## IDEA_035: Leitfaden zur Sicherungskarte
Ziel: src/app/(site)/schliessanlagen/page.tsx
Spezifikation: Detaillierte juristische und technische Aufklärung (800 Wörter) über Patentrechte, Kopierschutz und die Rolle der Sicherungskarte bei Schließanlagen.

## IDEA_036: Vor- und Nachteile von Gleichschließungen
Ziel: src/app/(site)/gleichschliessende-zylinder/page.tsx
Spezifikation: Abwägung von Komfort vs. Sicherheitsrisiken bei Schlüsselverlust in einem strukturierten, tiefgehenden Artikel.

## IDEA_037: Die Technik hinter Keyless-Go-Diebstählen
Ziel: src/app/(site)/autoschluessel/funkschluessel/page.tsx
Spezifikation: Erklärung von Relay-Attacks und konkreten Schutzmaßnahmen (Schlüsseltresore, Deaktivierung), Ausbau des Textes auf 950 Wörter.

## IDEA_038: Ratgeber zur Auswahl elektronischer Zutrittslösungen
Ziel: src/app/(site)/elektronische-zutrittsloesungen/page.tsx
Spezifikation: Tiefe Analyse von RFID vs. Bluetooth vs. Biometrie, Einsatzgebiete und Batterielaufzeiten zur Maximierung der Fachkompetenz.

## IDEA_039: Prozess der Schlüsselrekonstruktion nach Code
Ziel: src/app/(site)/schluessel-nach-code/[slug]/page.tsx
Spezifikation: Detaillierte Erklärung (800 Wörter), wie aus einer Code-Nummer CNC-Fräsdaten generiert werden, ohne das Original zu benötigen.

## IDEA_040: Wartung und Pflege von Zylinderschlössern
Ziel: src/app/(site)/tuer-und-schliesstechnik/page.tsx
Spezifikation: Tipps zu Graphitpulver vs. Öl, Winter-Problemen und Verschleißerkennung, um die Seite mit hilfreichem Evergreen-Content zu füllen.

## IDEA_041: Warum Autoschlüssel teuer sind (Kostentransparenz)
Ziel: src/app/(site)/autoschluessel/page.tsx
Spezifikation: Detaillierte Aufschlüsselung (850 Wörter) der Kostenpunkte: Rohling, Lizenzgebühren, Software-Tokens und Arbeitszeit.

## IDEA_042: Die Rolle des Fräsens bei Autoschlüsseln
Ziel: src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx
Spezifikation: Technische Unterschiede zwischen Bahnenfräsung und Zackenprofil, Toleranzen in der CNC-Bearbeitung, erweitert auf über 800 Wörter.

## IDEA_043: Lokale Relevanz und Anfahrtszeiten
Ziel: src/app/(site)/standorte/[city]/page.tsx
Spezifikation: Spezifische lokale Besonderheiten, typische Einsatz-Szenarien und Architektur-Hinweise (z.B. Altbau-Türen) in der jeweiligen Stadt (800+ Wörter pro Standort).

## IDEA_044: B2B: Flottenmanagement und Schlüsselverwaltung
Ziel: src/app/(site)/partner-werden/page.tsx
Spezifikation: Spezifische Vorteile für Autohäuser, Autovermietungen und Flottenbetreiber, inklusive SLA-Erklärungen und Mengenrabatt-Strukturen.

## IDEA_045: Sicherer Postversand von Schlüsseln
Ziel: src/app/(site)/schluessel-einschicken/page.tsx
Spezifikation: Anleitung zur neutralen Verpackung, Versicherung von Sendungen und Track&Trace, um Bedenken der Nutzer abzubauen (750 Wörter).

## IDEA_046: Ratgeber: Tresoröffnungen und Diskretion
Ziel: src/app/(site)/service-und-termin/vor-ort/page.tsx
Spezifikation: Erweiterung der Vor-Ort-Dienstleistungen um das Thema Diskretion bei speziellen Öffnungen (Tresore, Behörden) mit Fokus auf Vertrauensbildung.

## IDEA_047: Unterschied Original- vs. Aftermarket-Gehäuse
Ziel: src/app/(site)/autoschluessel/marken/[make]/page.tsx
Spezifikation: Erläuterung der Qualitätsstufen bei Ersatzteilen für spezifische Marken, um die Langlebigkeit der angebotenen Premium-Lösungen zu betonen.

## IDEA_048: Rechte bei Verlust von Mietwagen-Schlüsseln
Ziel: src/app/(site)/rechtliches/agb/page.tsx
Spezifikation: Ein informativer Textabschnitt außerhalb der reinen Rechtstexte, der die Haftungsfrage bei Mietobjekten klärt, als Traffic-Magnet.

## IDEA_049: Umwelt und Recycling von Alt-Schlüsseln
Ziel: src/app/(site)/page.tsx
Spezifikation: Ein neuer Content-Block auf der Startseite über fachgerechte Entsorgung von Lithium-Batterien und Platinen aus kaputten Schlüsseln.

## IDEA_050: Interview/Portrait der Experten
Ziel: src/app/(site)/service-und-termin/kontakt/page.tsx
Spezifikation: Hintergrundgeschichten der Techniker, Zertifizierungen und Schulungen, um Human-Touch und Vertrauen auf 800+ Wörtern zu etablieren.

## IDEA_051: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
Ziel: src/components/calculator/service-einsatz-rechner.tsx
Spezifikation: Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid zur Einbindung in bestehende Service-Seiten.

## IDEA_052: Interaktive Formular-Validierung mit Zod
Ziel: src/components/autoschluessel/termin-auswahl.tsx
Spezifikation: Echtzeit-Feedback bei der Eingabe (z.B. Format der FIN/VIN), das Fehler sofort freundlich (oklch) hervorhebt und Korrekturen vorschlägt, ohne Neuladen.

## IDEA_053: Gamifizierter Schlüssel-Identifikator
Ziel: src/components/autoschluessel/schluesselarten-reihe.tsx
Spezifikation: Ein 3-Schritt-Quiz (Tasten? Bart sichtbar? Marke?), das den Nutzer zum exakten Service führt, via Server Actions verarbeitet.

## IDEA_054: Dynamic Trust Badges
Ziel: src/components/vertrauen/nachweise-liste.tsx
Spezifikation: Die Siegel (z.B. 'TÜV', 'Meisterbetrieb') erhalten Tooltips (src/components/ui/info-tip.tsx), die bei Hover den exakten Prüfungsinhalt laden.

## IDEA_055: Optimistische Warenkorb-Updates
Ziel: src/app/(site)/warenkorb/page.tsx
Spezifikation: Nutzung von React 19 useOptimistic für das Ändern der Anzahl oder Löschen von Artikeln, um Latenzen bei Server-Aufrufen völlig zu verbergen.

## IDEA_056: Intelligenter Live-Suchfilter
Ziel: src/app/(site)/autoschluessel/marken/page.tsx
Spezifikation: Suchfeld mit sofortiger Filterung der Fahrzeugmarken (Client-Side State mit React 19 useActionState für Fallbacks), ohne Tastendruck-Verzögerung.

## IDEA_057: Social-Proof Ticker für letzte Buchungen
Ziel: src/components/layout/mobile-action-bar.tsx
Spezifikation: Ein winziger, dezenter Text rotierend ('Gerade in Berlin gebucht: VW Golf Schlüssel'), gespeist aus einem statischen Array, um Dringlichkeit zu signalisieren.

## IDEA_058: Foto-Upload mit Client-Side Vorschau & Cropping
Ziel: src/components/forms/photo-upload.tsx
Spezifikation: Vor dem Upload zum Server wird das Bild im Browser skaliert, zentriert angezeigt und auf Dateigröße geprüft, für extrem schnelle UX.

## IDEA_059: Progressiver Formular-Wizard für komplexe Anfragen
Ziel: src/app/(site)/autoschluessel/anfrage/page.tsx
Spezifikation: Zerlegung des langen Formulars in 4 mundgerechte Schritte (Fahrzeug, Schlüsseltyp, Schaden, Kontakt) mit animiertem Fortschrittsbalken.

## IDEA_060: Personalisierte Ansprache nach Markenwahl
Ziel: src/components/autoschluessel/vehicle-facts.tsx
Spezifikation: Ändert die Headline dynamisch ('Ihr BMW-Experte' statt 'Ihr Auto-Experte'), basierend auf URL-Parametern oder vorheriger Auswahl.

## IDEA_061: Interaktiver Schließanlagen-Konfigurator
Ziel: src/app/(site)/schliessanlagen/konfigurator/page.tsx
Spezifikation: Ein Drag-and-Drop Tool (z.B. via dnd-kit), um virtuell Türen zu Gruppen zuzuordnen und die Schließhierarchie spielerisch aufzubauen.

## IDEA_062: Sticky Preis-Zusammenfassung
Ziel: src/components/autoschluessel/preis-anzeige.tsx
Spezifikation: Auf langen Produktseiten bleibt der aktuelle Schätzpreis als flaches Panel am unteren oder rechten Rand kleben (position: sticky).

## IDEA_063: Conditional Form Fields basierend auf Vorwahl
Ziel: src/components/forms/controls.tsx
Spezifikation: Wenn der User 'Funkschlüssel' wählt, erscheinen automatisch Felder für 'Keyless Go', wenn 'Starrer Schlüssel' gewählt wird, verschwinden diese.

## IDEA_064: Visualisierung des Ersparnispotenzials
Ziel: src/components/autoschluessel/service-article.tsx
Spezifikation: Ein Balkendiagramm ('Unsere Kosten vs. Vertragswerkstatt'), das den Preisvorteil visuell und plakativ darstellt (CSS Grid Bars).

## IDEA_065: Ein-Klick Standort-Erkennung
Ziel: src/app/(site)/service-und-termin/vor-ort/page.tsx
Spezifikation: Ein Button 'Meinen Standort nutzen' füllt die PLZ via Geolocation-API automatisch aus und berechnet die Anfahrtskosten.

## IDEA_066: Exit-Intent Modal für zögernde Nutzer
Ziel: src/components/layout/fehler-ansicht.tsx (als Basis für Modal)
Spezifikation: Bevor der Nutzer bei unvollständigem Formular den Tab schließt, erscheint ein dezentes Overlay: 'Brauchen Sie Hilfe bei der Identifikation?'.

## IDEA_067: Interaktives Zylinder-Maßband
Ziel: src/components/visual/interaktiv/zylinder-mass-live.tsx
Spezifikation: Ein virtuelles Lineal, auf dem Nutzer die Millimeter-Werte (A und B) per Slider einstellen, worauf sich die Zylinder-Grafik proportional anpasst.

## IDEA_068: Fallback-Option bei unsicherem Modell
Ziel: src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx
Spezifikation: Ein prominenter Button 'Ich bin mir beim Baujahr/Modell unsicher', der direkt zu einem Foto-Upload-Formular springt.

## IDEA_069: Rechner für mechanischen Einbruchschutz
Ziel: src/components/calculator/tuer-absicherung-rechner.tsx
Spezifikation: Ein Tool, das Fensteranzahl, Etage und Türtypen abfragt und ein KFW-Förderfähiges Budget-Szenario errechnet (Server Actions).

## IDEA_070: Countdown für Express-Termine
Ziel: src/app/(site)/service-und-termin/page.tsx
Spezifikation: 'Buchen Sie innerhalb von [14:32], um noch heute dranzukommen' – errechnet aus den realen Öffnungs- und Vorlaufzeiten.

## IDEA_071: Mikro-Copy-Optimierung bei CTAs
Ziel: src/components/layout/summary-list.tsx
Spezifikation: Statt 'Senden' spezifische Handlung ausgeben: 'Preisschätzung jetzt anfordern' zur Erhöhung der Klarheit.

## IDEA_072: Nahtlose Telefonnummer-Konvertierung (Click-to-Call)
Ziel: src/components/visual/glyphen/telefon.tsx
Spezifikation: Auf Mobile wird der gesamte Header-Bereich mit der Nummer zu einem fetten, leicht tappbaren Action-Area mit Hover-State.

## IDEA_073: Interaktive Schadens-Analyse (Bild-basiert)
Ziel: src/app/(site)/autoschluessel/kopieren/page.tsx
Spezifikation: Nutzer klicken auf ein Schaubild eines Schlüssels (Tasten kaputt, Bart abgebrochen, Gehäuse rissig), um das Formular vorzubefüllen.

## IDEA_074: Dynamische FAQ nach Fahrzeugmarke
Ziel: src/app/(site)/autoschluessel/marken/[make]/page.tsx
Spezifikation: Ein Server Component lädt markenspezifische FAQs (z.B. 'Hat mein VW Golf 4 eine Wegfahrsperre?'), um Relevanz extrem zu steigert.

## IDEA_075: Vertrauens-Injektion bei der Bezahlung
Ziel: src/components/vertrauen/zahlarten-zeile.tsx
Spezifikation: Direkt neben dem Total-Preis im Kassenbereich werden SSL-Lock-Icon und 'Käuferschutz'-Badges platziert.

## IDEA_076: Next.js 'use cache' für Preislisten
Ziel: src/components/autoschluessel/preis-anzeige.tsx
Spezifikation: Nutzung der neuen Next.js 16 caching-Direktiven für zeitaufwändige Preis-Berechnungen, um TTI drastisch zu senken.

## IDEA_077: CSS Subgrid Harmonisierung für Produktkarten
Ziel: src/components/autoschluessel/schluesselarten-reihe.tsx
Spezifikation: Einsatz von grid-template-rows: subgrid, damit Titel, Bilder und Buttons über alle Karten hinweg exakt auf einer Linie bleiben, unabhängig vom Textumfang.

## IDEA_078: Container Queries für Formular-Layouts
Ziel: src/components/forms/formular-schutz.tsx
Spezifikation: Ablösung von Media-Queries durch @container, sodass Formularfelder sich adaptiv umbrechen, egal in welcher Sidebar oder Section sie platziert sind.

## IDEA_079: AVIF-Hero-Pipeline
Ziel: src/components/ui/bild-flaeche.tsx
Spezifikation: Konsequentes Forcieren des AVIF-Formats via next/image für alle Hero-Bilder, kombiniert mit fetchPriority='high', zur Optimierung des LCP.

## IDEA_080: Zero-Shift Webfont-Optimierung
Ziel: src/app/layout.tsx (bzw. globale Font-Einbindung, indirekt wirkend auf alle)
Spezifikation: Nutzung von next/font/local mit adjustFontFallback, um Cumulative Layout Shift (CLS) durch verzögertes Laden der Schriftarten auf 0 zu reduzieren.

## IDEA_081: Strict TypeScript Narrowing für 'any'
Ziel: src/components/visual/registry.tsx
Spezifikation: Suche nach 'any' oder 'as any', Ersetzung durch 'unknown' und Implementierung von Type-Guards (z.B. isGlyphType()), um Runtime-Fehler zu vermeiden.

## IDEA_082: Radikale Reduzierung der Client-Components
Ziel: src/components/layout/site-footer.tsx
Spezifikation: Entfernen unnötiger 'use client' Direktiven aus dem Footer und statischen Bereichen, um das JavaScript-Bundle zu verkleinern.

## IDEA_083: Vorladen von hover-getriggerten Routen
Ziel: src/components/layout/site-header.tsx
Spezifikation: Next.js Link-Prefetching für das Dropdown-Menü so konfigurieren, dass Hauptkategorien sofort in den Cache geladen werden, wenn der Nutzer darüber hovert.

## IDEA_084: Dynamischer Import für schwere Charts/Grafiken
Ziel: src/components/visual/interaktiv/schliessplan-interaktiv.tsx
Spezifikation: Nutzung von next/dynamic (SSR false), um die interaktive Matrix erst zu laden, wenn der Nutzer in den entsprechenden Bereich scrollt.

## IDEA_085: Eliminierung toter Event-Handler
Ziel: src/components/ui/button.tsx
Spezifikation: Audit auf onClick={undefined} oder leere Arrow-Functions und saubere Typisierung von optionalen Callbacks, um Memory Leaks zu verhindern.

## IDEA_086: Optimierung der SVG-DOM-Knoten
Ziel: src/components/visual/generators/schliessplan.tsx
Spezifikation: Reduzierung der Komplexität von generierten SVG-Pfaden (Zusammenfassen von Gruppen, Entfernen versteckter Layer), um Rendering-Zeit zu halbieren.

## IDEA_087: Await params / searchParams in Page-Components
Ziel: src/app/(site)/autoschluessel/marken/[make]/page.tsx
Spezifikation: Umbau nach Next.js 15/16 Vorgaben, bei denen params und searchParams asynchron sind und mit 'await' aufgelöst werden müssen.

## IDEA_088: Server-Side Form-Status-Handling
Ziel: src/components/forms/controls.tsx
Spezifikation: Einsatz von useFormStatus aus react-dom, um Lade-Indikatoren in Buttons nativ zu steuern, ohne manuellen useState-Boilerplate.

## IDEA_089: Memoization komplexer Berechnungen (React 19)
Ziel: src/components/calculator/rechner-bausteine.tsx
Spezifikation: Nutzung des neuen React Compilers (bzw. useMemo), um die Neuberechnung von Rabatt-Stufen bei jedem Tastendruck zu cachen.

## IDEA_090: Strikte OKLCH-Farb-Variablen im Tailwind-Config
Ziel: src/components/visual/profillinie.tsx
Spezifikation: Hardcoded Hex-Werte aus der Komponente entfernen und durch Tailwind-Utility-Classes ersetzen, die direkt auf die OKLCH-Tokens der Config verweisen.

## IDEA_091: Behebung von Hydration-Mismatch bei Zeitstempeln
Ziel: src/components/recht/eigentext.tsx
Spezifikation: Sicherstellen, dass das aktuelle Datum (z.B. für Copyright) entweder nur auf dem Server (als statischer String) oder Client-only gerendert wird.

## IDEA_092: Globale CSS-Variablen für Layout-Shifts (Header-Höhe)
Ziel: src/components/layout/page-header.tsx
Spezifikation: Die Höhe der Sticky-Navigation als CSS-Variable deklarieren, damit Inhaltsbereiche mit scroll-padding-top exakt den Anchor-Links folgen.

## IDEA_093: Vermeidung von Layout-Löchern bei leeren Arrays
Ziel: src/components/vertrauen/nachweise-liste.tsx
Spezifikation: Bedingtes Rendering (items.length > 0) einfügen, sodass keine leeren Ul-Tags oder Rahmen-Container generiert werden, wenn keine Nachweise vorliegen.

## IDEA_094: Absicherung der Schema.org Daten
Ziel: src/components/seo/json-ld.tsx
Spezifikation: Nutzung des 'schema-dts' Pakets mit 'satisfies Graph', um sicherzustellen, dass die generierten strukturierten Daten valide sind.

## IDEA_095: Effizientes Error-Boundary Handling
Ziel: src/components/layout/fehler-ansicht.tsx
Spezifikation: Spezifische error.tsx Dateien für Teilrouten (z.B. /autoschluessel/), die nur den betroffenen Bereich anstatt der ganzen Seite crashen lassen.

## IDEA_096: Turbopack-Kompatibilität sicherstellen
Ziel: src/components/flow/flow-shell.tsx
Spezifikation: Überprüfen und Ersetzen von Plugins oder Imports, die inkompatibel mit Next.js Turbopack sein könnten, um lokale Build-Zeiten zu minimieren.

## IDEA_097: Entfernung von ungenutztem CSS/Tailwind-Klassen
Ziel: src/components/ui/card.tsx
Spezifikation: Bereinigung der Komponente von redundanten Klassen (z.B. gleichzeitiges 'p-4' und 'px-6'), um das generierte Stylesheet zu optimieren.

## IDEA_098: Server Actions Fehler-Propagierung
Ziel: src/components/forms/photo-upload.tsx
Spezifikation: Standardisiertes Rückgabeformat für Server Actions { success: boolean, error?: string }, das vom Client-Formular sicher verarbeitet werden kann.

## IDEA_099: Visuell versteckte Labels für Screenreader
Ziel: src/components/forms/field.tsx
Spezifikation: Statt fehlender Labels bei Such-Inputs wird sr-only (Screenreader-only) verwendet, um Barrierefreiheit zu 100% zu gewährleisten (Lighthouse Score).

## IDEA_100: Preconnect zu Drittanbieter-Domains
Ziel: src/components/statistik/google-analytics.tsx
Spezifikation: Einrichten von <link rel='preconnect'> Headern für notwendige Analytics-Scripts, um den DNS-Lookup und TLS-Handshake vorzuziehen.
