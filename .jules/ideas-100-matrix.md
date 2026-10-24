# PHILOSOPHISCHE 100-IDEEN-MATRIX

## KATEGORIE A: AWWWARDS-KINETIK & TAKTILE INTERAKTION (IDEEN 1 BIS 25)

### IDEA_001
- **Titel:** Kinetische Federdämpfung für Primary Buttons
- **Komponente:** src/components/ui/button.tsx
- **Details:** Einführung einer exakten Federphysik (cubic-bezier(0.16, 1, 0.3, 1)) für Hover- und Active-States aller Haupt-Buttons, um ein taktiles "Eindrück"-Gefühl ohne störende Layout-Shifts zu erzeugen, streng nach Schweizer Light Mode Vorgaben.

### IDEA_002
- **Titel:** Spatial Bento-Grid für Service-Kacheln
- **Komponente:** src/components/layout/section.tsx
- **Details:** Überführung statischer Service-Cards in ein fluides CSS Subgrid-Layout, das sich dynamisch dem Viewport anpasst, mit 1px OKLCH-Haarlinien und mikro-haptischem Hover-Glow am Cursor.

### IDEA_003
- **Titel:** Scroll-getriebene Zylinder-Schnitt-Explosion
- **Komponente:** src/components/visual/generators/profilschnitt.tsx
- **Details:** Eine On-Scroll Animation (via IntersectionObserver), bei der sich ein Zylinder-Profilschnitt beim Herunterscrollen in seine Einzelteile zerlegt und wieder zusammensetzt, um technische Präzision zu visualisieren.

### IDEA_004
- **Titel:** Dynamischer Haarlinien-Lichtreflex auf Info-Karten
- **Komponente:** src/components/ui/card.tsx
- **Details:** Ein subtiler, cursor-verfolgender Lichtreflex auf den Rahmen der Karten (oklch(0.89 0.008 260 / 0.55)), der die 1px-Kanten bei Bewegung sanft aufhellt und Tiefe ohne echte Schatten suggeriert.

### IDEA_005
- **Titel:** Taktiles Drag & Drop für Dateiuploads
- **Komponente:** src/components/forms/photo-upload.tsx
- **Details:** Visuelles Feedback beim Hineinziehen von Fotos, bei dem das Drop-Feld mit weicher Federphysik leicht nachgibt (Scale 0.98) und der Rahmen chromatisch reiner wird, um Interaktionsbereitschaft zu signalisieren.

### IDEA_006
- **Titel:** Fluide Übergänge für Akkordeon-Panels
- **Komponente:** src/components/ui/accordion.tsx
- **Details:** Implementierung einer CSS grid-template-rows (0fr zu 1fr) basierten, seidenweichen Öffnungs-Animation für FAQ-Akkordeons, die das restliche Layout sanft nach unten schiebt, gestützt durch die Standard-Kurve.

### IDEA_007
- **Titel:** Parallax-Ebenen für SVG-Hintergründe
- **Komponente:** src/components/visual/interaktiv/schliessplan-interaktiv.tsx
- **Details:** Subtile, mausgesteuerte Parallax-Bewegung (max 3-5px) einzelner SVG-Layer in technischen Zeichnungen, um eine dreidimensionale Papierstruktur innerhalb des Light Modes zu emulieren.

### IDEA_008
- **Titel:** Kinetische Validierungs-Rückmeldung
- **Komponente:** src/components/forms/controls.tsx
- **Details:** Statt harter roter Ränder bei Fehlern, ein kurzes, physikalisch gedämpftes horizontales Schütteln (Shake-Animation mit Feder-Curve) des Input-Feldes kombiniert mit sanfter OKLCH-Tönung.

### IDEA_009
- **Titel:** Zero-Shift Lade-Indikatoren in Buttons
- **Komponente:** src/components/ui/button.tsx
- **Details:** Bei Klick auf einen asynchronen Button gleitet der Text sanft nach oben weg, während der Lade-Spinner von unten einfährt, beides streng in der y-Achse maskiert (overflow: hidden), ohne die Breite des Buttons zu verändern.

### IDEA_010
- **Titel:** Scroll-Snap Architektur für Produktlisten
- **Komponente:** src/app/(site)/artikel/artikel-liste.tsx
- **Details:** Einführung eines seidenweichen CSS Scroll-Snap Verhaltens für horizontale Produkt-Slider, wobei das aktuell zentrierte Element subtil vergrößert und schärfer dargestellt wird.

### IDEA_011
- **Titel:** Morphing-Icons für Menü-Zustände
- **Komponente:** src/components/layout/site-header.tsx
- **Details:** Der Hamburger-Menü-Button transformiert sich bei Klick durch SVG-Path-Morphing stufenlos und organisch in ein Schließen-Kreuz, begleitet von einer leichten Skalierungs-Dämpfung.

### IDEA_012
- **Titel:** Taktile Schieberegler mit Raster-Feedback
- **Komponente:** src/components/calculator/rechner-bausteine.tsx
- **Details:** Range-Slider, die beim Ziehen über definierte Werte spürbar "einrasten" (durch winzige CSS-Scale Anpassungen des Handles) und visuell den genauen Wert auf einer Haarlinien-Skala hervorheben.

### IDEA_013
- **Titel:** Fluide Typografie-Skalierung
- **Komponente:** src/app/(site)/globals.css
- **Details:** Strenge Durchsetzung von CSS `clamp()` für sämtliche Headlines, sodass diese stufenlos zwischen Mobile und 4K-Desktop wachsen, um typografische Rhythmik-Brüche komplett zu eliminieren.

### IDEA_014
- **Titel:** Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
- **Komponente:** src/components/calculator/service-einsatz-rechner.tsx
- **Details:** Entwicklung eines reaktiven Schieberegler-Tools mit React 19 Server Actions, useOptimistic und Bento-Ergebnis-Grid. Binde das Tool direkt in die bestehende Services-Seite ein und erweitere den umgebenden Fließtext auf 850 Wörter.

### IDEA_015
- **Titel:** Organische Progress-Bars für Formulare
- **Komponente:** src/components/flow/flow-shell.tsx
- **Details:** Ein extrem feiner (1px), stahlblauer Fortschrittsbalken am oberen Bildschirmrand, der bei jedem Schritt-Wechsel weich voranschreitet, statt hart zu springen.

### IDEA_016
- **Titel:** Kinetische Tooltips mit Richtungs-Intelligenz
- **Komponente:** src/components/ui/info-tip.tsx
- **Details:** Tooltips, die nicht einfach aufploppen, sondern aus der exakten Richtung der Cursor-Bewegung "hineingleiten", gesteuert über transform-origin und physikalische Kurven.

### IDEA_017
- **Titel:** Elastische Seitenwechsel
- **Komponente:** src/components/visual/motion/seitenwechsel.tsx
- **Details:** Eine hauchdünne, gedämpfte Maskierungs-Animation beim Next.js Routen-Wechsel, die den Inhalt der neuen Seite von unten sanft einblendet, ohne das Awwwards-Gefühl zu stören.

### IDEA_018
- **Titel:** Dynamische SVG-Strichstärken
- **Komponente:** src/components/visual/generators/zylinder-mass.tsx
- **Details:** Bei Mouse-Over verdicken sich kritische Linien der Zylinder-Maßzeichnung weich von 1px auf 1.5px, um Fokus zu setzen, während der Rest der Zeichnung subtil verblasst.

### IDEA_019
- **Titel:** Magnetische Links und Buttons
- **Komponente:** src/components/layout/site-footer.tsx
- **Details:** Wichtige Call-to-Actions (CTAs) ziehen den Mauszeiger in einem Radius von 10px leicht an (Magnet-Effekt via Framer Motion/Vanilla JS), um die Klickfläche taktil zu vergrößern.

### IDEA_020
- **Titel:** Gestengesteuerte Galerie-Wipes
- **Komponente:** src/app/(site)/autoschluessel/marken/[make]/page.tsx
- **Details:** Bei Fahrzeugmodellen können Nutzer mit einer Wischgeste (Touch oder Trackpad) zwischen Bildern blättern, mit einem trägen Widerstand, der sich nach physikalischen Gesetzen anfühlt.

### IDEA_021
- **Titel:** Typografische Enthüllungs-Animation
- **Komponente:** src/components/layout/page-header.tsx
- **Details:** Die H1-Überschriften werden beim ersten Laden der Seite zeichenweise mit einem extrem schnellen (20ms), aber gedämpften Fade-Up-Effekt aufgedeckt (Staggered Reveal).

### IDEA_022
- **Titel:** Glasmorphismus-Layer mit OKLCH
- **Komponente:** src/components/layout/mobile-action-bar.tsx
- **Details:** Die mobile Aktionsleiste erhält einen echten Backdrop-Blur (12px) kombiniert mit einer hochtransparenten (0.85) OKLCH-Hintergrundfarbe, um Überlappungen elegant zu lösen.

### IDEA_023
- **Titel:** Pulsierende Status-Indikatoren
- **Komponente:** src/app/(site)/service-und-termin/terminstatus/status-formular.tsx
- **Details:** Live-Terminstatus zeigt einen 4px großen, sauber pulsierenden OKLCH-Punkt (Grün/Gelb), der Atembewegungen simuliert, um Aktualität ohne Hektik zu signalisieren.

### IDEA_024
- **Titel:** Physik-basierte Dropdowns
- **Komponente:** src/components/forms/controls.tsx
- **Details:** Custom Select-Dropdowns, die bei Öffnung nicht abrupt erscheinen, sondern mit einem leichten "Bounce" in Position fallen und sich elegant entfalten.

### IDEA_025
- **Titel:** Kinetische Breadcrumbs
- **Komponente:** src/components/layout/breadcrumbs.tsx
- **Details:** Beim Navigieren in tiefere Ebenen rutschen die bestehenden Breadcrumbs sanft nach links, um Platz für den neuen Pfad zu machen, anstatt die gesamte Leiste neu zu rendern.

## KATEGORIE B: SEMANTISCHE AUTORITÄT & CONTENT-MAXIMIERUNG (IDEEN 26 BIS 50)

### IDEA_026
- **Titel:** Tiefgehende FAQ-Architektur für Schlüsselkopien
- **Route:** src/app/(site)/schluessel-nach-vorlage/page.tsx
- **Details:** Erweiterung des Textbestands um 600 Wörter spezifischer Fragen zu Frästoleranzen und Materialkunde, sauber gegliedert in semantische `<section>` und `<article>` Tags.

### IDEA_027
- **Titel:** Strukturierte Vergleichsmatrix für Zylinder
- **Route:** src/app/(site)/gleichschliessende-zylinder/page.tsx
- **Details:** Eine native HTML-Tabelle mit CSS Subgrid, die 5 verschiedene Sicherheitsstufen von Schließzylindern (Anbohrschutz, Ziehschutz etc.) technisch hochdetailliert und visuell rein vergleicht.

### IDEA_028
- **Titel:** Historische Mechanik-Exkurse
- **Route:** src/app/(site)/tuer-und-schliesstechnik/page.tsx
- **Details:** Integration einer Text-Sektion über die Evolution der Schließtechnik, um semantische Autorität zu etablieren und die Text-zu-HTML-Ratio für SEO massiv zu pushen.

### IDEA_029
- **Titel:** Lexikon der Autoschlüssel-Transponder
- **Route:** src/app/(site)/autoschluessel/page.tsx
- **Details:** Ein tiefgehendes, aufklappbares Glossar (A-Z), das von ID48 bis Megamos Crypto alle Transponderarten erklärt, ohne die Hauptansicht zu überladen.

### IDEA_030
- **Titel:** Prozessschritte der Vor-Ort-Öffnung
- **Route:** src/app/(site)/service-und-termin/vor-ort/page.tsx
- **Details:** Eine detaillierte, textreiche Schritt-für-Schritt-Erklärung (800+ Wörter), wie zerstörungsfreie Öffnungstechniken funktionieren, versehen mit Schema.org `HowTo` Markup.

### IDEA_031
- **Titel:** Fallstudien elektronischer Zutrittssysteme
- **Route:** src/app/(site)/elektronische-zutrittsloesungen/page.tsx
- **Details:** Ausbau der Seite um fiktive, aber realistisch ausformulierte Enterprise-Szenarien (Bürokomplex, Klinik), um B2B-Kunden semantisch abzuholen.

### IDEA_032
- **Titel:** Leitfaden zur Schlüsselcode-Findung
- **Route:** src/app/(site)/schluessel-nach-code/page.tsx
- **Details:** Maximierung des Inhalts durch eine ausführliche textliche Beschreibung der verschiedenen Code-Karten, Gravur-Orte an Zylindern und Typologien der Hersteller.

### IDEA_033
- **Titel:** Lokale Sicherheits-Analysen
- **Route:** src/app/(site)/standorte/[city]/page.tsx
- **Details:** Aufwertung der Standortseiten durch fundierte Texte über typische lokale Gebäudestrukturen (z.B. Altbau vs. Neubau) und deren spezifische Sicherheitsanforderungen (Wortzahl > 1000).

### IDEA_034
- **Titel:** Ratgeber: Einbruchschutz nach DIN
- **Route:** src/app/(site)/sicherheitstechnik/page.tsx
- **Details:** Detaillierte semantische Integration der DIN EN 1627 Normen für einbruchhemmende Türen, strukturiert mit sauberen H2/H3-Hierarchien für unangefochtene Fachautorität.

### IDEA_035
- **Titel:** Pflegehinweise für Profilzylinder
- **Route:** src/app/(site)/artikel/[slug]/page.tsx
- **Details:** Ergänzung der Produktdetailseiten um ausführliche Absätze zur Wartung (Grafitpulver vs. Öl), um Mehrwert zu bieten und Retouren durch Fehlbedienung zu senken.

### IDEA_036
- **Titel:** Der Weg des Schlüssels (Produktions-Story)
- **Route:** src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx
- **Details:** Ein langes, erzählerisches Text-Element unter dem Formular, das den Weg von der Fotografie bis zur CNC-Fräse detailliert beschreibt und Vertrauen aufbaut.

### IDEA_037
- **Titel:** Detaillierte Marken-Porträts (Fahrzeuge)
- **Route:** src/app/(site)/autoschluessel/marken/[make]/page.tsx
- **Details:** Hinzufügen von markenspezifischem Text-Content zu den Eigenheiten der jeweiligen Wegfahrsperren-Systeme (z.B. BMW EWS vs. CAS), um Fachkompetenz zu demonstrieren.

### IDEA_038
- **Titel:** Mythen der Sicherheitstechnik entlarvt
- **Route:** src/app/(site)/ratgeber/page.tsx
- **Details:** Eine komplett neue Sektion im bestehenden Ratgeber-Hub, die sich dediziert und textstark (1200 Wörter) mit gängigen Fehlannahmen (z.B. "Jedes Schloss ist pickbar") auseinandersetzt.

### IDEA_039
- **Titel:** Erklärungen zu Sperrschließungen
- **Route:** src/app/(site)/schliessanlagen/page.tsx
- **Details:** Fachlicher Deep-Dive in die Mathematik und Organisation von General-Hauptschlüssel-Anlagen (GHS), inkl. Berechnungsgrundlagen für Planer.

### IDEA_040
- **Titel:** Batterie-Management bei Smart Keys
- **Route:** src/app/(site)/autoschluessel/smart-key/page.tsx
- **Details:** Content-Ausbau um detaillierte Laufzeiten, Wechsel-Anleitungen und Warnsignale schwacher Batterien bei Keyless-Go-Systemen.

### IDEA_041
- **Titel:** Das Schließanlagen-Pflichtenheft
- **Route:** src/app/(site)/schliessanlagen/konfigurator/page.tsx
- **Details:** Vor dem eigentlichen Konfigurator wird in 600 Wörtern erklärt, welche Parameter für die Planung einer Schließanlage zwingend vorbereitet werden müssen (Semantischer Anchor).

### IDEA_042
- **Titel:** Spatial Bento Grid mit dynamischem Haarlinien-Lichtreflex
- **Komponente:** src/components/showcase/spatial-bento-grid.tsx
- **Details:** Überführung der bestehenden Feature-Karten auf der Startseite in ein CSS Subgrid Bento-Layout mit Haarlinien-Kanten (oklch(0.89 0.008 260 / 0.55)), gedämpfter Federphysik und Cursor-Positions-Tracking ohne Layout-Shifts.

### IDEA_043
- **Titel:** Transparenz-Bericht: Preisbildung
- **Route:** src/app/(site)/service-und-termin/page.tsx
- **Details:** Eine offene, textliche Aufschlüsselung, wie sich Service-Preise zusammensetzen (Anfahrt, Material, Werkzeugverschleiß, Zeit), um psychologischen Widerstand zu senken.

### IDEA_044
- **Titel:** Notöffnungs-Protokoll
- **Route:** src/app/(site)/service-und-termin/anfrage/page.tsx
- **Details:** Textliche Ergänzung, die den juristischen Ablauf (Ausweiskontrolle, Dokumentation) bei einer Hausöffnung exakt und verständlich beschreibt.

### IDEA_045
- **Titel:** Die Physik des Fräsens
- **Route:** src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx
- **Details:** Detaillierte Abhandlung über Hartmetall-Fräser, Drehzahlen und Toleranzen im Zehntelmillimeter-Bereich, um die Ingenieurskunst in den Vordergrund zu rücken.

### IDEA_046
- **Titel:** Lexikon der Türbeschläge
- **Route:** src/app/(site)/sicherheitstechnik/[slug]/page.tsx
- **Details:** Tiefgehende Beschreibung von Schutzrosetten, Kernziehschutz und Stahleinlagen in Beschlägen, angereichert mit Fachvokabular (700+ Wörter).

### IDEA_047
- **Titel:** RFID vs. NFC vs. Bluetooth
- **Route:** src/app/(site)/elektronische-zutrittsloesungen/page.tsx
- **Details:** Ein langer, vergleichender Textblock, der die Vor- und Nachteile der verschiedenen Funkstandards für elektronische Zylinder technisch fundiert analysiert.

### IDEA_048
- **Titel:** Die Geschichte des Zylinderschlosses
- **Route:** src/app/(site)/gleichschliessende-zylinder/page.tsx
- **Details:** Historischer Exkurs über die Erfindung durch Linus Yale, um die Beständigkeit und Bedeutung des Profilzylinders in der modernen Gesellschaft zu untermauern.

### IDEA_049
- **Titel:** Ratgeber: Versicherungsanforderungen
- **Route:** src/app/(site)/rechtliches/agb/page.tsx
- **Details:** Semantische Erweiterung der rechtlichen Seiten um Erklärungen, welche Schließ-Standards (VdS-Klassen) von Hausratversicherungen gefordert werden.

### IDEA_050
- **Titel:** Umfassende Glossar-Verlinkung
- **Route:** src/app/(site)/layout.tsx
- **Details:** Globale Implementierung einer text-basierten Cross-Verlinkung, bei der Fachbegriffe in Artikeln automatisch subtile, nicht-aufdringliche Definitionen per Hover erhalten (ohne neue Routen).

## KATEGORIE C: CONVERSION-PSYCHOLOGIE & NATIVE WERKZEUGE (IDEEN 51 BIS 75)

### IDEA_051
- **Titel:** Interaktiver Sicherheits-Score
- **Komponente:** src/app/(site)/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx
- **Details:** Ein React 19 Formular, das durch 5 Fragen navigiert und sofort lokal (useOptimistic) einen Sicherheits-Score für das Haus des Nutzers berechnet, bevor Leads gesammelt werden.

### IDEA_052
- **Titel:** Visueller Schlüssel-Finder (Code vs Foto)
- **Komponente:** src/app/(site)/page.tsx
- **Details:** Ein Wizard direkt auf der Startseite, der durch zwei Klicks ("Habe ich einen Code?" -> Ja/Nein) den Nutzer blitzschnell zur richtigen Service-Route leitet.

### IDEA_053
- **Titel:** Echtzeit-Preisschätzung für Zylinder
- **Komponente:** src/app/(site)/gleichschliessende-zylinder/konfigurator/konfigurator.tsx
- **Details:** Während der Konfiguration aktualisiert sich der Preis stufenlos und animiert (Zähler-Animation) bei jedem Klick auf ein neues Feature (z.B. Not- und Gefahrenfunktion).

### IDEA_054
- **Titel:** Vorher-Nachher Türschutz-Slider
- **Komponente:** src/app/(site)/tuer-und-schliesstechnik/page.tsx
- **Details:** Ein interaktives Bild-Vergleichswerkzeug (mit nativem `<input type="range">`), das eine Standardtür im Vergleich zu einer hochgerüsteten Sicherheitstür zeigt.

### IDEA_055
- **Titel:** Dynamische Verfügbarkeits-Ampel
- **Komponente:** src/app/(site)/artikel/[slug]/artikel-kauf.tsx
- **Details:** Statt einfachem Text "Auf Lager", eine subtil pulsierende Ampel, die mit Server Actions die exakte Stückzahl ausgibt und psychologische Dringlichkeit ("Noch 3 verfügbar") erzeugt.

### IDEA_056
- **Titel:** Auto-Vervollständigung für Autoschlüssel
- **Komponente:** src/app/(site)/autoschluessel/anfrage/assistent.tsx
- **Details:** Ein flottes Kombinationsfeld (Combobox) für Fahrzeug-Marken und -Modelle, das Tippfehler verzeiht (Fuzzy Search) und die Auswahl ohne Ladezeiten filtert.

### IDEA_057
- **Titel:** Vertrauensbeweis-Ticker
- **Komponente:** src/app/(site)/page.tsx
- **Details:** Ein extrem dezenter, gedämpfter horizontaler Ticker im Footer-Bereich, der anonymisierte Service-Erfolge der letzten 24 Stunden anzeigt ("Türöffnung in Berlin-Mitte, 18 Min Anfahrt").

### IDEA_058
- **Titel:** Interaktives Zylinder-Messwerkzeug
- **Komponente:** src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx
- **Details:** Ein virtuelles Lineal, das auf dem Bildschirm kalibriert werden kann (Nutzer hält eine Kreditkarte ans Display), um das Konzept des Messens greifbar zu machen.

### IDEA_059
- **Titel:** ROI-Rechner für Schließanlagen
- **Komponente:** src/app/(site)/schliessanlagen/page.tsx
- **Details:** Ein Tool, das berechnet, ab wie vielen verlorenen Schlüsseln sich eine elektronische Anlage gegenüber einer mechanischen amortisiert (React 19, Server Actions).

### IDEA_060
- **Titel:** Foto-Diagnostik mit Pseudo-KI-Analyse
- **Komponente:** src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx
- **Details:** Nach dem Foto-Upload zeigt ein Overlay einen visuellen "Scan-Prozess" (Linien laufen über das Bild), um dem Nutzer das Gefühl präziser Begutachtung zu geben, während das Foto im Hintergrund asynchron hochgeladen wird.

### IDEA_061
- **Titel:** Sticky Action-Leiste für lange Seiten
- **Komponente:** src/components/layout/section.tsx
- **Details:** Auf langen Content-Seiten blendet sich nach 50vh scrollen eine elegante, glasmorphische Bar am unteren Rand ein, die den primären CTA (z.B. "Jetzt anfragen") hält.

### IDEA_062
- **Titel:** Kontextuelles FAQ-Highlighting
- **Komponente:** src/app/(site)/ratgeber/[slug]/page.tsx
- **Details:** Wenn ein Nutzer länger als 10 Sekunden an einer Stelle verweilt, hebt sich in der Sidebar (oder als dezenter Toast) eine passende Experten-Antwort leicht hervor.

### IDEA_063
- **Titel:** Micro-Commitment Formular-Architektur
- **Komponente:** src/components/flow/flow-shell.tsx
- **Details:** Zerkleinerung komplexer Anfrageformulare in noch simplere, extrem schnell ladende Einzel-Schritte, bei denen der erste Schritt nur EINE Auswahl erfordert, um Reibung zu eliminieren.

### IDEA_064
- **Titel:** Lokalisierte Social Proof Badges
- **Komponente:** src/app/(site)/standorte/[city]/page.tsx
- **Details:** Dynamische Anzeige von Bewertungen, die exakt aus dem vom Nutzer gewählten oder via GeoIP vermuteten Standort stammen ("34 erfolgreiche Einsätze in [Stadt] diesen Monat").

### IDEA_065
- **Titel:** Schließplan-Visualisierer in Echtzeit
- **Komponente:** src/components/visual/interaktiv/schliessplan-interaktiv.tsx
- **Details:** Nutzer können im Konfigurator Checkboxen anklicken, und ein SVG-Schließplan baut sich sofort visuell auf (Wer schließt was?), um die komplexe Matrix greifbar zu machen.

### IDEA_066
- **Titel:** Dringlichkeits-Indikator bei Notdiensten
- **Komponente:** src/app/(site)/service-und-termin/vor-ort/page.tsx
- **Details:** Ein dezentes UI-Element, das anzeigt: "Aktuelle durchschnittliche Anfahrtszeit in Ihrer Region: 22 Minuten", berechnet aus historischen Server-Daten.

### IDEA_067
- **Titel:** Verlustkosten-Kalkulator Autoschlüssel
- **Komponente:** src/app/(site)/autoschluessel/page.tsx
- **Details:** Ein schneller Rechner, der die Kosten eines nachgemachten Schlüssels mit den Kosten eines Totalverlusts (Austausch aller Steuergeräte) kontrastiert, um präventive Käufe zu triggern.

### IDEA_068
- **Titel:** Interaktiver Material-Wähler
- **Komponente:** src/app/(site)/artikel/[slug]/artikel-kauf.tsx
- **Details:** Bei Zylindern: Ein Toggle zwischen "Messing" und "Nickel", der nicht nur ein Bild wechselt, sondern auch das Gewicht und die Haltbarkeits-Metriken im Text fließend aktualisiert.

### IDEA_069
- **Titel:** Gamifizierte Sicherheits-Checkliste
- **Komponente:** src/app/(site)/sicherheitstechnik/page.tsx
- **Details:** Eine Liste von 10 Sicherheitspunkten (z.B. "Kellerfenster gesichert?"). Mit jedem Haken füllt sich ein Balken sanft, was psychologischen Abschluss-Drang erzeugt.

### IDEA_070
- **Titel:** Smart-Routing für Kontaktanfragen
- **Komponente:** src/app/(site)/service-und-termin/kontakt/page.tsx
- **Details:** Das Kontaktformular fragt zuerst das Anliegen ab und passt die restlichen Felder sofort dynamisch an (z.B. Upload-Feld für Foto erscheint nur bei "Schlüssel abgebrochen").

### IDEA_071
- **Titel:** Virtueller Rundgang Werkstatt
- **Komponente:** src/app/(site)/page.tsx
- **Details:** Statt eines Videos, ein interaktiver Bild-Slider, der dem Nutzer erlaubt, durch die hochreine, Schweizer-inspirierte Werkstattumgebung zu klicken (aufgebaut aus hochauflösenden Fotos).

### IDEA_072
- **Titel:** Ein-Klick Wagenkorb-Übernahme
- **Komponente:** src/app/(site)/warenkorb/page.tsx
- **Details:** Möglichkeit für B2B-Kunden, einen komplexen Warenkorb (z.B. 50 Zylinder) via generiertem Link zu teilen oder zu speichern, realisiert über URL Search Params und Client State.

### IDEA_073
- **Titel:** Interaktive Fräskurven-Simulation
- **Komponente:** src/components/visual/interaktiv/fraesbahn-bewegung.tsx
- **Details:** Ein technisches Spielzeug: Nutzer können eine Kurve einzeichnen und das SVG-Werkzeug simuliert die Fräsbahn. Demonstriert ultimative Präzision und hält die Nutzer auf der Seite.

### IDEA_074
- **Titel:** Kontrastreiche Fokus-Modi für Rechner
- **Komponente:** src/components/calculator/tuer-absicherung-rechner.tsx
- **Details:** Wenn der Nutzer mit dem Rechner interagiert, verdunkelt sich der Rest der Seite dezent (Fokus-Mode), um die gesamte Konzentration auf die Eingaben zu lenken.

### IDEA_075
- **Titel:** In-Browser Barcode/QR Scanner
- **Komponente:** src/app/(site)/schluessel-nach-code/page.tsx
- **Details:** Einbindung der WebRTC Kamera-API (nur bei HTTPS und Zustimmung), sodass Nutzer ihre Sicherheitskarte einfach in die Webcam halten können, um den Code auszulesen.

## KATEGORIE D: EXTREME PERFORMANCE, ARCHITEKTUR & DX (IDEEN 76 BIS 100)

### IDEA_076
- **Titel:** Next.js 16 'use cache' für Richtwerte
- **Komponente:** src/lib/data/richtwerte.ts
- **Details:** Ersetzen alter Revalidate-Exporte durch die neue `'use cache'` Direktive, `cacheTag()` und `cacheLife()` für die schweren Richtwert-Berechnungen, um Millisekunden-TTFB zu erreichen.

### IDEA_077
- **Titel:** CSS Subgrid Harmonisierung
- **Komponente:** src/app/(site)/globals.css
- **Details:** Vollständige Eliminierung statischer Höhen-Workarounds durch die konsequente Einführung von `grid-template-rows: subgrid` für alle Karten-Layouts, sodass Header, Text und Footer immer exakt in Linie stehen.

### IDEA_078
- **Titel:** Container Queries für Komponent-Modularität
- **Komponente:** src/components/layout/section.tsx
- **Details:** Umstellung aller Media-Queries auf `@container` Queries, sodass Komponenten (wie der Zylinder-Konfigurator) unabhängig vom Viewport, rein basierend auf ihrem verfügbaren Platz im Grid reagieren.

### IDEA_079
- **Titel:** AVIF-Hero-Pipelines mit Next Image
- **Komponente:** src/components/ui/image-placeholder.tsx
- **Details:** Forcierung des `formats={['image/avif', 'image/webp']}` in der `next/config.ts` und Optimierung der LCP-Bilder mit `fetchPriority="high"`, um Core Web Vitals zu dominieren.

### IDEA_080
- **Titel:** Zero-Shift Webfont-Optimierung
- **Komponente:** src/app/(site)/layout.tsx
- **Details:** Feintuning von `size-adjust`, `ascent-override` und `descent-override` in der CSS-Font-Declaration, damit die Fallback-Schriftarten mathematisch exakt dieselben Box-Dimensionen wie IBM Plex Sans haben.

### IDEA_081
- **Titel:** Strikte Hydration-Guards
- **Komponente:** src/lib/client-state.ts
- **Details:** Bereinigung aller `localStorage`-Zugriffe durch einen standardisierten, sicheren `useHydrated()` Hook, der Server-Client Mismatches radikal ausschließt.

### IDEA_082
- **Titel:** TypeScript 'unknown' Enforcement
- **Komponente:** src/lib/data/payload-mapping.ts
- **Details:** Refactoring aller verbleibenden `any` Casts im Payload-Adapter zu `unknown` mit strikten Type-Guards (Zod), um unsichtbare Laufzeit-Fehler unmöglich zu machen.

### IDEA_083
- **Titel:** Reduktion der DOM-Tiefe
- **Komponente:** src/components/layout/page-header.tsx
- **Details:** Zusammenfassung tief verschachtelter `<div>`-Bäume in saubere, flache Flexbox/Grid-Strukturen, um den Layout-Render-Pass im Browser um 30% zu beschleunigen.

### IDEA_084
- **Titel:** Formular-Zustandsmanagement mit React 19
- **Komponente:** src/app/(site)/schluessel-nach-vorlage/anfrage/anfrage-formular.tsx
- **Details:** Umstellung des Flow-Managements auf React 19 `useActionState` und `startTransition`, um das komplexe Zustandswirrwarr von useState in saubere, blockierungsfreie Updates zu überführen.

### IDEA_085
- **Titel:** SVG-Inlining für Glyphen
- **Komponente:** src/components/visual/glyphen/
- **Details:** Optimierung der React-SVG-Komponenten durch Entfernen unnötiger Wrapper-Elemente und Nutzung von currentColor, um das initial ausgelieferte HTML um wertvolle Kilobytes zu verkleinern.

### IDEA_086
- **Titel:** Preconnect & DNS-Prefetching
- **Komponente:** src/app/(site)/layout.tsx
- **Details:** Hinzufügen statischer `rel="preconnect"` Direktiven für externe Ressourcen (Fonts, Payload-API), um den Netzwerk-Wasserfall in der Millisekunde des Seitenaufrufs zu parallelisieren.

### IDEA_087
- **Titel:** Turbopack-Beschleunigung
- **Komponente:** package.json
- **Details:** Anpassung der Dev-Skripte auf `next dev --turbo`, kombiniert mit der Lösung von Inkompatibilitäten bei Dritt-Bibliotheken, um die Entwicklungs-Iterationsgeschwindigkeit zu verdoppeln.

### IDEA_088
- **Titel:** Toten Code Eliminieren (Silent Logic Death)
- **Komponente:** src/components/ui/accordion.tsx
- **Details:** Entfernung aller leeren Handler (`() => {}`) und Implementierung robuster Default-Verhalten (z.B. native `details`/`summary` Tags für Akkordeons, wo SEO und Zugänglichkeit kritisch sind).

### IDEA_089
- **Titel:** Optimierung der CSS Variable Scopes
- **Komponente:** src/lib/visual/area-theme.ts
- **Details:** Einschränkung der CSS-Variablen-Überschreibungen (Area-Themes) auf spezifische DOM-Nodes via `:where()` Selektoren, um globale Re-Calculations im Browser-Paint zu verhindern.

### IDEA_090
- **Titel:** Edge Runtime für Lightweight-Routen
- **Komponente:** src/app/(site)/rechtliches/
- **Details:** Konfiguration rein statischer oder simpler text-basierter Routen für die Next.js Edge Runtime, um den Server-Footprint drastisch zu minimieren.

### IDEA_091
- **Titel:** Server-Only Utility Enforcement
- **Komponente:** src/lib/data/
- **Details:** Einsatz des `server-only` Packages in allen Daten-Zugriffs-Layern, um zu garantieren, dass sensible DB-Logik niemals aus Versehen im Client-Bundle landet.

### IDEA_092
- **Titel:** Bundle-Splitting für Framer Motion
- **Komponente:** src/components/visual/motion/
- **Details:** Nutzung der `LazyMotion` und `m` Komponenten von framer-motion anstelle des schweren `motion` Imports, um das Client-JavaScript-Bundle signifikant zu verkleinern.

### IDEA_093
- **Titel:** Präzise Type-Maps statt Enums
- **Komponente:** src/lib/types.ts
- **Details:** Vollständiger Austausch von TypeScript `enum`s durch `as const` Maps und Template-Literal Types, um saubereren, baumschüttelbaren (tree-shakable) JavaScript Code auszugeben.

### IDEA_094
- **Titel:** Isolierte Zustand-Stores für den Warenkorb
- **Komponente:** src/lib/store/cart.ts
- **Details:** Refactoring des Zustand-Stores mit feingranularen Selectoren (Shallow-Equality), um unnötige Re-Renders komplexer Produktlisten zu unterbinden, wenn sich nur die Gesamtmenge ändert.

### IDEA_095
- **Titel:** Strict Content Security Policy (CSP)
- **Komponente:** next.config.ts
- **Details:** Generierung und Injektion einer strikten CSP via Middleware (Nonces für Inlineskripte, Restriktion auf vertrauenswürdige Domains), um höchste Unternehmenssicherheitsstandards zu erfüllen.

### IDEA_096
- **Titel:** Schema-DTS Strikte Überprüfung
- **Komponente:** src/components/seo/json-ld.tsx
- **Details:** Verankerung des `satisfies Graph` Operators in allen JSON-LD Generatoren, um sicherzustellen, dass jede Schema.org Struktur 100% konform zur Google-Spezifikation bleibt.

### IDEA_097
- **Titel:** Reduktion von Client Boundaries
- **Komponente:** src/components/layout/site-header.tsx
- **Details:** Restrukturierung des Headers: Verschiebung des `"use client"` Directives tief in die interaktiven Child-Komponenten (Mobile-Menü, Cart-Counter), während der Haupt-Header statisch als Server-Komponente bleibt.

### IDEA_098
- **Titel:** E2E Hydration Testing
- **Komponente:** vitest.config.ts
- **Details:** Einrichtung automatisierter Tests, die das HTML des Servers mit dem HTML nach dem React-Mount vergleichen und bei Mismatches sofort den Build-Prozess stoppen.

### IDEA_099
- **Titel:** Opt-in Reduced Motion Architektur
- **Komponente:** src/lib/bewegung.ts
- **Details:** Globale, ausnahmslose Verankerung der `prefers-reduced-motion` Media-Query, die alle CSS-Transitionen und JavaScript-Animationen sofort stoppt oder auf einfache Fades reduziert, eingebettet in das Core-Framework.

### IDEA_100
- **Titel:** Automatisierte Bild-Dimensionen (Aspect Ratio Guard)
- **Komponente:** src/components/ui/image-placeholder.tsx
- **Details:** Implementierung eines strikten Checks (Linting/Runtime), der erzwingt, dass absolut jedes Bild-Element (egal ob Next Image oder natives img) explizite Breite/Höhe oder `aspect-ratio` Deklarationen besitzt, um Layout-Shifts im Kern zu ersticken.
