# 100-Ideen Matrix (Red-Team Audit)

### Idee 1: Parallax-Hover auf Service-Karten
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Erzeugt räumliche Tiefe beim Hovern.
- **Spezifikation:** Implementierung eines 3D-Tilt-Effekts mit sanfter Federphysik (framer-motion) und dynamischem Glanzlicht (mix-blend-mode) auf den bestehenden Service-Karten.

### Idee 2: Magnetische Buttons für primäre CTAs
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Beschreibung:** Zieht den Cursor leicht an und erhöht die Klickrate.
- **Spezifikation:** Die primären Call-to-Action Buttons im Header erhalten einen Sticky-Cursor-Effekt mit einer 0.3s OKLCH-Farbtransition bei Annäherung.

### Idee 3: Kinetische Typografie beim Scrollen
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Lebendige Überschriften, die auf Scrollgeschwindigkeit reagieren.
- **Spezifikation:** Header-Texte verzerren sich leicht (Skew-Effekt) abhängig von der Scrollgeschwindigkeit, gesteuert über Intersection Observer und RequestAnimationFrame.

### Idee 4: Bento-Grid mit Subgrid-Alignment
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/schluesselarten-reihe.tsx`
- **Beschreibung:** Perfekt ausgerichtete Karten-Layouts ohne Layout-Shifts.
- **Spezifikation:** Umbau des bestehenden Layouts zu einem nativen CSS Grid mit `grid-template-rows: subgrid` für perfekt bündige Inhalte in allen Viewports.

### Idee 5: Taktiles Feedback bei Navigation
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/mobile-action-bar.tsx`
- **Beschreibung:** Haptisches Gefühl auf Mobilgeräten simulieren.
- **Spezifikation:** Bei Interaktion mit der mobilen Navigationsleiste wird ein Mikrovibrations-Feedback (Navigator.vibrate) in Kombination mit einer 50ms Skalierungsanimation ausgelöst.

### Idee 6: WebGL-Partikel im Hero-Hintergrund
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/layout/page-header.tsx`
- **Beschreibung:** Subtile, fließende Partikel als visuelles Highlight.
- **Spezifikation:** Ein leichter, Opaque-WebGL-Layer (mit Three.js), der auf Mausbewegungen reagiert, ohne den OKLCH-Hintergrund (0.988 0.002 260) zu dominieren.

### Idee 7: SVG-Pfad-Animationen für Icons
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Ziel-Komponente:** `src/components/visual/bereich-icon.tsx`
- **Beschreibung:** Icons zeichnen sich selbst bei Sichtbarkeit.
- **Spezifikation:** Die `stroke-dasharray`-Technik wird verwendet, um Icons organisch einzeichnen zu lassen, wenn sie in den Viewport scrollen.

### Idee 8: Fluide Layout-Transitionen (View Transitions API)
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Beschreibung:** Nahtlose Übergänge zwischen allen Seiten.
- **Spezifikation:** Einsatz der nativen View Transitions API für ein morphing-ähnliches Navigationserlebnis zwischen Route-Wechseln.

### Idee 9: Physik-basierte Dropdown-Menüs
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/ui/accordion.tsx`
- **Beschreibung:** Dropdowns fallen mit leichtem Bounce auf.
- **Spezifikation:** Accordions verwenden Spring-Animations für das Öffnen, anstatt linearem Ease, um natürliches Verhalten zu emulieren.

### Idee 10: Cursor-Spotlight auf dunklen Flächen
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/ui/bild-flaeche.tsx`
- **Beschreibung:** Hebt den Fokusbereich des Nutzers hervor.
- **Spezifikation:** Ein radialer CSS-Gradient folgt der Mausposition (CSS-Variablen), um ein Spotlight auf spezifische Produktbereiche zu werfen.

### Idee 11: Hover-Enthüllung für Preise
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/preis-anzeige.tsx`
- **Beschreibung:** Spielerische Interaktion bei Preisinformationen.
- **Spezifikation:** Preise werden erst beim Hovern über eine kleine Unschärfe-Maske (backdrop-filter: blur) scharf und lesbar.

### Idee 12: Scroll-basierte Farb-Interpolation
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Sanfter Wechsel der OKLCH-Farbstimmung.
- **Spezifikation:** Der Hintergrund wechselt nahtlos zwischen zwei sehr hellen, kühlen OKLCH-Tönen, abhängig von der Scroll-Tiefe.

### Idee 13: Interaktives Schlüssel-Zerschneiden (Hover)
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/visual/schluesselart-zeichnung.tsx`
- **Beschreibung:** Visuelles Feedback beim Ansehen der Schlüsselarten.
- **Spezifikation:** Die SVG-Zeichnung des Schlüssels wird beim Hover mit einer animierten Fräslinie virtuell bearbeitet.

### Idee 14: Dynamischer Glasmorphismus
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/info-tip.tsx`
- **Beschreibung:** Verbesserte Tiefenwahrnehmung bei Overlays.
- **Spezifikation:** Tooltips nutzen dynamischen Backdrop-Filter (blur und saturate), der sich je nach Hintergrundkontrast in Echtzeit anpasst.

### Idee 15: Reibungs-Scroll-Snapping
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Intuitives horizontales Wischen auf Mobile.
- **Spezifikation:** Horizontale Listen verwenden CSS `scroll-snap-type: x mandatory` mit maßgeschneiderter Reibungskurve für ein haptisches Scroll-Gefühl.

### Idee 16: Micro-Interactions an Checkboxen
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/service-und-termin/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/controls.tsx`
- **Beschreibung:** Befriedigendes Feedback beim Ausfüllen von Formularen.
- **Spezifikation:** Checkboxen nutzen ein SVG-Morphing von Kreis zu Haken, untermalt mit einem mikroskopisch kurzen Farb-Flash.

### Idee 17: Sanft pulsierende Verfügbarkeits-Indikatoren
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/standorte/[city]/page.tsx`
- **Ziel-Komponente:** `src/components/ui/badge.tsx`
- **Beschreibung:** Zieht Aufmerksamkeit auf Live-Status.
- **Spezifikation:** Ein grüner Indikator für "Sofort verfügbar" pulsiert asynchron (CSS Keyframes), um Aktivität zu simulieren, ohne zu stören.

### Idee 18: Elastisches Drag-and-Drop
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Beschreibung:** Spielerischer Datei-Upload.
- **Spezifikation:** Das Upload-Feld verformt sich elastisch zur Maus hin, wenn eine Datei darüber gezogen wird.

### Idee 19: Organisches Laden von Bildern
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/bild-flaeche.tsx`
- **Beschreibung:** Keine harten Bild-Plops beim Laden.
- **Spezifikation:** Bilder laden über einen Blur-Up-Effekt mit einer 1.2s langen, weichen Clip-Path-Enthüllung von unten nach oben.

### Idee 20: Verzerrter Hover auf Text-Links
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/rechtliches/impressum/page.tsx`
- **Ziel-Komponente:** `src/components/recht/rechtstext.tsx`
- **Beschreibung:** Moderne, unerwartete Text-Interaktion.
- **Spezifikation:** Text-Links erhalten beim Hover einen Glitch-Effekt durch CSS `text-shadow` in subtilen OKLCH-Farben, der 0.2s anhält.

### Idee 21: Dynamische Schatten (Lichtquelle aus Maus)
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Karten werfen Schatten weg vom Mauszeiger.
- **Spezifikation:** Box-Shadows der Karten werden über CSS-Variablen so berechnet, dass sie immer der Mausposition entgegenstehen (3D-Beleuchtung).

### Idee 22: Kinetischer Button-Schwarm
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Dynamische Sortierung der Marken-Buttons.
- **Spezifikation:** Die Marken-Buttons fließen bei Filter-Änderungen in einer organischen Schwarm-Bewegung (Flip-Animation) auf ihre neuen Positionen.

### Idee 23: Liquid Hover auf Icons
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/visual/icons/icon-base.tsx`
- **Beschreibung:** Icons verhalten sich wie flüssiges Metall.
- **Spezifikation:** SVG-Filter (`feTurbulence` und `feDisplacementMap`) erzeugen bei Hover eine kurze, wellenartige Verzerrung der Icon-Pfade.

### Idee 24: Sticky-Scroll-Elemente mit Überblendung
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/components/layout/page-header.tsx`
- **Beschreibung:** Wichtige Header-Informationen bleiben elegant im Bild.
- **Spezifikation:** Der Header schrumpft beim Scrollen nicht nur, sondern blendet bestimmte Text-Nodes organisch mit einer Stagger-Animation aus.

### Idee 25: Parallax-Tiefenunschärfe
- **Kategorie:** AWWWARDS_KINETICS
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/bild-flaeche.tsx`
- **Beschreibung:** Kino-ähnlicher Fokus-Effekt beim Scrollen.
- **Spezifikation:** Vordergrundelemente bleiben scharf, während Hintergrundelemente je nach Scroll-Abstand dynamisch unscharf (CSS `blur`) werden.

### Idee 26: Tiefergehende FAQ-Struktur für Autoschlüssel
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/service-article.tsx`
- **Beschreibung:** SEO- und Autoritäts-Boost durch umfangreiche FAQs.
- **Spezifikation:** Erweiterung des Inhalts um 800+ Wörter. Hinzufügen von strukturierten JSON-LD FAQs zu Transponder-Technik, Anlernen von Funkschlüsseln und Wegfahrsperren.

### Idee 27: Technische Vergleichsmatrix für Schließzylinder
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Experten-Wissen visuell und textlich aufbereiten.
- **Spezifikation:** Einbau einer detaillierten, responsiven CSS-Subgrid-Matrix, die über 10 technische Parameter von Schließzylindern (SKG, VdS, Bohr- und Ziehschutz) auf 900 Wörtern detailliert erklärt.

### Idee 28: Glossar für Sicherheitstechnik
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/page-header.tsx`
- **Beschreibung:** Aufbau von Trust durch Fachtermini-Erklärungen.
- **Spezifikation:** Ein integriertes Tooltip-Glossar für Fachbegriffe, gestützt durch einen 1000-Wörter Expertenartikel über Einbruchschutz-Standards.

### Idee 29: Historischer Kontext der Schließanlagen
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/components/schliessanlagen/system-erklaerung.tsx`
- **Beschreibung:** Content-Erweiterung über die Evolution von Systemen.
- **Spezifikation:** Ein 850-Wörter-Fließtext, der die technische Evolution von mechanischen zu mechatronischen Schließanlagen erklärt, ergänzt durch historische Benchmarks.

### Idee 30: Ausführliche Anleitung zur Schlüssel-Code-Findung
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/code-fundstelle.tsx`
- **Beschreibung:** Reduziert Support-Anfragen durch extrem gute Erklärungen.
- **Spezifikation:** Erweiterung des Contents um eine 950 Wörter umfassende, schrittweise Anleitung (inkl. Fallstricke) zur Identifikation von Schlüssel-Codes an verschiedenen Fahrzeugen und Zylindern.

### Idee 31: Experten-Interview als Content-Block
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Personalisierter Fach-Content.
- **Spezifikation:** Einbindung eines 1200 Wörter langen, strukturierten Q&A-Formats mit einem Sicherheitsexperten, formatiert im magazin-ähnlichen Swiss-Style.

### Idee 32: Detaillierte ROI-Erklärung für elektronische Zutrittslösungen
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Business-Case für B2B-Kunden ausformulieren.
- **Spezifikation:** Ein 800-Wörter Whitepaper-ähnlicher Abschnitt, der Kostenersparnisse bei Schlüsselverlust mathematisch und textlich darlegt.

### Idee 33: Technischer Deep-Dive: Gleichschließende Zylinder
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/stiftzuhaltung.tsx`
- **Beschreibung:** Mechanik für Laien extrem detailliert erklären.
- **Spezifikation:** Ein 900 Wörter umfassender Abschnitt, der die Stiftzuhaltung und Toleranzen in gleichschließenden Systemen mikroskopisch genau beschreibt.

### Idee 34: Lokale Sicherheits-Statistiken einbinden
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/standorte/[city]/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Lokalisierter Trust-Content.
- **Spezifikation:** Automatische Anreicherung der Standortseiten mit 850 Wörtern spezifischem Content zur lokalen Sicherheitslage und empfohlenen Präventivmaßnahmen.

### Idee 35: Umfassender Guide für verlorene Autoschlüssel
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/service-article.tsx`
- **Beschreibung:** Der ultimative Notfall-Guide.
- **Spezifikation:** Ein 1500-Wörter Leitfaden über rechtliche Schritte, Versicherungskommunikation und technische Lösungen bei komplettem Schlüsselverlust.

### Idee 36: Spezifikation der Frästechniken
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/profilschnitt.tsx`
- **Beschreibung:** CNC-Fräsen transparent gemacht.
- **Spezifikation:** 800 Wörter technischer Content, der Laserfräsen vs. traditionelles Fräsen vergleicht, inklusive Toleranzgrenzen im Mikrometer-Bereich.

### Idee 37: Aufklärung über Smart-Key Hacking (Relay Attacks)
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/smart-key/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Awareness schaffen und Lösungen bieten.
- **Spezifikation:** Ein 950-Wörter-Text, der Relay-Attacken technisch dekonstruiert und kryptografische Schutzmechanismen moderner Smart-Keys erklärt.

### Idee 38: Die Physik des Einbruchs
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Ziel-Komponente:** `src/components/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`
- **Beschreibung:** Wissenschaftliche Betrachtung von Hebelkräften.
- **Spezifikation:** Ein 850 Wörter umfassender Exkurs über physikalische Kräfte bei Aufbruchversuchen und wie verschiedene Materialien (z.B. gehärteter Stahl) diesen widerstehen.

### Idee 39: Zertifizierungs-Guide (VdS, DIN, SKG)
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/vertrauen/nachweise-liste.tsx`
- **Ziel-Komponente:** `src/components/vertrauen/nachweise-liste.tsx`
- **Beschreibung:** Bedeutung der Prüfsiegel detailliert aufschlüsseln.
- **Spezifikation:** 1100 Wörter, die genau aufschlüsseln, welche Testverfahren einem VdS-Stern zugrunde liegen und was die DIN EN 1303 in der Praxis bedeutet.

### Idee 40: Ausführlicher Ratgeber zur Schließplan-Erstellung
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/schliessanlagen/konfigurator/projekt-konfigurator.tsx`
- **Beschreibung:** Begleitender Text für komplexe Planungen.
- **Spezifikation:** 1200 Wörter Fließtext unterhalb des Konfigurators, der Best-Practices zur Hierarchie-Planung (GHS, HS, Z-Anlagen) praxisnah erklärt.

### Idee 41: Der Lebenszyklus eines Schließzylinders
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Wartung und Verschleiß erklären.
- **Spezifikation:** Ein 800-Wörter Artikel über Materialermüdung bei Neusilber-Schlüsseln, richtige Schmiermittel (Graphit vs. Spezialöl) und Wartungsintervalle.

### Idee 42: Rechtliche Aspekte von Nachschlüsseln
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/page.tsx`
- **Ziel-Komponente:** `src/components/recht/rechtstext.tsx`
- **Beschreibung:** Klärung der Rechtslage für Mieter und Vermieter.
- **Spezifikation:** 900 Wörter tiefgehende juristische Betrachtung (auf Laien-Ebene) bezüglich Sicherungskarten, Eigentumsrechten an Schlüsseln und Meldepflichten.

### Idee 43: Technologie-Vergleich: Transponder-Chips
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/service-article.tsx`
- **Beschreibung:** Megamos, Texas Instruments, NXP im Detail.
- **Spezifikation:** Ein 850-Wörter Technik-Kompendium, das die verschiedenen Chip-Typen (ID48, ID46, etc.), ihre Verschlüsselung (Crypto) und Kopierbarkeit erklärt.

### Idee 44: Leitfaden zur Auswahl der richtigen Schließanlage für Gewerbe
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** B2B-Content mit hohem Mehrwert.
- **Spezifikation:** 1300 Wörter Case-Study-basierter Guide, der mechanische vs. mechatronische Systeme für Bürogebäude gegenüberstellt (inkl. TCO-Betrachtung).

### Idee 45: Notfall-Protokoll: Einbruch, was nun?
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Praktische Schritt-für-Schritt Hilfe.
- **Spezifikation:** Ein extrem detaillierter, 950-Wörter-Aktionsplan, der Spurensicherung, Polizei-Meldung, Notverschalung und psychologische Ersthilfe umfasst.

### Idee 46: Die Psychologie des Sicherheitsgefühls
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Subjektive vs. objektive Sicherheit.
- **Spezifikation:** Ein 800 Wörter umfassender philosophischer und psychologischer Essay über die kognitive Wahrnehmung von Sicherheit in den eigenen vier Wänden.

### Idee 47: Evolution der KFZ-Wegfahrsperren (IMMO)
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/autoschluessel/programmieren/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/service-article.tsx`
- **Beschreibung:** Historischer Deep-Dive der IMMO-Generationen.
- **Spezifikation:** 1100 Wörter, die die Entwicklung von IMMO 1 (Mitte 90er) bis hin zu aktuellen IMMO 5/MQB-Systemen und deren Kryptografie erläutern.

### Idee 48: Materialkunde: Was macht einen guten Schlüssel aus?
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Messing, Stahl, Neusilber im Vergleich.
- **Spezifikation:** 850 Wörter technischer Content über Legierungen, Zugfestigkeit, Abriebfestigkeit und warum bestimmte Schlüssel schneller brechen als andere.

### Idee 49: Integration von Smart-Locks in Smart-Home-Systeme
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/elektronische-zutrittsloesungen/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** KNX, Zigbee, Matter und Co.
- **Spezifikation:** Ein 900-Wörter-Guide zur Vernetzung von elektronischen Zylindern mit Gebäudeautomation, inkl. Latenzen und Sicherheitsprotokollen.

### Idee 50: Mythen-Check: Bekannte Irrtümer über Einbruchschutz
- **Kategorie:** SEMANTIC_AUTHORITY
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Fact-Checking populärer Fehlannahmen.
- **Spezifikation:** 1000 Wörter, die 10 gängige Mythen (z.B. 'Einbrecher kommen nachts') mit aktuellen Polizeistatistiken widerlegen und aufklären.

### Idee 51: Interaktiver Preis-Kalkulator für Autoschlüssel
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/service-einsatz-rechner.tsx`
- **Beschreibung:** Direkte Preis-Transparenz ohne Anfrage.
- **Spezifikation:** Ein mehrstufiger React 19 Rechner (Marke -> Modell -> Baujahr -> Schlüsseltyp), der per Server Action sofort einen verlässlichen Preisrahmen in einem Bento-Grid ausgibt.

### Idee 52: Dynamischer Schließanlagen-ROI-Rechner
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schliessanlagen/page.tsx`
- **Ziel-Komponente:** `src/components/calculator/rechner.test.tsx`
- **Beschreibung:** ROI für elektronische Systeme berechnen.
- **Spezifikation:** Ein Schieberegler-Tool (Mitarbeiteranzahl, Fluktuation), das die Langzeitkosten von Schlüsselverlust bei mechanischen vs. elektronischen Anlagen vergleicht.

### Idee 53: Visueller Zylinder-Maß-Konfigurator
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/visual/interaktiv/zylinder-mass-live.tsx`
- **Beschreibung:** Interaktives Ausmessen der Tür.
- **Spezifikation:** Ein SVG-basiertes Tool, bei dem Nutzer virtuell ein Lineal an eine Tür-Grafik anlegen können, um das benötigte Innen- und Außenmaß (z.B. 30/35) fehlerfrei zu ermitteln.

### Idee 54: Foto-Upload mit KI-Vorauswertung (Simulation)
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Beschreibung:** Gamification des Upload-Prozesses.
- **Spezifikation:** Nach dem Upload eines Schlüsselfotos scannt ein simuliertes Radar-Overlay das Bild, um den Nutzer auf die sofortige Expertenprüfung vorzubereiten (steigert wahrgenommenen Wert).

### Idee 55: Interaktiver Sicherheits-Score für Zuhause
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx`
- **Ziel-Komponente:** `src/components/sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx`
- **Beschreibung:** Nutzer bewerten ihre eigene Sicherheit.
- **Spezifikation:** Ein 5-stufiges Quiz, das am Ende einen Sicherheits-Score (0-100) generiert und passgenaue, kaufbare Upgrades für Schwachstellen (z.B. Kellerschacht) vorschlägt.

### Idee 56: Vorher-Nachher Slider für Türabsicherungen
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/tuer-schutz.tsx`
- **Beschreibung:** Sichtbarer Unterschied von Panzerriegeln etc.
- **Spezifikation:** Ein interaktiver Image-Slider (framer-motion), der eine Standard-Tür einer aufgerüsteten Tür mit Querriegel und Schutzbeschlag gegenüberstellt.

### Idee 57: Reaktives Termin-Buchungs-Grid
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/termin-auswahl.tsx`
- **Beschreibung:** Frictionless Terminfindung.
- **Spezifikation:** Ein Bento-Style Kalender, der verfügbare Zeitslots dynamisch (via useOptimistic) farblich hervorhebt und mit einem Klick reservierbar macht.

### Idee 58: Schlüsselfinder-Quiz
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-vorlage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/option-card.tsx`
- **Beschreibung:** Führt den Kunden zum richtigen Produkt.
- **Spezifikation:** Ein interaktiver Assistent, der mit 3 simplen Fragen (Ist eine Nummer drauf? Form des Kopfes? Bohrmulden?) den exakten Schlüsseltyp identifiziert.

### Idee 59: Live-Ersparnis-Ticker im Warenkorb
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/warenkorb/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Steigert die Dringlichkeit und Freude.
- **Spezifikation:** Ein animierter Ticker, der die Ersparnis gegenüber Vertragswerkstätten (insbesondere bei Autoschlüsseln) in Echtzeit hochzählt.

### Idee 60: Dynamische Progress-Bar in Formularen
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/[slug]/page.tsx`
- **Ziel-Komponente:** `src/components/forms/field.tsx`
- **Beschreibung:** Reduziert Abbruchraten in langen Formularen.
- **Spezifikation:** Eine micro-animierte SVG-Fortschrittsleiste, die sich nicht nur füllt, sondern bei erreichten Meilensteinen Konfetti-ähnliche Partikel abgibt.

### Idee 61: Interaktive Karte des Einsatzradius
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/standorte/page.tsx`
- **Ziel-Komponente:** `src/components/visual/einsatzradius.tsx`
- **Beschreibung:** Sofortige visuelle Bestätigung der Zuständigkeit.
- **Spezifikation:** Eine Vektor-Karte (kein schweres Google Maps iframe), die den Anfahrtsbereich mit einem pulsierenden OKLCH-Radius um das Zentrum darstellt. PLZ-Eingabe liefert sofortiges Feedback.

### Idee 62: Hover-Exploded-View von Schließzylindern
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/stiftzuhaltung.tsx`
- **Beschreibung:** Visualisiert höchste Qualität.
- **Spezifikation:** Beim Hovern über ein Produktbild eines Zylinders explodiert dieses virtuell (SVG-Animation) in seine Einzelteile, um die komplexe Mechanik zu zeigen.

### Idee 63: Notdienst-Dringlichkeits-Button
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/mobile-action-bar.tsx`
- **Beschreibung:** Schnelle Hilfe für Ausgesperrte.
- **Spezifikation:** Ein dedizierter, rot pulsierender (in softer OKLCH-Abstufung) Button in der mobilen Ansicht, der mit einem Klick eine vorpriorisierte Call-Action auslöst.

### Idee 64: Konfigurator für Gleichschließungen (Drag & Drop)
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
- **Beschreibung:** Intuitive Zusammenstellung von Sets.
- **Spezifikation:** Nutzer können Zylinder-Typen (Doppel, Halb, Knauf) per Drag & Drop in virtuelle "Türen" ziehen und Längen direkt an den Türen konfigurieren.

### Idee 65: Tooltip-gestützte Fehlervermeidung in Formularen
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/forms/field.tsx`
- **Beschreibung:** Vermeidet Falschbestellungen bei Codes.
- **Spezifikation:** Wenn ein Code-Format (z.B. "Z1234") abweicht, erscheint ein sanfter Inline-Tooltip, der visuell zeigt, wo auf dem Schlüssel der Code normalerweise steht.

### Idee 66: Vertrauens-Scorecard im Checkout
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/kasse/page.tsx`
- **Ziel-Komponente:** `src/components/vertrauen/nachweise-liste.tsx`
- **Beschreibung:** Verhindert Kaufabbrüche im letzten Schritt.
- **Spezifikation:** Ein kompaktes Bento-Element neben dem Kauf-Button, das verschlüsselte SSL-Verbindung, Trusted Shops Sternchen und schnelle Lieferzeiten kinetisch einblendet.

### Idee 67: Fahrzeugmarken-Schnellfilter
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Ultraschnelle Navigation durch hunderte Modelle.
- **Spezifikation:** Eine sticky Suchleiste mit fuzzy-search und sofortigem, client-seitigem DOM-Filtering der Marken-Logos via React 19 `useTransition`.

### Idee 68: Interaktive Gegenüberstellung: Original vs. Nachbau
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/kopieren/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Qualitätsversprechen visualisieren.
- **Spezifikation:** Eine interaktive Lupe, die der Nutzer über ein Bild bewegen kann, um die identische Verarbeitungsqualität unserer Fräsungen im Makro-Detail zu sehen.

### Idee 69: Gamifizierte Code-Suche
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/code-fundstelle.tsx`
- **Beschreibung:** Erleichtert das Finden versteckter Codes.
- **Spezifikation:** Eine interaktive 3D-Ansicht eines Schlüssels oder Zylinders, die der Nutzer drehen kann, um typische Stanz-Orte für Codes blinkend hervorgehoben zu bekommen.

### Idee 70: Dynamischer Upselling-Slider
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/warenkorb/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** "Das könnte Sie auch interessieren" in schön.
- **Spezifikation:** Ein horizontal scrollbarer Container, der basierend auf dem Warenkorb kontext-sensitive Upgrades (z.B. farbige Schlüsselkappen zu Profilzylindern) anbietet.

### Idee 71: Live-Chat Simulation für Erstberatung
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/service-und-termin/kontakt/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Senkt die Hemmschwelle zur Kontaktaufnahme.
- **Spezifikation:** Ein interaktiver Chat-Wizard (kein echter Bot, sondern vordefinierte Pfade), der durch 3 Klicks das exakte Problem eingrenzt und direkt ein ausgefülltes Kontaktformular vorbereitet.

### Idee 72: Interaktiver Schließanlagen-Planer (Visual Node Graph)
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/schliessanlagen/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/schliessplan.tsx`
- **Beschreibung:** Komplexe Hierarchien einfach zeichnen.
- **Spezifikation:** Ein Node-basiertes UI (ähnlich Figma/Miro), in dem Nutzer Hauptschlüssel und Untergruppen visuell mit Verbindungslinien zusammenklicken können.

### Idee 73: Visuelles Feedback bei erfolgreichem Upload
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/photo-upload.tsx`
- **Beschreibung:** Bestätigt erfolgreiche Interaktionen.
- **Spezifikation:** Statt einfachem Text transformiert sich das Upload-Feld mit einer fließenden SVG-Animation in einen großen, grünen OKLCH-Haken mit Erfolgsmeldung.

### Idee 74: Kontextbezogene Sticky-CTA
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/ratgeber/[slug]/page.tsx`
- **Ziel-Komponente:** `src/components/layout/mobile-action-bar.tsx`
- **Beschreibung:** CTAs, die mitlesen.
- **Spezifikation:** Die Sticky-CTA am unteren Bildschirmrand ändert ihren Text dynamisch, je nachdem, welchen Absatz des Ratgebers der Nutzer gerade liest.

### Idee 75: Echtzeit-Verfügbarkeits-Prüfer für Fahrzeugmodelle
- **Kategorie:** CONVERSION_AND_TOOLS
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Keine falschen Hoffnungen.
- **Spezifikation:** Ein Suchfeld, das per Server Action sofort (ohne Seiten-Reload) mit einem grünen Badge anzeigt, ob wir Schlüssel für exakt dieses Modell nachmachen können.

### Idee 76: Next.js 16+ 'use cache' für Marken-Seiten
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/[make]/page.tsx`
- **Ziel-Komponente:** `src/components/layout/page-header.tsx`
- **Beschreibung:** Ultraschnelle TTFB (Time to First Byte).
- **Spezifikation:** Einsatz der neuen `'use cache'` Direktive in Kombination mit `cacheTag()` für die extrem vielen Automarken-Unterseiten, um diese statisch auf dem Edge auszuliefern.

### Idee 77: CSS Container Queries für Modulare Komponenten
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Weg von unflexiblen Media-Queries.
- **Spezifikation:** Umstellung der Bento-Cards auf `@container`-Queries, sodass sie sich anhand des verfügbaren Platzes ihres Parent-Grids organisieren, statt starr nach Viewport-Breite.

### Idee 78: Zero-Shift Webfont-Optimierung
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/app/(site)/globals.css`
- **Beschreibung:** Verhindert Cumulative Layout Shift (CLS) beim Font-Load.
- **Spezifikation:** Feinjustierung von `size-adjust`, `ascent-override` und `descent-override` in der CSS `@font-face` Deklaration für den Fallback-Font, um exakt die Metriken des Custom-Fonts zu matchen.

### Idee 79: AVIF Hero-Pipelines mit Next/Image
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/ui/bild-flaeche.tsx`
- **Beschreibung:** Halbierung der Bild-Payloads.
- **Spezifikation:** Forcierung des AVIF-Formats in der `next.config.mjs` für alle kritischen LCP-Bilder und Nutzung von `fetchPriority="high"` für Above-the-Fold-Bilder.

### Idee 80: CSS Subgrid Harmonisierung
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/tuer-und-schliesstechnik/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Perfekte Ausrichtung ohne JavaScript-Berechnungen.
- **Spezifikation:** Verwendung von `grid-template-rows: subgrid` über mehrere Ebenen hinweg, um Überschriften, Texte und Buttons in Produkt-Listen auf die exakt gleiche Höhe zu zwingen.

### Idee 81: Entfernung toter Hydration-Zweige
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Beschreibung:** Reduziert TBT (Total Blocking Time).
- **Spezifikation:** Audit und Refactoring von bedingten Render-Trees, die client-seitig re-evaluiert werden, in reine Server Components, wo keine Interaktivität benötigt wird.

### Idee 82: Turbopack-Optimierung für lokale Entwicklung
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/layout.tsx`
- **Beschreibung:** Bessere DX (Developer Experience).
- **Spezifikation:** Anpassung von Import-Aliasen und Bereinigung zyklischer Abhängigkeiten, um die HMR-Zeiten (Hot Module Replacement) unter Turbopack auf <100ms zu drücken.

### Idee 83: Form-State Management via useActionState
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/service-und-termin/anfrage/page.tsx`
- **Ziel-Komponente:** `src/components/forms/formular-schutz.tsx`
- **Beschreibung:** Vermeidet schwergewichtige Client-Libs wie React Hook Form für simple Formulare.
- **Spezifikation:** Umbau der Kontaktformulare auf native React 19 `useActionState` für schlankeres Bundle und direkte Server-Validierung.

### Idee 84: Intersection Observer für Heavy Components
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/visual/motion/in-view.tsx`
- **Beschreibung:** Lazy-Loading von interaktiven Modulen.
- **Spezifikation:** Konfiguratoren und SVG-Generatoren weiter unten auf der Seite werden dynamisch via `next/dynamic` geladen, sobald sie in den Viewport kommen.

### Idee 85: Strict TypeScript Enforcements für Props
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Verhindert Runtime-Errors und verbessert DX.
- **Spezifikation:** Ersetzen aller `any`- oder impliziten Typen in den UI-Komponenten durch extrem strikte Interfaces, keine Verwendung von Enums, sondern `as const` Maps.

### Idee 86: Fluid Typography mit CSS `clamp()`
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/app/(site)/globals.css`
- **Beschreibung:** Weniger Media-Queries, stufenloses Scaling.
- **Spezifikation:** Überarbeitung der Typografie-Tokens in Tailwind auf native `clamp(min, vw, max)` Funktionen, um ein perfekt stufenloses Skalieren der Schriften zwischen Mobile und Desktop zu garantieren.

### Idee 87: Optimistic UI für Warenkorb-Interaktionen
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/warenkorb/page.tsx`
- **Ziel-Komponente:** `src/components/ui/card.tsx`
- **Beschreibung:** Null wahrgenommene Latenz.
- **Spezifikation:** Einsatz von React 19 `useOptimistic` beim Ändern von Artikel-Anzahlen im Warenkorb, um den UI-State sofort zu aktualisieren, bevor die Server-Bestätigung eintrifft.

### Idee 88: Brotli/Gzip Kompressions-Check
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/layout.tsx`
- **Beschreibung:** Minimale Netzwerk-Payloads.
- **Spezifikation:** Sicherstellung, dass der Next.js Server alle Text-basierten Assets (JS, CSS, HTML, JSON) zwingend mit Brotli-Kompression ausliefert.

### Idee 89: Inline Critical CSS
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Beschreibung:** Verhindert Flash of Unstyled Content (FOUC).
- **Spezifikation:** Next.js Konfiguration optimieren, um sicherzustellen, dass kritische OKLCH-Farb-Variablen und Layout-CSS im `<head>` inlined werden.

### Idee 90: Memoisierung teurer SVG-Generatoren
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/schluessel-nach-code/page.tsx`
- **Ziel-Komponente:** `src/components/visual/generators/schluessel.tsx`
- **Beschreibung:** Verhindert CPU-Spikes bei Re-Rendern.
- **Spezifikation:** Kapselung der rechenintensiven Pfad-Generierungen für Schlüssel-Grafiken in `React.memo` mit striktem Custom-Comparator für Props.

### Idee 91: Preloading von wichtigen API-Routen
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/page.tsx`
- **Ziel-Komponente:** `src/components/layout/site-header.tsx`
- **Beschreibung:** Wartezeiten bei Navigation reduzieren.
- **Spezifikation:** Wenn ein Nutzer über den "Autoschlüssel" Link im Menü hovert, wird ein Prefetch der dahinterliegenden Daten-Struktur initiiert.

### Idee 92: Reduzierung der DOM-Tiefe in Listen
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/page.tsx`
- **Ziel-Komponente:** `src/components/layout/summary-list.tsx`
- **Beschreibung:** Verbessert Parsing- und Render-Zeiten.
- **Spezifikation:** Refactoring der Marken-Liste, um unnötige `<div>`-Wrapper zu entfernen und eine flachere Struktur mit nativen Grid-Gaps zu nutzen.

### Idee 93: Service Worker für Offline-Fallback
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/layout/layout.tsx`
- **Beschreibung:** Resilienz bei schlechter Verbindung.
- **Spezifikation:** Implementierung eines simplen Service Workers, der grundlegende Kontaktdaten und die Notrufnummer cached, falls der Nutzer offline geht.

### Idee 94: Asynchrone Params-Auflösung in Server Components
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx`
- **Ziel-Komponente:** `src/components/layout/page-header.tsx`
- **Beschreibung:** Next.js 16+ Compliance.
- **Spezifikation:** Striktes Refactoring aller Page-Komponenten, die dynamische Routen nutzen, um `params` und `searchParams` via `await` aufzulösen, um Warnungen und Performance-Lags zu vermeiden.

### Idee 95: Payload CMS Query-Optimierung
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/ratgeber/page.tsx`
- **Ziel-Komponente:** `src/components/layout/section.tsx`
- **Beschreibung:** Schnellerer Abruf von Blog-Inhalten.
- **Spezifikation:** Nutzung von `depth: 0` oder `depth: 1` bei Payload CMS Queries, um Über-Fetching von Relationen zu verhindern, gepaart mit gezieltem GraphQL-Feld-Selection.

### Idee 96: Isolierte CSS-Scopes für interaktive Module
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx`
- **Ziel-Komponente:** `src/components/gleichschliessende-zylinder/konfigurator/konfigurator.tsx`
- **Beschreibung:** Verhindert CSS-Leakage und reduziert Parser-Arbeit.
- **Spezifikation:** Strikte Nutzung von CSS-Modulen (`.module.css`) für hochspezifische, komplexe Konfiguratoren anstatt globalem Tailwind für jede Mini-Klasse.

### Idee 97: Server-Side Schema.org Generierung
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/layout.tsx`
- **Ziel-Komponente:** `src/components/seo/json-ld.tsx`
- **Beschreibung:** Bessere SEO und Performance.
- **Spezifikation:** Konstruktion des JSON-LD Graphen komplett auf dem Server und Injection als statischer String in den `<head>`, gesichert durch `schema-dts`.

### Idee 98: Verzicht auf schwere Date-Libraries
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/service-und-termin/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/termin-auswahl.tsx`
- **Beschreibung:** Reduziert Bundle-Size signifikant.
- **Spezifikation:** Entfernung von Libraries wie `moment.js` oder `date-fns` zugunsten nativer `Intl.DateTimeFormat` APIs für die Datumsformatierung im Terminkalender.

### Idee 99: Dedizierte Error-Boundaries pro Sub-Route
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/app/(site)/error.tsx`
- **Beschreibung:** Verhindert das Abstürzen der ganzen App.
- **Spezifikation:** Platzierung von granularen `error.tsx` Dateien in kritischen Routen (wie dem Checkout), um fehlschlagende Komponenten isoliert abzufangen.

### Idee 100: Wegfall von `useEffect` für Daten-Fetching
- **Kategorie:** EXTREME_PERFORMANCE
- **Ziel-Route:** `src/app/(site)/autoschluessel/page.tsx`
- **Ziel-Komponente:** `src/components/autoschluessel/schluesselarten-reihe.tsx`
- **Beschreibung:** Moderner, performanter React-Code.
- **Spezifikation:** Audit aller Client-Komponenten und rigoroses Ersetzen von `useEffect`-basiertem Data-Fetching durch Server Components oder den neuen `use` Hook (React 19) in Kombination mit Suspense.
