# 100-Ideen-Matrix

## KATEGORIE A: AWWWARDS-KINETIK & TAKTILE INTERAKTION (IDEEN 1 BIS 25)
**IDEA_001**: Integriere subtile Scroll-Velocity-Effekte auf den Feature-Karten, sodass diese bei schnellem Scrollen leicht kippen und verzögert in ihre Ursprungsposition zurückfedern. Zielkomponente: `components/ui/card.tsx` auf Route `app/page.tsx`.

**IDEA_002**: Ersetze den statischen Preis-Block durch eine fluide Zähler-Animation, die von 0 auf den finalen Preis hochzählt, unterstützt von einer sanften OKLCH-Glimm-Umrandung. Zielkomponente: `components/autoschluessel/preis-anzeige.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_003**: Implementiere eine physikalisch korrekte Federdämpfung (spring physics) beim Öffnen der Sicherheits-FAQs, um ein hochwertiges, taktiles Gefühl zu vermitteln. Zielkomponente: `components/ui/accordion.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_004**: Füge interaktive Hover-Glimm-Effekte (Glow-Follow-Cursor) zu den Bereichs-Icons hinzu, die den Mauszeiger sanft illuminieren. Zielkomponente: `components/visual/bereich-icon.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_005**: Veredle die Formulareingabefelder mit einer mikro-haptischen SVG-Draw-Animation für den Validierungszustand (grüner Haken zeichnet sich live). Zielkomponente: `components/forms/controls.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_006**: Verwende Scroll-getriebene Parallax-Ebenen für die visuelle Darstellung des Code-Finders, um räumliche Tiefe ohne Layout-Shifts zu erzeugen. Zielkomponente: `components/visual/generators/code-fundstelle.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_007**: Rüste alle Call-to-Action-Buttons mit einem fluiden Magnetic-Hover-Effekt aus, der den Button leicht in Richtung des Cursors zieht. Zielkomponente: `components/ui/button.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_008**: Führe sanfte Lottie-Morph-Animationen für Bilder ein, die von einer Silhouette zum echten Foto überblenden, sobald sie im Viewport erscheinen. Zielkomponente: `components/ui/image-placeholder.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_009**: Integriere interaktive Schieberegler mit elastischem 'Snap-to-Grid'-Feedback für eine haptisch wirkende Konfiguration. Zielkomponente: `components/calculator/service-einsatz-rechner.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_010**: Lasse Zutrittslösungs-Elemente mit einer kaskadierenden Reveal-Animation einfliegen, die einem goldenen Schnitt-Timing (Staggering) folgt. Zielkomponente: `components/visual/motion/reveal.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_011**: Entwickle einen adaptiven Glassmorphismus-Header, dessen Transparenzgrad und OKLCH-Schatten sich dynamisch der Scroll-Geschwindigkeit anpassen. Zielkomponente: `components/layout/site-header.tsx` auf Route `app/page.tsx`.

**IDEA_012**: Nutze CSS Scroll Snap Points für eine rastergenaue Präsentation der Autoschlüssel-Kategorien, begleitet von sanftem Ausblenden inaktiver Sektionen. Zielkomponente: `components/layout/section.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_013**: Wende maskierte Reveal-Effekte auf Texte an, bei denen Zeilen von unten wie durch einen Schlitz nach oben ins Bild gleiten. Zielkomponente: `components/visual/motion/in-view.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_014**: Gestalte den Schließplan als interaktives SVG-Canvas, bei dem Verbindungen dynamisch aufleuchten, wenn Benutzer mit der Maus über Berechtigungen fahren. Zielkomponente: `components/visual/generators/schliessplan.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_015**: Ersetze statische Badges durch Liquid-Pill-Elemente, die sich organisch verformen, wenn sie in den aktiven Zustand wechseln. Zielkomponente: `components/ui/badge.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_016**: Ergänze die Foto-Upload-Komponente um eine physikalische Drop-Zone, die sich bei Drag-and-Drop wölbt und visuelles Echo aussendet. Zielkomponente: `components/forms/photo-upload.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_017**: Sorge dafür, dass Breadcrumbs beim Scrollen nach oben fließend in eine Sticky-Subnavigation morphen. Zielkomponente: `components/layout/breadcrumbs.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_018**: Rüste Tooltips mit mikroskopischen Bounce-Out-Animationen aus, um technische Details spielerisch, aber professionell einzublenden. Zielkomponente: `components/ui/info-tip.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_019**: Gestalte Optionskarten so, dass sie bei Selektion eine sanfte Ripple-Welle auf der Oberfläche abspielen (via SVG). Zielkomponente: `components/forms/option-card.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_020**: Visualisiere elektronische Signale mit partikelbasierten Animationen, die vom Smartphone-Icon zum Zylinder-Icon schweben. Zielkomponente: `components/visual/generators/zutritt-signal.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_021**: Animiere Warnhinweise mit einer dezenten horizontalen Shake-Bewegung (Fehlermeldung) und anschließender fließender Höhenanpassung. Zielkomponente: `components/ui/alert.tsx` auf Route `app/page.tsx`.

**IDEA_022**: Biete eine 3D-ähnliche, interaktive Rotation des Schlüssel-SVGs an, gebunden an die Maus-X/Y-Achse für einen Hologramm-Effekt. Zielkomponente: `components/visual/generators/schluessel.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_023**: Verpasse dem Footer eine Reveal-Animation, bei der er beim Erreichen des Seitenendes aus dem Hintergrund emporsteigt (Z-Index Stacking). Zielkomponente: `components/layout/site-footer.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_024**: Lasse Zusammenfassungs-Einträge bei Hinzufügen einer Option mit einer springenden Einfüge-Animation in der Liste erscheinen. Zielkomponente: `components/layout/summary-list.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_025**: Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex. Überführung der Feature-Karten in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten, gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts. Zielkomponente: `components/ui/card.tsx` auf Route `app/page.tsx`.

## KATEGORIE B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG (IDEEN 26 BIS 50)
**IDEA_026**: Füge detaillierte Fließtexte über den genauen Service-Ablauf hinzu, um die Seite auf über 850 Wörter und semantische Autorität auszubauen. Zielkomponente: `components/layout/section.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_027**: Erweitere die Routeninhalte um eine tiefgehende Experten-FAQ-Sektion über Einbruchhemmung nach DIN-Normen (über 1000 Wörter Gesamtlänge). Zielkomponente: `components/layout/section.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_028**: Ergänze eine technische Vergleichsmatrix zwischen Funkschlüsseln und Smart Keys inklusive Vor- und Nachteilen für maximale SEO-Relevanz. Zielkomponente: `components/layout/section.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_029**: Integriere historische Kontext-Absätze zur Evolution mechanischer Schließanlagen zu mechatronischen Systemen für semantische Tiefe. Zielkomponente: `components/layout/section.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_030**: Füge detaillierte Anleitungen zum Auffinden von Schlüsselcodes auf Sicherheitskarten und Originalschlüsseln hinzu (Schritt-für-Schritt Text). Zielkomponente: `components/layout/section.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_031**: Baue die Startseite inhaltlich aus durch strukturierte Erklärungen der Kernkompetenzen (Zutritt, Mechanik, KFZ) zur Stärkung des Themen-Clusters. Zielkomponente: `components/layout/section.tsx` auf Route `app/page.tsx`.

**IDEA_032**: Ergänze ausführliche Autoren-Bios und redaktionelle Leitlinien, um E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) zu stärken. Zielkomponente: `components/layout/section.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_033**: Integriere ein Glossar technischer Begriffe (z.B. Profilzylinder, Einsteckschloss, Rosette) direkt als Definitionsliste im Content-Bereich. Zielkomponente: `components/layout/section.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_034**: Füge Use-Case-Szenarien für Familienhäuser vs. Mehrfamilienhäuser in Textform hinzu, um die semantische Informationsdichte drastisch zu erhöhen. Zielkomponente: `components/layout/section.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_035**: Erweitere den Inhalt um eine Abhandlung über RFID, NFC und Bluetooth-Standards in der Zutrittstechnik (zusätzlich 600 Wörter). Zielkomponente: `components/layout/section.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_036**: Füge ausführliche Informationen zur Wegfahrsperren-Technologie und deren Anlern-Prozesse bei verschiedenen Automarken hinzu. Zielkomponente: `components/layout/section.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_037**: Implementiere ein Text-Modul über polizeiliche Empfehlungen zum mechanischen Einbruchschutz (K-EINBRUCH). Zielkomponente: `components/layout/section.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_038**: Beschreibe die mathematische Struktur von General-Hauptschlüssel-Anlagen (GHS) im Detail in einem neuen Inhaltsblock. Zielkomponente: `components/layout/section.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_039**: Ergänze Fallstudien von erfolgreichen Notöffnungen und komplexen Montage-Einsätzen zur Vertrauensbildung und Content-Anreicherung. Zielkomponente: `components/layout/section.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_040**: Erkläre den kryptografischen Hintergrund von indirekten Codes und wie Hersteller die Schlüsselprofile schützen. Zielkomponente: `components/layout/section.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_041**: Füge ein detailliertes Unternehmensmanifest und eine Chronik der Handwerks-Erfahrung ein, um die Storytelling-Komponente zu intensivieren. Zielkomponente: `components/layout/section.tsx` auf Route `app/page.tsx`.

**IDEA_042**: Erweitere die Übersichtsseite um Meta-Analysen gängiger Sicherheitsprobleme im Alltag als Fließtext-Einleitungen. Zielkomponente: `components/layout/section.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_043**: Integriere detaillierte Beschreibungen von Brandschutz-, Flucht- und Paniktüren nach EN 1125 / EN 179. Zielkomponente: `components/layout/section.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_044**: Erkläre den Unterschied zwischen modularen und kompakten Bauweisen von Schließzylindern umfassend im Text. Zielkomponente: `components/layout/section.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_045**: Ergänze den Inhalt um Datenschutz- und DSGVO-Aspekte bei der Protokollierung von elektronischen Zutrittsereignissen. Zielkomponente: `components/layout/section.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_046**: Erweitere den Content um Tipps zur Pflege und zum Batteriewechsel bei Funkschlüsseln. Zielkomponente: `components/layout/section.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_047**: Füge eine inhaltliche Vertiefung über smarte Alarmanlagen-Integration und Videoüberwachung als Ergänzung zur Mechanik ein. Zielkomponente: `components/layout/section.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_048**: Ergänze Hinweise zum Management von Schlüsselverlusten in komplexen Anlagen und den rechtlichen Konsequenzen. Zielkomponente: `components/layout/section.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_049**: Integriere detaillierte Beschreibungen der Einsatzgebiete und Anfahrtskosten-Staffelungen als Fließtext. Zielkomponente: `components/layout/section.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_050**: Füge ein umfassendes Mission Statement zur Digitalisierung des Schlüsseldienst-Handwerks in Deutschland hinzu. Zielkomponente: `components/layout/section.tsx` auf Route `app/page.tsx`.

## KATEGORIE C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE (IDEEN 51 BIS 75)
**IDEA_051**: Interaktiver Enterprise ROI- und Ladezeit-Kalkulator. Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere den umgebenden Fließtext auf 850 Wörter. Zielkomponente: `components/calculator/service-einsatz-rechner.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_052**: Implementiere ein interaktives Wohnungs-Sicherheits-Audit-Tool mit dynamischem Radar-Chart als visuelles Feedback für Conversion. Zielkomponente: `components/calculator/tuer-absicherung-rechner.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_053**: Ergänze einen Live-Verfügbarkeits-Indikator ('Noch 2 Termine heute frei'), der über eine Server Action synchronisiert wird, um Dringlichkeit zu schaffen. Zielkomponente: `components/autoschluessel/preis-anzeige.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_054**: Füge 'Sticky Add-to-Cart' oder 'Sticky Kontakt'-Balken am unteren Bildschirmrand hinzu, die nach 50% Scrolltiefe erscheinen. Zielkomponente: `components/ui/button.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_055**: Integriere eine dynamische Vorab-Validierung des Schlüsselcodes mit Live-Feedback (z.B. 'Hersteller erkannt: ABUS') zur Reduzierung der Abbruchquote. Zielkomponente: `components/forms/controls.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_056**: Erstelle ein interaktives Vertrauens-Widget, das verifizierte Kundenbewertungen in Echtzeit durchrotiert (mit Pause bei Hover). Zielkomponente: `components/vertrauen/nachweise-liste.tsx` auf Route `app/page.tsx`.

**IDEA_057**: Ergänze In-Text Conversion-Widgets in Ratgeber-Artikeln ('Passend zum Thema: Beratung anfordern'), die direkt einen Termin-Flow im Modal starten. Zielkomponente: `components/ui/card.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_058**: Implementiere ein interaktives Maß-Ermittlungs-Tool, das Benutzern via visuellem Schieberegler hilft, A- und B-Maße korrekt abzulesen. Zielkomponente: `components/visual/generators/zylinder-mass.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_059**: Nutze Progressive Profiling in einem mehrstufigen Akkordeon-Formular, um Reibungsverluste bei komplexen Bestellungen zu minimieren. Zielkomponente: `components/ui/accordion.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_060**: Biete einen interaktiven ROI-Rechner, der die Zeitersparnis bei Schlüsselverlusten (Umprogrammierung vs. Zylindertausch) berechnet. Zielkomponente: `components/ui/info-tip.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_061**: Zeige dynamische 'Bestseller'- oder 'Oft gebucht für [Fahrzeugmarke]'-Badges an, die sich basierend auf der initialen Auswahl aktualisieren. Zielkomponente: `components/ui/badge.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_062**: Integriere interaktive Vorher-Nachher-Slider (Image Compare), die eine Standard-Tür vs. eine voll abgesicherte Tür demonstrieren. Zielkomponente: `components/ui/image-placeholder.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_063**: Füge ein Gamification-Element hinzu: 'Bauen Sie Ihre virtuelle Anlage in 3 Schritten' mit visuellem Fortschrittsbalken und Belohnung (Rabatt-Code/PDF-Plan). Zielkomponente: `components/layout/section.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_064**: Implementiere Exit-Intent-Modals, die greifen, wenn der Nutzer die Maus aus dem Viewport bewegt, um eine kostenlose telefonische Erstberatung anzubieten. Zielkomponente: `components/ui/alert.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_065**: Nutze die Web Share API, um mobilen Nutzern das einfache Teilen von Sicherheitskarten-Fotos aus ihrer Galerie per nativem OS-Dialog zu ermöglichen. Zielkomponente: `components/forms/photo-upload.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_066**: Integriere 'Call-to-Action'-Knöpfe mit Micro-Commitments ('Jetzt Preis prüfen' statt 'Jetzt buchen'), um die initiale Hürde zu senken. Zielkomponente: `components/ui/button.tsx` auf Route `app/page.tsx`.

**IDEA_067**: Implementiere eine Floating-Action-Button (FAB) für direkten WhatsApp-Support, der nur während der Öffnungszeiten aktiv ist. Zielkomponente: `components/layout/site-footer.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_068**: Ergänze personalisierte Produktvorschläge ('Andere Kunden mit dieser Tür wählten auch...'), angetrieben durch einfache Heuristiken. Zielkomponente: `components/ui/card.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_069**: Füge Video-Tooltips hinzu: Ein Klick auf ein Info-Icon öffnet ein 10-sekündiges Erklärvideo (stumm, Autoplay) im Popover. Zielkomponente: `components/ui/info-tip.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_070**: Erlaube das nahtlose Hinzufügen von Kalenderereignissen (.ics/Google Calendar) direkt nach der Terminbuchung via React 19 Action. Zielkomponente: `components/ui/button.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_071**: Nutze Auto-Complete und Fuzzy-Search für die Fahrzeugauswahl, um die Eingabegeschwindigkeit extrem zu erhöhen. Zielkomponente: `components/forms/controls.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_072**: Zeige den kumulierten Wert der ausgewählten Sicherheitstechnik in einer Sticky-Leiste permanent an, um Preistransparenz zu garantieren. Zielkomponente: `components/layout/summary-list.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_073**: Integriere Social-Proof-Meldungen wie '3 Schließanlagen wurden in den letzten 7 Tagen geplant' (statisch, aber psychologisch wirksam). Zielkomponente: `components/ui/badge.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_074**: Markiere die beliebteste Service-Option mit einem 'Empfohlen'-Tag und hebe sie durch einen subtilen Schatten visuell hervor (Decoy-Effekt). Zielkomponente: `components/forms/option-card.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_075**: Integriere einen Gast-Checkout-Flow mit einem Klick über Apple Pay / Google Pay, um den Trichter zu radikal zu verkürzen. Zielkomponente: `components/ui/button.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

## KATEGORIE D: EXTREME PERFORMANCE, ARCHITEKTUR & DX (IDEEN 76 BIS 100)
**IDEA_076**: Implementiere CSS Subgrid für alle mehrspaltigen Sektionen (grid-rows-[subgrid]), um eine 100% einheitliche Kartenhöhe ohne JS-Berechnung zu garantieren. Zielkomponente: `components/layout/section.tsx` auf Route `app/page.tsx`.

**IDEA_077**: Stelle sicher, dass alle Bilder Next.js Image-Komponenten mit expliziten width/height und dem 'placeholder=blur'-Attribut für perfekte LCP-Scores nutzen. Zielkomponente: `components/ui/image-placeholder.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_078**: Verwende CSS Container Queries (@container) auf Card-Ebene, um die Komponenten-Responsivität unabhängig vom Seiten-Layout zu machen. Zielkomponente: `components/ui/card.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_079**: Lagere rechenintensive Schließplan-Logik in Web Worker aus, um den Main-Thread (TBT) für UI-Interaktionen völlig frei zu halten. Zielkomponente: `components/visual/generators/schliessplan.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_080**: Wechsle zu ungesteuerten Formularen (uncontrolled components) mit React Hook Form und zod, um Re-Renders pro Tastenanschlag vollständig zu eliminieren. Zielkomponente: `components/forms/controls.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_081**: Nutze CSS content-visibility: auto für Sektionen unterhalb des Fold, um die initiale Render-Dauer (FCP) massiv zu beschleunigen. Zielkomponente: `components/layout/site-header.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_082**: Generiere verschachteltes, valides Schema.org (Article, BreadcrumbList, FAQPage) für perfekte Rich Snippets in den SERPs (absichern mit schema-dts). Zielkomponente: `components/seo/json-ld.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_083**: Ersetze IntersectionObserver-Polyfills durch die native Intersection Observer API und entferne ungenutzte Motion-Bibliotheken zugunsten von CSS Transitions. Zielkomponente: `components/visual/motion/in-view.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_084**: Nutze React 19 'use cache' für teure Preis-Berechnungs-Funktionen auf dem Server, um TTFB bei Reloads zu minimieren. Zielkomponente: `components/calculator/service-einsatz-rechner.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_085**: Optimiere Event-Handler: Ersetze leere onClick-Handler und console.logs, um Memory-Leaks und 'Silent Logic Death' zu bereinigen. Zielkomponente: `components/ui/button.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_086**: Füge Error Boundaries auf Komponenten-Ebene hinzu, damit ein Fehler in einer Card nicht den gesamten Page-Tree zum Absturz bringt. Zielkomponente: `components/ui/alert.tsx` auf Route `app/page.tsx`.

**IDEA_087**: Generiere Breadcrumbs statisch während der Build-Zeit statt dynamisch zur Laufzeit, um Server-Ressourcen zu schonen. Zielkomponente: `components/layout/breadcrumbs.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_088**: Konvertiere alle SVGs in optimierte, inline-gerenderte React-Komponenten mit 'currentColor', um Netzwerk-Requests für Assets einzusparen. Zielkomponente: `components/visual/icons/icon-base.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_089**: Preloade kritische Schriftarten (next/font) strikt ohne Layout Shift (font-display: swap) und mit präzisen Fallback-Metriken. Zielkomponente: `components/layout/site-footer.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_090**: Ersetze JS-basierte Farbberechnungen durch direkte Nutzung von semantischen CSS-Variablen (var(--primary)) zur Laufzeit. Zielkomponente: `components/ui/badge.tsx` auf Route `app/service-und-termin/page.tsx`.

**IDEA_091**: Implementiere clientseitige Bildkomprimierung via Canvas-API vor dem Upload, um Payload-Größen drastisch zu reduzieren. Zielkomponente: `components/forms/photo-upload.tsx` auf Route `app/schluessel-nach-code/page.tsx`.

**IDEA_092**: Aktiviere aggressive Vercel Edge Caching-Header (s-maxage=31536000) für alle statischen Ratgeber-Seiten. Zielkomponente: `components/layout/section.tsx` auf Route `app/ratgeber/page.tsx`.

**IDEA_093**: Binde Popover und Tooltips deklarativ mit dem neuen HTML5 <dialog> Element und der Popover API anstelle von schweren JS-Bibliotheken an. Zielkomponente: `components/ui/info-tip.tsx` auf Route `app/tuer-und-schliesstechnik/page.tsx`.

**IDEA_094**: Entferne veraltete 'any'-Typisierungen und implementiere strikte TypeScript-Interfaces für den Konfigurator-State, um maskierte Typfehler zu beseitigen. Zielkomponente: `components/forms/option-card.tsx` auf Route `app/gleichschliessende-zylinder/page.tsx`.

**IDEA_095**: Nutze CSS will-change: transform sparsam und gezielt nur für interaktive Karten im aktiven Hover-State, um den GPU-Speicher nicht zu überlasten. Zielkomponente: `components/ui/card.tsx` auf Route `app/elektronische-zutrittsloesungen/page.tsx`.

**IDEA_096**: Eliminiere Hydration Mismatches, indem window-Zugriffe strikt in useEffects oder in Komponenten gekapselt werden, die dynamisch importiert sind. Zielkomponente: `components/ui/accordion.tsx` auf Route `app/page.tsx`.

**IDEA_097**: Setze rel='preload' für die wichtigsten Hero-Bilder direkt im Head, um LCP-Verzögerungen durch React-Mounting zu umgehen. Zielkomponente: `components/ui/button.tsx` auf Route `app/autoschluessel/page.tsx`.

**IDEA_098**: Optimiere die DOM-Größe, indem verschachtelte <div>-Container in Listen zu React.Fragments <></> reduziert werden. Zielkomponente: `components/layout/summary-list.tsx` auf Route `app/sicherheitstechnik/page.tsx`.

**IDEA_099**: Erzwinge Hardware-Beschleunigung für SVG-Strich-Animationen (transform: translateZ(0)) um Ruckeln auf mobilen Geräten zu verhindern. Zielkomponente: `components/visual/motion/draw-on.tsx` auf Route `app/schliessanlagen/page.tsx`.

**IDEA_100**: Führe globale strukturelle und kinetische Fallbacks ein: overflow-x: clip; max-width: 100vw; sowie transition-duration: 0.01ms für prefers-reduced-motion. Zielkomponente: `components/ui/image-placeholder.tsx` auf Route `app/service-und-termin/page.tsx`.
