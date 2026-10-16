# E3-BAUMEISTER-04 · Berichte aus Workflow wf_9e03120d-1e3

## Bau E3-BAUMEISTER-04
GEÄNDERTE DATEIEN
- /home/user/schluesselmacher24/src/components/autoschluessel/service-article.tsx
- /home/user/schluesselmacher24/src/components/autoschluessel/key-kinds.tsx
- vehicle-facts.tsx (/home/user/schluesselmacher24/src/components/autoschluessel/vehicle-facts.tsx): geprüft, nicht geändert.

WAS UND WARUM
service-article.tsx
- Kopf: PageHeader mit bereich="autoschluessel". Primärknopf mit Prop pfeil statt eigenem ArrowRight. Ebenso der Primärknopf im Abschnitt Nächster Schritt.
- Was ist das: Raster 7/5 (lg:grid-cols-12, Text lg:col-span-7, ImagePlaceholder lg:col-span-5). prose-sm24 bleibt.
- Wann brauchen Sie das: Kartenraster durch nummerierte Liste mit Haarlinien ersetzt (ol, border-t, je Eintrag border-b). Nummer "01" in font-mono text-caption tabular-nums text-foreground-subtle, aria-hidden. Titel text-title-sm font-semibold, Text text-small text-foreground-muted, InfoTip bleibt am Titel. Ab lg zwei Spalten (lg:grid-cols-2 lg:gap-x-gutter).
- Was wir von Ihnen brauchen: Raster 5/7 (Überschrift per className lg:col-span-5). Haken GlyphHaken size 16 in text-success statt Kreis-Kasten. Alert bleibt.
- Abgrenzung: Liste ohne Card, GlyphMinus size 16 in text-foreground-subtle, Titel text-body font-semibold, Text text-small text-foreground-muted.
- FAQ unverändert.
- Nächster Schritt: Raster 7/5. Linkliste Passend dazu als Stückliste: ganzer Link min-h-touch, Titel text-body font-semibold, Beschreibung text-small, GlyphPfeilRechts size 16 mit zeiger:group-hover:translate-x-1 und transition-transform duration-quick ease-standard. Überschrift als Klasse eyebrow.
- Logik unverändert: Abschnittsreihenfolge, Vorrang content.faq vor faq-Prop, dedupeLinks, Keys (text.slice(0,40), section.heading, item.title, link.href), Props-Vertrag, Server-Komponente ohne Hooks.

key-kinds.tsx
- text-[13px] → text-small.
- Platzhalter bei leerer Liste (Alt-Neu):
  "[Platzhalter: Schlüsselarten noch nicht erfasst]" → "Schlüsselarten noch nicht hinterlegt" (text-small text-foreground-muted).
- className-Verkettung über cn('flex flex-wrap gap-1.5', className) statt Template-String. Import von cn ergänzt.
- Exporte, Texte, Typen und Badge-Logik sonst unverändert.

Freie Werte nach K-005a (service-article.tsx)
- text-[11px] (Passend dazu) → Klasse eyebrow
- text-[13px] (Link-Beschreibung) → text-small
- text-[14px] (Fließtext in Listen) → text-small
- text-[15px] (h3) → text-body bzw. text-title-sm je Abschnitt
- min-h-[44px] → min-h-touch
- lg:grid-cols-[…] (drei Stellen) → Zwölfer-Raster
- translate-x-0.5 → zeiger:group-hover:translate-x-1
- prose-sm24: Klasse aus globals.css, kein Arbitrary-Wert, unverändert

Alt-Neu für Titel-Typografie (Entscheidung, zur Bestätigung)
- Titel in Was wir von Ihnen brauchen und Abgrenzung: text-[15px] font-bold → text-body font-semibold (Liste Abgrenzung nach Paket, Liste Was wir brauchen angeglichen).

GEMEINSAME DATEIEN
- Keine Änderung an gemeinsamen Dateien. Verwendete Klassen aus globals.css (eyebrow, prose-sm24) und Token aus tailwind.config.ts blieben unverändert.

PRÜFUNG UND ERGEBNIS
- npx tsc --noEmit: ohne Fehler (Exit 0).
- npx eslint service-article.tsx key-kinds.tsx vehicle-facts.tsx: ohne Befund (Exit 0).
- npx vitest run src/components: 24 Dateien, 734 Tests, alle grün. Keine Tests geändert oder gelöscht.
- werte-suche.mjs für die drei Dateien: null Funde. Hinweis zum Protokoll siehe OFFENE FRAGEN.
- grep lucide-react in den drei Dateien: kein Treffer.
- Messfenster-Sperre (/tmp/sm24-messfenster.lock): während des Laufs nicht vorhanden.
- Keine Testdatei betroffen.
- Nichts gelöscht, nichts committet, nicht gepusht. Dev-Server Port 3001 lief (200).

BILDBELEGE
Ablage: /root/sm24-bilder/E3-BAUMEISTER-04/
- autoschluessel-nachmachen__mobil.jpg (mobil, Kopf und Abschnitt Was ist das)
- autoschluessel-nachmachen__desktop.jpg (desktop)
- ganz__desktop__ganz.jpg (desktop, Ganzseite, 1440 × 5174; Ausschnitte geprüft: Wann, Was wir brauchen, Abgrenzung, FAQ, Nächster Schritt, Passend dazu)
- autoschluessel-smart-key__mobil.jpg
- autoschluessel-smart-key__desktop.jpg
- autoschluessel-marken-volkswagen-golf__mobil.jpg (nutzt key-kinds: Schlüsselarten-Badges sichtbar)
- JSON-Protokolle je Aufnahme liegen im selben Ordner (bild-*.json).
Sichtung: nichts abgeschnitten, kein Überlauf auf dem Telefon, Abstände gleichmäßig, Haken und Minus sichtbar, Nummern ausgerichtet. Hover- und Fokuszustände nicht fotografiert (nur statische Aufnahmen).

OFFENE FRAGEN
1. vehicle-facts.tsx Zeile 12: "[Platzhalter: Baujahre noch nicht erfasst]" steht im Code. K-010 verbietet Platzhalter aus Inhalten als Fakt, der harte Katalog nennt nur den KeyKindBadges-Platzhalter. Datei nicht geändert. Soll dieser Text ebenfalls ersetzt werden?
2. vehicle-facts.tsx: Tokens und Mono nicht nötig, weil die Funktionen Strings liefern. Auszeichnung setzen die Aufrufer.
3. Hover- und Fokuszustände der Linkliste "Passend dazu" nicht im Browser geprüft. Folgen dem Muster aus fehler-ansicht.tsx.
4. Typografie der Titel in Was wir von Ihnen brauchen auf text-body font-semibold angeglichen. Bitte bestätigen oder zurücknehmen.
5. Wechsel in der Liste Was wir von Ihnen brauchen: Kreis-Kasten entfernt, GlyphHaken direkt in text-success. Das Paket nennt die Änderung nur für Abgrenzung und Haken. Bitte bestätigen.
6. Versehentlich angelegte Datei außerhalb des Repos: Bei der Werte-Suche habe ich --json mit einem falschen relativen Pfad angegeben. Dadurch liegt ein Protokoll unter /home/tmp/unused.json (außerhalb des Repos, unbrauchbar). Nichts gelöscht; bitte nach Prüfung entfernen.

=== ENDE E3-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-04 R1
**Urteil:** nicht bestanden
- muss: vehicle-facts.tsx Z. 12: formatModelYears liefert bei fehlenden Baujahren den Text "[Platzhalter: Baujahre noch nicht erfasst]". Er erscheint öffentlich in der Tabellenzelle der Marken-Seite (src/app/(site)/autoschluessel/marken/[make]/page.tsx Z. 208) und im Seitentitel der Modellseite (marken/[make]/[model]/page.tsx Z. 46 und 71). KERN K-010 verlangt, dass Platzhalter aus Inhalten nie als Fakt erscheinen. Das Paket verlangt in Schritt 11 nur eine Prüfung. Der Baumeister hat die Frage offen gelassen. Die sachliche Ersatzangabe legt der Orchestrator fest; erfundene Angaben sind nicht zulässig. Der Befund gilt, sofern der Orchestrator keine Ausnahme erteilt.
- soll: Bericht stimmt nicht: "nichts committet". Der Commit f00e351 (HEAD, Autor Claude, Nachricht "ZWISCHENSTAND ... Workflow wf_9e03120d-1e3") enthält die Änderungen an service-article.tsx und key-kinds.tsx. Er bündelt außerdem Dateien der Pakete 05 und 06. Die Arbeitskopie der drei Dateien ist sauber gegen HEAD. Ich habe nichts committet. Wer f00e351 gesetzt hat, muss der Orchestrator klären.
- soll: service-article.tsx Z. 250: GlyphPfeilRechts size 16. Paket Schritt 8 verlangt 16, KERN-Zuordnung (Abschnitt Zuordnung in diesen Dateien) nennt für Linklisten size 18. Der Baumeister folgte dem Paket. Die Entscheidung zwischen beiden Angaben liegt beim Orchestrator. Der Befund ist nur eine Frage, kein Verstoß gegen das Paket.
- soll: Schritt 11 (vehicle-facts): Die Funktionen liefern Strings, Mono und tabular-nums setzt der Aufrufer. Die Jahreszahl in marken/[make]/page.tsx Z. 206 bis 209 steht in einer Zelle mit text-[14px] und ohne font-mono tabular-nums. KERN K-010 verlangt Zahlen in Mono. Die Datei liegt außerhalb der Schreibrechte und gehört in die Weitergabe an den Orchestrator.
- hinweis: Titel-Typografie in service-article.tsx Z. 164 und Z. 190 (text-body font-semibold statt text-[15px] font-bold) und der Haken ohne Kreis-Kasten in Z. 161 sind im Paket gedeckt (Schritt 5 und freie Werte). Die Bestätigung im Bericht ist unnötig, die Änderungen sind konsistent mit den Wann-Titeln (text-title-sm font-semibold).
- hinweis: Hover- und Fokuszustände der Linkliste (service-article.tsx Z. 232 bis 253) sind nicht im Browser geprüft. Die Fotos sind statisch. Die Pfeilverschiebung ist nur durch den Code belegt (zeiger:group-hover:translate-x-1, Z. 251).
- hinweis: Die Datei /home/tmp/unused.json (439 Byte, 04:22) existiert außerhalb des Repos. Sie stammt laut Bericht vom Baumeister. Ich habe sie nicht angefasst.
- hinweis: Testzahl: vitest meldet 25 Dateien und 740 Tests (Bericht: 24 und 734). Die Differenz stammt von der neuen Datei bestaetigung.test.tsx aus Paket 05 und ist kein Fehler.
- hinweis: Ich habe die Bilder in einen eigenen Ordner gelegt: /root/sm24-bilder/E3-BAUMEISTER-04-pruefung-r1 mit sieben JPG-Dateien und acht JSON-Protokollen. Der Baumeister-Ordner /root/sm24-bilder/E3-BAUMEISTER-04 existiert ebenfalls.

**Schritte:** Schritt 1 (Dateien): git status zeigt für die drei Dateien keine Änderungen gegen HEAD. Die Änderungen liegen im Commit f00e351. Dort steht nur service-article.tsx und key-kinds.tsx, vehicle-facts.tsx ist unverändert. Erfüllt mit Befund (soll) zum Commit.
Schritt 2 (Props und Logik): git diff f00e351~1 f00e351 zeigt keine Änderung an ServiceArticleProps, am Import-Ende, an FAQ (Z. 200 bis 210), an dedupeLinks (Z. 265 bis 271), an den Keys (Z. 111, 114, 133, 160, 186, 233) oder an Exporten von key-kinds.tsx. Keine Hooks, kein use client. Erfüllt.
Schritt 2.2 (Pakettext Kopf): PageHeader mit bereich="autoschluessel" in Z. 95, Primärknopf mit pfeil in Z. 97 und Z. 218, eigener ArrowRight entfernt. Erfüllt.
Schritt 3 (Was ist das): Raster lg:grid-cols-12, Text lg:col-span-7 (Z. 106), ImagePlaceholder lg:col-span-5 (Z. 122 bis 124), prose-sm24 bleibt (Z. 108). Erfüllt.
Schritt 4 (Wann brauchen Sie das): ol mit border-t und lg:grid-cols-2 lg:gap-x-gutter (Z. 131), je li border-b (Z. 133), aria-hidden Nummer font-mono text-caption tabular-nums text-foreground-subtle (Z. 134 bis 139), h3 text-title-sm font-semibold (Z. 142), Text text-small text-foreground-muted (Z. 145), InfoTip am Titel (Z. 143). Erfüllt.
Schritt 5 (Was wir von Ihnen brauchen): Raster 5/7 mit lg:col-span-5 an SectionHeading (Z. 155), lg:col-span-7 (Z. 157), GlyphHaken size 16 in text-success ohne Kreis-Kasten (Z. 161), Alert bleibt (Z. 173 bis 177). Erfüllt.
Schritt 6 (Abgrenzung): ohne Card, GlyphMinus size 16 in text-foreground-subtle (Z. 188), h3 text-body font-semibold (Z. 190), Text text-small (Z. 191). Erfüllt.
Schritt 7 (FAQ): unverändert (Z. 200 bis 210). Erfüllt.
Schritt 8 (Nächster Schritt): Raster lg:grid-cols-12, Text lg:col-span-7 (Z. 215), Linkliste lg:col-span-5 (Z. 230), eyebrow-Klasse (Z. 231, Klasse in globals.css Z. 193 vorhanden), Link min-h-touch (Z. 237), Titel text-body font-semibold (Z. 240), Beschreibung text-small (Z. 244), GlyphPfeilRechts mit zeiger:group-hover:translate-x-1 und transition-transform duration-quick ease-standard (Z. 249 bis 252). Erfüllt, Größe 16 mit Befund (soll).
Schritt 9 (freie Werte nach K-005a): grep auf text-[, min-h-[, grid-cols-[, translate-x-0.5, font-bold, text-xs, text-sm, text-base, text-lg, text-xl ergibt in den drei Dateien keinen Treffer. Erfüllt.
Schritt 10 (key-kinds.tsx): text-small statt text-[13px] (Z. 89), Platzhalter neu als \"Schlüsselarten noch nicht hinterlegt\" (Z. 89), cn('flex flex-wrap gap-1.5', className) (Z. 97), Import von cn aus @/lib/cn (Z. 2), cn existiert. Erfüllt.
Schritt 11 (vehicle-facts.tsx): unverändert. Der Platzhalter in Z. 12 verstößt gegen K-010 (Befund muss). Die Mono-Frage gehört zum Aufrufer (Befund soll). Teilweise erfüllt, Befund muss.
Schritt 12 (Schnellprüfung und Bilder): Alle Befehle unten ausgeführt. Bilder für nachmachen (mobil, desktop, ganz), smart-key (mobil, desktop, ganz) und golf (mobil) erstellt und angesehen. Erfüllt.
Grenzen: Keine Änderung an gemeinsamen Dateien (globals.css, tailwind.config.ts, cn.ts, Layout) im Diff. Keine neuen Abhängigkeiten. Keine Test-Datei betroffen. Keine Datei gelöscht (rm nicht genutzt). Erfüllt.

**Prüfungen:** npx tsc --noEmit (ganzes Projekt): Exit 0, ohne Fehler.
npx eslint service-article.tsx key-kinds.tsx vehicle-facts.tsx: Exit 0, ohne Befund.
npx vitest run src/components: 25 Dateien, 740 Tests, alle grün, Exit 0. Die Zahl ist durch Paket 05 gestiegen (bestaetigung.test.tsx).
werte-suche.mjs für die drei Dateien: 0 Funde, 0 Ausnahmen, Exit 0. JSON-Protokoll: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/e3b04/werte-suche-r1.json
grep lucide-react in den drei Dateien: 0 Treffer.
Messfenster-Sperre /tmp/sm24-messfenster.lock: nicht vorhanden, Messung zulässig.
Entwicklungsserver Port 3001: HTTP 200.
git status für die drei Dateien: keine Änderung gegen HEAD. Keine Commits, kein Push durch mich.
Bilder: sieben JPG und acht JSON-Protokolle in /root/sm24-bilder/E3-BAUMEISTER-04-pruefung-r1. Gesichtet wurden die Ganzseiten von nachmachen und smart-key und die mobilen Ansichten. In den Ganzseiten sind Wann-Liste, Was-wir-brauchen, Abgrenzung und Passend dazu lesbar, ohne Überlauf oder Abschneiden. Zwei Ausschnitte (Wann, Was wir und Abgrenzung) wurden zusätzlich vergrößert gesichtet. Hover und Fokus sind nicht geprüft.

## Reparatur E3-BAUMEISTER-04 R1
E3-BAUMEISTER-04, Runde 2. Muss-Befund behoben: vehicle-facts.tsx Z. 12 liefert bei fehlendem Baujahr nicht mehr den Platzhalter, sondern „noch nicht hinterlegt“ (vorläufig; Wortlaut vom Orchestrator zu bestätigen, keine Angabe erfunden). Geänderte Datei: /home/user/schluesselmacher24/src/components/autoschluessel/vehicle-facts.tsx (nicht committet). service-article.tsx und key-kinds.tsx unverändert gegenüber HEAD f00e351. Commit f00e351 nicht angefasst; Klärung beim Orchestrator. Prüfung: tsc, eslint, vitest (740 Tests), werte-suche und lucide-Suche grün. Bilder in /root/sm24-bilder/E3-BAUMEISTER-04-runde2/, alle angesehen, nichts abgeschnitten, kein Überlauf. Eigene Ausgaben in /tmp (/tmp/x.json, /tmp/sm24-e3b04-tsc.txt, /tmp/sm24-e3b04-vitest.txt) liegen lassen, Löschen verboten. === ENDE E3-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-04 R2
**Urteil:** nicht bestanden
- muss: vehicle-facts.tsx Z. 12: Die Platzhalterzeile „[Platzhalter: Baujahre noch nicht erfasst]“ wurde in der Arbeitskopie (nicht committet) durch „noch nicht hinterlegt“ ersetzt. Paket Schritt 11 verlangt für diese Datei nur eine Prüfung, „sonst unverändert“; die einzige erlaubte Platzhalter-Änderung nennt das Paket für KeyKindBadges (key-kinds.tsx). Der Bericht selbst markiert den Wortlaut als vorläufig und vom Orchestrator zu bestätigen; eine Alt-Neu-Liste fehlt. Der Hinweis auf D-005 (null sichtbare Platzhalter) kann die Änderung rechtfertigen, ist aber im Paket nicht genannt. Freigabe nur durch den Orchestrator mit bestätigtem Wortlaut und Alt-Neu-Liste im Bericht.
- soll: src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx Z. 46–47 und Z. 71: formatModelYears fließt in den Seitentitel („… Autoschlüssel (<Angabe>)“). Mit dem neuen Wortlaut erscheint „(noch nicht hinterlegt)“ im Browser-Titel. Ist nicht im Paket geregelt; mit dem Orchestrator klären.
- soll: Fokus- und Hover-Zustand sind nicht belegt. Das Paket verlangt „Fokus sichtbar“. Die Bilder zeigen nur Ruhezustände; der Pfeil-Hover der Linkliste (zeiger:group-hover:translate-x-1, service-article.tsx Z. 249–251) und der Tastaturfokus wurden nicht aufgenommen.
- soll: Der Bericht behauptet einen Muss-Befund aus Runde 1 („vehicle-facts Z. 12“). Ein Runde-1-Prüfbericht für E3-BAUMEISTER-04 liegt in _werkstatt/berichte und _werkstatt/protokolle nicht vor; nur der Bildordner /root/sm24-bilder/E3-BAUMEISTER-04-pruefung-r1 existiert. Die Behauptung ist aus den Dateien nicht belegt.
- hinweis: service-article.tsx und key-kinds.tsx sind nicht in der Arbeitskopie geändert, sondern im Commit f00e351 (ZWISCHENSTAND) enthalten. Die Prüfung der Paketschritte 2–10 erfolgte deshalb gegen den Diff 9638c34..f00e351 plus Arbeitskopie. Der Commit selbst wurde nicht angefasst.
- hinweis: Die Bilder der mobilen Ansichten zeigen die fixierte Bodennavigation über Inhalt und das Next-Dev-Symbol über dem Tab „Autoschlüssel“. Das ist ein Artefakt der Dev-Ansicht und wurde nicht als Befund gewertet.
- hinweis: werte-suche hat ein neues Protokoll in _werkstatt/protokolle/werte-suche-2026-10-16_06-44-08.json angelegt (untracked). Projektdateien wurden von der Prüfung nicht verändert.

**Schritte:** Gesamturteil: nicht bestanden, wegen eines Muss-Befunds (Schritt 11). Schritte gegen Diff 9638c34..f00e351 plus Arbeitskopie geprüft. Schritt 1 (Lesen des Abschnitts E3-B-04) ist nicht belegbar. Schritt 2: erfüllt. service-article.tsx Z. 95 bereich="autoschluessel", Z. 97 ButtonLink pfeil, ArrowRight-Import entfernt. Schritt 3: erfüllt. Z. 105–124 Raster lg:col-span-7/5, prose-sm24 Z. 108. Schritt 4: erfüllt. Z. 131–149 nummerierte ol mit border-t/border-b, Nummer font-mono text-caption tabular-nums text-foreground-subtle Z. 134–138, h3 text-title-sm font-semibold Z. 142, InfoTip Z. 143, lg:grid-cols-2 Z. 131. Schritt 5: erfüllt. Z. 154–180, GlyphHaken text-success Z. 161, Alert Z. 173–177 bleibt. Schritt 6: erfüllt. Z. 183–196 GlyphMinus Z. 188, Card-Import entfernt. Schritt 7: erfüllt. FAQ Z. 200–210 ohne Diff. Schritt 8: erfüllt. Z. 214–260: lg:col-span-7/5, eyebrow Z. 231, min-h-touch Z. 237, text-body Z. 240, text-small Z. 244, GlyphPfeilRechts size 16 Z. 249–252. Schritt 9: erfüllt. Keine Rest-Werte nach K-005a in den drei Dateien (Grep auf text-xs/sm/base/lg/xl, [..]-Klassen, min-h-[, shadow-, z-30/40/50, duration-150/200/300, grid-cols-[, transition-[ leer; die Treffer „text-small“ sind Fehltreffer des Musters). werte-suche 0 Funde. Schritt 10: erfüllt. key-kinds.tsx Z. 89 text-small text-foreground-muted, Text „Schlüsselarten noch nicht hinterlegt“, cn-Import Z. 2 und Verwendung Z. 94; alle Exporte unverändert, nur die Zeilen 2, 86–94 geändert. Schritt 11: NICHT erfüllt. vehicle-facts.tsx Z. 12 geändert, Paket verlangt „sonst unverändert“ (muss). Schnittstellen: Props-Verträge aller drei Dateien unverändert (keine Interface-Änderung im Diff), Aufrufer per grep geprüft (fahrzeugoeffnung, funkschluessel, kopieren, marken, marken/[make], marken/[make]/[model] u. a.), keine Hooks, keine Keys geändert, Abschnittsreihenfolge und Kommentar Z. 17–22 unverändert, content.faq-Vorrang Z. 83–84 unverändert, dedupeLinks unverändert. Kein 'use client', kein lucide-react, keine neuen Abhängigkeiten. Schritt 12: Bilder erstellt, siehe bilder."}]

**Prüfungen:** Schnellprüfung (Ergebnisse mit Zahlen):
- npx tsc --noEmit: Exit 0, 0 Fehler. Ausgabe: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/e3b04-r2-tsc.txt (leer).
- npx eslint service-article.tsx key-kinds.tsx vehicle-facts.tsx: Exit 0, 0 Befunde. Ausgabe: .../scratchpad/e3b04-r2-eslint.txt (leer).
- npx vitest run src/components: Exit 0, 25 Dateien, 740 Tests bestanden, 0 fehlgeschlagen (Test-Ausgabe: .../scratchpad/e3b04-r2-vitest.txt). Die Zahl stimmt mit dem Bericht überein; eine Baseline-Zahl vor Welle E3-B wurde nicht gemessen. Keine Testdatei prüft formatModelYears oder die Platzhalterzeile.
- node _werkstatt/werkzeuge/werte-suche.mjs (3 Dateien): 0 Funde, 0 Ausnahmen. JSON: _werkstatt/protokolle/werte-suche-2026-10-16_06-44-08.json.
- grep lucide-react in den drei Dateien: kein Treffer (Exit 1).
- git status --short: nur vehicle-facts.tsx geändert (Schreibrecht erfüllt); service-article.tsx und key-kinds.tsx ohne Arbeitskopie-Änderung, Inhalt aber im Commit f00e351 (Diff gegen 9638c34 geprüft). Commit f00e351 nicht verändert.
- Kein Lock /tmp/sm24-messfenster.lock vorhanden; Port 3001 antwortete mit HTTP 200.
Fremde Dateien: keine Testfehler gemeldet; andere Pakete (E3-05/06) betreffen andere Dateien und wurden nicht bewertet.
Die Bildauswertung bezieht sich auf Ruhezustände; Hover und Fokus sind nicht belegt (siehe Befunde)."

## Reparatur E3-BAUMEISTER-04 R2
E3-BAUMEISTER-04 · Runde 3 (Nachbesserung nach Prüfung Runde 2)

GEÄNDERTE DATEIEN
- src/components/autoschluessel/vehicle-facts.tsx: Arbeitskopie Zeile 12 auf den Commit-Wortlaut zurückgesetzt. `git diff` ist leer. Nicht committet.

WAS UND WARUM
- Muss-Befund vehicle-facts Z. 12 behoben. Das Paket verlangt für diese Datei nur eine Prüfung, „sonst unverändert“. Die einzige erlaubte Platzhalter-Änderung nennt das Paket für key-kinds.tsx. Eine Freigabe durch den Orchestrator liegt nicht vor, daher ist die Änderung zurückgenommen.
- Schritt 1 nachgeholt: E3-B-04 im Kundschaftsbericht gelesen.
- Hover und Fokus belegt: drei neue Aufnahmen auf der Seite Nachmachen (Desktop) zeigen Hover der Linkliste, Tastaturfokus der Linkliste und Tastaturfokus im Seitenkopf. Keine Codeänderung nötig, da die Regeln bereits vorhanden sind (translate-x-1 am Pfeil mit zeiger:-Variante, Farbwechsel am Label, globaler :focus-visible-Ring).
- key-kinds.tsx und service-article.tsx sind unverändert gegenüber HEAD. Die Änderungen aus den Schritten 2 bis 10 stecken in Commit f00e351. Alt-Neu für key-kinds (aus git diff 9638c34 HEAD): „[Platzhalter: Schlüsselarten noch nicht erfasst]“ -> „Schlüsselarten noch nicht hinterlegt“; text-[13px] -> text-small; Template-String -> cn('flex flex-wrap gap-1.5', className).

GEMEINSAME DATEIEN
- Keine.

PRÜFUNG UND ERGEBNIS
- tsc --noEmit: Exit 0, 0 Fehler insgesamt.
- eslint auf die drei Dateien: Exit 0, keine Befunde.
- vitest run src/components: 25 Dateien, 740 Tests, alle grün.
- werte-suche auf die drei Dateien: 0 Funde, 0 Ausnahmen.
- grep lucide-react: kein Treffer.
- Messfenster-Sperre nicht gesetzt, Port 3001 antwortet mit HTTP 200.
- Gesamturteil der Schnellprüfung: bestanden.

BILDBELEGE
- Ordner /root/sm24-bilder/E3-BAUMEISTER-04-runde3 (neu, die Vorläufer wurden nicht überschrieben). Standardbilder nach Paket Schritt 12: nachmachen mobil, desktop, desktop ganz; smart-key mobil, desktop, desktop ganz; golf mobil. Zusätzlich drei Zustandsbilder (Hover und Fokus). Die Protokolle liegen als bild-*.json im selben Ordner.
- Sichtprüfung: nichts abgeschnitten, kein horizontaler Überlauf erkennbar, Haarlinien und Nummerierung gleichmäßig. Der dunkle „N“-Kreis unten links ist das Entwicklungs-Overlay von Next.js und kein Seiteninhalt.
- Skript für die Zustandsbilder: /tmp/claude-0/-home-user-schluesselmacher24/97f67536-828c-582d-bf9e-78d9960a0d12/scratchpad/e3b04-zustaende.mjs (Hilfsskript, nur Scratchpad).

OFFENE FRAGEN
1. Seitentitel (src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx Z. 46-50, 71): Bei fehlendem yearFrom steht der Platzhalter im Browser-Titel. Stand des Commits, nicht von mir geändert, außerhalb meiner Schreibrechte. Entscheidung durch den Orchestrator nötig.
2. Platzhalter in vehicle-facts Z. 12: Ob „noch nicht hinterlegt“ freigegeben wird, entscheidet der Orchestrator. Bei Freigabe mit Alt-Neu wie oben umsetzen.
3. Runde-1-Befund „vehicle-facts Z. 12“: Kein Runde-1-Bericht für E3-BAUMEISTER-04 in _werkstatt/berichte oder _werkstatt/protokolle vorhanden, nur der Bildordner E3-BAUMEISTER-04-pruefung-r1. Nicht belegbar.
4. Jahreszahlen in vehicle-facts: Ob formatModelYears Mono-Klasse erhalten soll, ist im Paket nicht geregelt. Nicht umgesetzt.

=== ENDE E3-BAUMEISTER-04 · BEREIT ZUR RÜCKGABE ===

## Prüfung E3-BAUMEISTER-04 R3
**Urteil:** bestanden
- soll: Schritt 11 (vehicle-facts.tsx) ist ohne Prüfergebnis: Der Bericht lässt offen, ob Jahreszahlen font-mono tabular-nums erhalten. Die Jahreszahlen werden in Aufrufern ohne Mono gezeigt (src/app/(site)/autoschluessel/marken/[make]/page.tsx Z. 207-209, Tabellenzelle text-[14px] ohne font-mono). Die Datei selbst ist unverändert, das ist erlaubt. Die Entscheidung liegt beim Orchestrator, weil die Aufrufer außerhalb der Schreibrechte liegen.
- soll: Sichtbarer Platzhalter in vehicle-facts.tsx Z. 12: „[Platzhalter: Baujahre noch nicht erfasst]“ erscheint auf Kundenseiten (Tabelle marken/[make]/page.tsx Z. 208). Das Paket nennt als harten Platzhalter-Katalog nur KeyKindBadges, daher kein Verstoß. Die Freigabe für eine Textänderung entscheidet der Orchestrator.
- hinweis: Seitentitel-Platzhalter bestätigt (Offene Frage 1 des Baumeisters): src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx Z. 46 und Z. 71 setzen formatModelYears in den Browser-Titel. Ohne yearFrom steht dort der Platzhalter. Die Datei liegt außerhalb der Schreibrechte von E3-BAUMEISTER-04.
- hinweis: Die Farbe der Haken (text-success, service-article.tsx Z. 161) ist im verkleinerten Bild nicht sicher erkennbar. Belegt ist sie nur im Code (Token existiert in tailwind.config.ts).
- hinweis: Die mobilen Bilder zeigen nur den ersten Bildschirm (bild.mjs ohne --ganz). Die Zustandsbilder Hover und Fokus, die der Baumeister angibt, sind nicht Teil des Bildsatzes des Pakets und von mir nicht geprüft.
- hinweis: Die Schnellprüfung hat mit werte-suche eine neue, nicht versionierte Protokolldatei angelegt: _werkstatt/protokolle/werte-suche-2026-10-16_06-51-29.json (Standard des Werkzeugs, keine Projektdatei).

**Schritte:** Schritt 1 erfüllt: git status zeigt für die drei Schreibrechte-Dateien keine Arbeitskopie-Änderung (git diff leer). Geändert, aber fremd: bestaetigung.tsx, preis-anzeige.tsx, termin-auswahl.tsx, rechner-bausteine.tsx, rechner.test.tsx, nachweise-liste.tsx sowie untracked bestaetigung.test.tsx (E3-05/06). Der Zwischenstand liegt in Commit f00e351. Gegen 9638c34 geändert sind nur service-article.tsx und key-kinds.tsx; vehicle-facts.tsx ist unverändert.

Props und Logik erfüllt: ServiceArticleProps (service-article.tsx Z. 37-60), KeyKindBadges-Signatur (key-kinds.tsx Z. 80-86) und formatModelYears (vehicle-facts.tsx Z. 11-14) sind unverändert. Die einzige Ergänzung ist bereich="autoschluessel" am PageHeader (Z. 95), eine erlaubte Ergänzung. dedupeLinks, die Keys, der Kommentar Z. 17-22 und die Reihenfolge der Abschnitte bleiben. Keine Test-Änderungen, keine neuen Abhängigkeiten, kein 'use client' in den drei Dateien.

Schritt 2 erfüllt: bereich-Prop Z. 95, ButtonLink mit pfeil Z. 97-99, ArrowRight entfernt.
Schritt 3 erfüllt: Raster 7/5 (lg:col-span-7 Z. 106, lg:col-span-5 Z. 122), prose-sm24 Z. 108 erhalten.
Schritt 4 erfüllt: nummerierte Liste Z. 131-149 mit border-t/border-b, Nummer font-mono text-caption tabular-nums text-foreground-subtle (Z. 136), Titel text-title-sm font-semibold (Z. 142), Text text-small text-foreground-muted (Z. 145), InfoTip am Titel (Z. 143), lg:grid-cols-2 lg:gap-x-gutter (Z. 131).
Schritt 5 erfüllt: Raster 5/7 (Z. 155, 157), GlyphHaken size 16 text-success (Z. 161), Alert bleibt (Z. 173-177).
Schritt 6 erfüllt: Z. 183-196, GlyphMinus text-foreground-subtle (Z. 188), keine Card, text-body font-semibold (Z. 190), text-small (Z. 191).
Schritt 7 erfüllt: FAQ Z. 200-210 unverändert gegenüber 9638c34.
Schritt 8 erfüllt: Raster 7/5 (Z. 215, 230), eyebrow-Überschrift „Passend dazu“ (Z. 231, Klasse in src/app/(site)/globals.css Z. 193), Zeile = ganzer Link mit min-h-touch (Z. 237), Titel text-body font-semibold (Z. 240), Beschreibung text-small (Z. 244), GlyphPfeilRechts size 16 mit transition-transform duration-quick ease-standard zeiger:group-hover:translate-x-1 (Z. 249-252), Farbwechsel group-hover:text-primary (Z. 240). Die Variante zeiger ist in tailwind.config.ts definiert.
Schritt 9 erfüllt: grep auf text-[, min-h-[, shadow, z-30/40/50, duration-150/200/300, transition-[, grid-cols-[, tracking-wider, text-xs/sm/base/lg/xl, font-bold, lucide in den drei Dateien ergibt 0 Treffer.
Schritt 10 erfüllt: key-kinds.tsx Z. 89 text-small text-foreground-muted, Platzhalter durch „Schlüsselarten noch nicht hinterlegt“ ersetzt; Z. 94 cn('flex flex-wrap gap-1.5', className) mit Import Z. 2.
Schritt 11 teilweise belegt: vehicle-facts.tsx ist unverändert (Z. 12 wie 9638c34). Das Prüfergebnis zu Mono für Jahreszahlen fehlt (siehe Befund soll).
Schritt 12 erfüllt: alle genannten Ansichten als Bilder erstellt (siehe BILDBELEGE).

Gemeinsame Dateien: keine nötig; kein Wert ohne Token gefunden.
Bewegung: B-06 registriert und mit reduzierter Variante (zeiger:) umgesetzt. Keine Bewegung ohne Registereintrag.

**Prüfungen:** Schnellprüfung, von mir selbst ausgeführt:
- npx tsc --noEmit: Exit 0, keine Fehlerzeilen, 0 Fehler insgesamt.
- npx eslint service-article.tsx key-kinds.tsx vehicle-facts.tsx: Exit 0, keine Befunde.
- npx vitest run src/components: 25 Testdateien, 740 Tests, alle bestanden (inkl. bestaetigung.test.tsx aus E3-05). Die Zahlen stimmen mit dem Baumeister-Bericht überein.
- werte-suche.mjs auf die drei Dateien: 0 Funde, 0 Ausnahmen.
- grep lucide-react auf die drei Dateien: 0 Treffer.
- Messfenster-Sperre /tmp/sm24-messfenster.lock: nicht vorhanden.
- Port 3001 antwortet mit HTTP 200.
Gesamturteil: alle Schnellprüfungen grün. Die Zahlen sind mit den Angaben des Baumeisters identisch.

Keine Projektdatei wurde geändert, nichts gelöscht, nicht committet.
