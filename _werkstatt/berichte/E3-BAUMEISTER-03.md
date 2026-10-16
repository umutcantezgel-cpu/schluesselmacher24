# E3-BAUMEISTER-03 · Berichte aus Workflow wf_a39c6e70-8a1

## Bau E3-BAUMEISTER-03
GEÄNDERTE DATEIEN
- src/components/forms/photo-upload.tsx

WAS UND WARUM
Foto-Upload auf Tokens, SM24-Glyphen und 44-px-Ziele gebracht. Logik, Hooks, Handler, Props, Typen, Texte mit Inhalt und aria-Bedeutungen blieben unverändert. Der Logikwächter meldet die Datei als „gleich“.
- Icons: lucide-react durch SM24-Glyphen ersetzt (Kamera, Haken, Bild hochladen, Laden, Zurücksetzen, Papierkorb) plus GlyphWarnung für den Fehlerzustand. Größen liegen im Bereich 14–18.
- Freie Werte nach K-005a: min-h-[44/46px] → min-h-touch (2 + 2 + 1 Vorkommen), min-w-[44px] → min-w-touch, text-[11px] → text-caption, text-[13px] → text-small, text-[15px] → text-body. Zusätzlich text-sm → text-small (Feldtitel) und text-xs → text-caption (PDF-Kachel).
- Großbuchstaben-Zeilen (Beispiel-Überschrift, PDF-Kachel) bekommen font-mono uppercase tracking-label. Das Maß „Max. 12.0 MB“ bekommt font-mono tabular-nums.
- Zustände: Der Fehler (Gesamtfehler und Fehler je Datei) trägt GlyphWarnung und text-danger. Der Ladezustand nutzt GlyphLaden mit animate-spin und motion-reduce:animate-none. Hover bleibt bei hover:. Es gibt kein neues Client-JavaScript und keine neue Bewegung.

Alt-Neu-Liste
- Import lucide-react → Glyph-Importe (kamera, haken, bild-hochladen, laden, zuruecksetzen, papierkorb, warnung)
- Feldtitel: text-sm → text-small
- Beschreibung: text-[13px] → text-small
- Beispiel-Überschrift: text-[11px] font-semibold uppercase tracking-wider → font-mono text-caption font-semibold uppercase tracking-label
- Button Foto aufnehmen: min-h-[46px] → min-h-touch; text-[15px] → text-body; Camera 17 → GlyphKamera 18
- Button Galerie: min-h-[46px] → min-h-touch; text-[15px] → text-body; ImageUp 17 → GlyphBildHochladen 18
- Hinweis Max-Größe: text-[11px] → text-caption; font-mono tabular-nums ergänzt
- PDF-Kachel: text-xs → text-caption; font-mono uppercase tracking-label ergänzt
- Dateiname: text-[11px] → text-caption
- Entfernen: min-h-[44px] min-w-[44px] → min-h-touch min-w-touch; Trash2 14 → GlyphPapierkorb 14
- Statuszeile: text-[11px] → text-caption
- Laden: Loader2 13 → GlyphLaden 14
- Fertig: Check 13 → GlyphHaken 14
- Fehler je Datei: GlyphWarnung 14 vor dem Text, Text in span gewickelt
- Erneut versuchen: min-h-[44px] → min-h-touch; RotateCcw 13 → GlyphZuruecksetzen 14
- Gesamtfehler: text-[13px] → text-small; GlyphWarnung 16 vor dem Text

GEMEINSAME DATEIEN
- #fff in verkleinern() (Zeile 102, Canvas-Hintergrund beim JPEG-Verkleinern). Kein Designtoken, Teil der Logik. Bleibt unverändert, begründet im Code-Kommentar der Funktion.
- Keine gemeinsamen Dateien geändert (globals.css, tailwind.config.ts, cn.ts, Registry, Layout unberührt).

PRÜFUNG UND ERGEBNIS
- Logikwächter (`node _werkstatt/werkzeuge/logikwaechter.mjs pruefen src/components/forms/photo-upload.tsx`): Basis b49fe04bf70a67390029216bac7f3606569de3c5, Dateien 1, abweichend 0, Ergebnis gleich.
- lucide-Grep: kein Treffer.
- Werte-Suche: 1 Fund (#fff, Zeile 102, begründet siehe Gemeinsame Dateien). Protokoll: /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_05-21-54.json. Die übrigen Treffer der Suche waren Fehlalarme, weil text-sm in text-small enthalten ist.
- ESLint auf die Datei: ohne Befund.
- tsc --noEmit: keine Fehler in photo-upload.tsx. Ein Fehler in fremder Datei: src/components/visual/interaktiv/fraesbahn-bewegung.test.ts(107,72) (TS2769).
- vitest run src/components: 733 von 734 bestanden. Ein Fehler in fremder Datei: src/components/autoschluessel/schluesselarten-reihe.test.tsx, Erwartung 4 Vorkommen von sm24-reveal, erhalten 8. Die Datei importiert photo-upload nicht.
- Keine Tests geändert oder gelockert; die Prüfungszahl ist unverändert.
- Messfenster: /tmp/sm24-messfenster.lock nicht vorhanden. Build, Test und Bilder liefen ohne Sperre.
- Bilder: Entwicklungsserver Port 3001, HTTP 200. Route /schluessel-nach-vorlage/anfrage, mobil und Desktop, sichtbarer Upload-Bereich geprüft.
- Schnellprüfung /autoschluessel/anfrage: nicht durchgeführt, weil dafür kein Skript-freier Zugang bestätigt wurde.
- Keine Dateien gelöscht. Kein Commit, kein Push.

BILDBELEGE
- /root/sm24-bilder/E3-BAUMEISTER-03/schluessel-nach-vorlage-anfrage__mobil.jpg (Ausschnitt, mobil)
- /root/sm24-bilder/E3-BAUMEISTER-03/schluessel-nach-vorlage-anfrage__desktop.jpg (Ausschnitt, Desktop)
- /root/sm24-bilder/E3-BAUMEISTER-03/ganz-mobil__mobil__ganz.jpg (ganze Seite, mobil)
- /root/sm24-bilder/E3-BAUMEISTER-03/ganz-desktop__desktop__ganz.jpg (ganze Seite, Desktop)
- Protokolle: /root/sm24-bilder/E3-BAUMEISTER-03/bild-mobil.json, bild-desktop.json, bild-ganz-mobil.json, bild-ganz-desktop.json
- Befund: Die Icons sind korrekt gerendert, die Abstände gleichmäßig, nichts abgeschnitten, kein Überlauf. Die untere Aktionsleiste im mobilen Vollbild liegt über dem Inhalt; das ist das fixierte Element der Seite und nicht Teil dieses Pakets.

OFFENE FRAGEN
1. Ziehen/Ablegen-Fläche: Die Datei hat keine Drag-and-Drop-Fläche, nur zwei Buttons (Kamera, Galerie) mit versteckten Datei-Eingaben. Der sichtbare Fokus liegt auf den Buttons (globaler Ring über :focus-visible). fokus-innen: wurde nicht gesetzt, weil kein Karten-Element ein verstecktes Eingabefeld enthält. Bitte bestätigen.
2. Fokus-, Fehler- und Ladezustand sind im Code umgesetzt, aber nicht visuell belegt. Dafür müsste ein Foto gewählt werden, was im Bild-Werkzeug ohne Dateieingabe nicht möglich ist. Bitte im Browser gegenprüfen.
3. Außerhalb meines Auftrags, gemeldet nicht behoben: tsc-Fehler in fraesbahn-bewegung.test.ts (Zeile 107) und ein fehlgeschlagener Test in schluesselarten-reihe.test.tsx.

=== ENDE E3-BAUMEISTER-03 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-03 R1
**Urteil:** bestanden
- hinweis: Schritt 4 nennt eine Ziehen/Ablegen-Fläche mit Fokus. Die Datei hat keine solche Fläche, nur zwei Buttons (src/components/forms/photo-upload.tsx Zeilen 315–330) und versteckte Eingaben außerhalb der Karte (Zeilen 339–357). Der sichtbare Fokus liegt auf den Buttons über den globalen :focus-visible-Ring; fokus-innen: ist daher nicht nötig. Eine Ablegefläche wurde nicht ergänzt, das wäre neues Verhalten. Bitte bestätigen, dass Schritt 4 so gemeint ist.
- hinweis: Fehler-, Lade- und Fokuszustand sind im Code umgesetzt (Zeilen 386, 394, 407, 416, 430–431), aber nicht visuell belegt. Die Bildwerkzeuge können keine Datei auswählen. Im Browser mit einem echten Foto gegenprüfen.
- hinweis: Werte-Suche meldet einen Fund: #fff in verkleinern() (Zeile 102). Der Fund ist im Bericht als Gemeinsame Datei begründet und im Code kommentiert (Zeile 101). Kein Verstoß, aber kein Designtoken.
- hinweis: Im mobilen Vollbild liegt die fixierte Aktionsleiste über dem Inhalt. Sie gehört nicht zu diesem Paket.
- hinweis: Schnellprüfung /autoschluessel/anfrage (Schritt Fotos Ihres Schlüssels) wurde nicht ausgeführt. Der Schritt im Paket ist ausdrücklich optional.
- hinweis: Die Schritte-Prüfung kann nicht belegen, dass die Muster-Dateien (button.tsx, breadcrumbs.tsx, mobile-action-bar.tsx, page-header.tsx) vor dem Start gelesen wurden. Das ist ein Prozessschritt und kein Befund am Code.

**Schritte:** Schritt 1 (lesen, Muster): erfüllt im Ergebnis. Die Datei ist vollständig gelesen und die Stellen mit lucide und freien Werten sind im Diff nachvollziehbar. Ob die Muster-Dateien gelesen wurden, lässt sich nicht prüfen (siehe Befund). Geänderte Dateien: git status zeigt viele fremde Änderungen; photo-upload.tsx ist die einzige Datei dieses Pakets. Keine Datei dieses Pakets ist gelöscht, nichts committet.

Schritt 2 (Icons): erfüllt. Importe in Zeilen 4–10 (GlyphBildHochladen, GlyphHaken, GlyphKamera, GlyphLaden, GlyphPapierkorb, GlyphWarnung, GlyphZuruecksetzen) entsprechen der Zuordnung. Größen 14, 16 und 18 (Zeilen 320, 328, 379, 394, 400, 407, 416, 431). Kein strokeWidth-Prop. lucide-Grep ohne Treffer. Die Glyph-Dateien existieren unter src/components/visual/glyphen/ und nehmen size und className an (IconBase).

Schritt 3 (freie Werte): erfüllt. Kein min-h-[..px], min-w-[..px], text-[..px], text-sm, text-xs oder tracking-wider mehr in der Datei. Neu: min-h-touch in Zeilen 318, 326, 377, 414; min-w-touch in Zeile 377; text-caption in Zeilen 303, 331, 368, 373, 386; text-small in Zeilen 289, 297, 430; text-body in Zeilen 318, 326. Zusätzlich font-mono, uppercase, tracking-label und tabular-nums an den im Paket genannten Stellen.

Schritt 4 (Zustände): teilweise erfüllt, mit Hinweis. Hover über hover: erhalten (Zeilen 318, 326, 377, 414). Fehler: GlyphWarnung je Datei (407) und Gesamtfehler (431), text-danger über Zeile 386 und Zeile 430. Laden: GlyphLaden mit animate-spin und motion-reduce:animate-none (394). Fokus: siehe Befund zur fehlenden Ablegefläche. Keine neue Bewegung oder neues Client-JavaScript im Diff.

Schritt 5 (Logikwächter): erfüllt. Ausgabe: Basis b49fe04bf70a67390029216bac7f3606569de3c5, Dateien 1, abweichend 0, photo-upload.tsx gleich. Zusätzlich im Diff geprüft: Hooks, Handler, Konstanten, fetch und Typen sind unverändert. Die Änderungen liegen nur in Markup, className, JSX-Text und Icon-Importen.

Schritt 6 (Schnellprüfung): erfüllt mit Notizen. Siehe Prüfungen und Befunde. Die Bilder sind erstellt und angesehen."}]

**Prüfungen:** PROFIL: Prüfstufe A, Runde 1, Paket E3-BAUMEISTER-03. Keine Projektdatei geändert, nichts gelöscht, nicht committet.

1. git status: photo-upload.tsx ist geändert, sonst nur fremde Dateien aus anderen Paketen. Keine Datei aus den Schreibrechten fremd geändert.

2. Props-Verträge: Exporte PickedFile, uploadsAbwarten, alsUpload und PhotoUpload sowie PhotoUploadProps und die Destrukturierung mit Standardwerten (required=false, multiple=false, maxFiles=4, allowDocuments=false) sind gegen HEAD identisch (diff der Blöcke). Importeure: 6 Dateien (service-und-termin/anfrage/anfrage-formular.tsx, sicherheitstechnik/sicherheitscheck/sicherheitscheck.tsx, schliessanlagen/konfigurator/projekt-konfigurator.tsx, schluessel-nach-vorlage/anfrage/anfrage-formular.tsx, schluessel-nach-code/[slug]/bestell-formular.tsx, autoschluessel/anfrage/assistent.tsx) importieren unverändert PhotoUpload, alsUpload, uploadsAbwarten, type PickedFile.

3. Schnellprüfung (aktueller Stand bei meinem Lauf):
- npx tsc --noEmit: Exit 0, keine Ausgabe (0 Fehler, auch nicht in fraesbahn-bewegung.test.tsx; der Baumeister hatte dort 1 Fehler gemeldet, der jetzt nicht mehr auftritt).
- npx eslint src/components/forms/photo-upload.tsx: Exit 0, keine Ausgabe.
- npx vitest run src/components: 24 Testdateien bestanden, 734 von 734 Tests grün (der Baumeister hatte 733 von 734 gemeldet; der Fehler in schluesselarten-reihe.test.tsx ist jetzt behoben). Keine Tests geändert.
- werte-suche.mjs src/components/forms/photo-upload.tsx: 1 Fund, #fff Zeile 102, Ausnahme nicht aufgeführt, Protokoll /home/user/schluesselmacher24/_werkstatt/protokolle/werte-suche-2026-10-16_05-26-59.json.
- grep lucide-react: kein Treffer.
- logikwaechter.mjs pruefen: gleich, abweichend 0.
- Messfenster /tmp/sm24-messfenster.lock: nicht vorhanden, Prüfungen liefen ohne Sperre.
- Entwicklungsserver Port 3001: HTTP 200 für /schluessel-nach-vorlage/anfrage.
