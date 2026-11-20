# FA-INHALT-01B · Tutorials, Teil B: Hinweise auf Leistungsseiten und in Formularen; YouTube-Einbettung hinter einem Freigabe-Schalter

Stand 20.11.2026, Arbeitsbaum auf 5c6bf8c. Kein git (nichts committet), keine echten Videos, YouTube nie im Browser abgerufen (Attrappe). Anforderungen FA-21-08 bis FA-21-14, FA-12-04, FA-26-06.

## Was Kunden jetzt sehen

1. Auf sieben Leistungsseiten und in drei Anfragewegen steht beim passenden Abschnitt oder beim Hilfeblock ein kurzer Hinweis „Passende Anleitung Schritt für Schritt“ mit dem Tutorial als Frage; in Formularen öffnet er ein neues Fenster und sagt das sichtbar, das Formular mit seinem Zwischenstand bleibt stehen.
2. Wo ein Ort kein veröffentlichtes Tutorial hat (Fahrzeugschein im Autoschlüssel-Assistenten, Autoschlüssel-Gehäuse), erscheint nichts, auch keine Überschrift.
3. Videos sehen Kunden erst, wenn der Betrieb den Schalter `SM24_VIDEOS=an` setzt: Dann zeigt die Tutorial-Seite eine eigene Vorschau mit dem Knopf „Video laden“, und erst dieser Klick lädt den Player von youtube-nocookie.com; ohne Schalter bleibt alles wie heute (der Satz aus Teil A, Datenschutzerklärung und Sicherheitsrichtlinie Zeichen für Zeichen gleich).

## Orte mit Hinweis

| Ort (`TUTORIAL_ORTE`) | Seite oder Schritt | Darstellung | Gezeigte Tutorials (Stand content/tutorials.json) |
|---|---|---|---|
| `schluessel-nach-vorlage` | `/schluessel-nach-vorlage`, Abschnitt 02 „Diese drei Aufnahmen brauchen wir“, unter der Fotoanleitung | nur Verweis (die Seite trägt die Fotoanleitung schon) | Wie fotografiere ich einen Schlüssel richtig? |
| `schluessel-nach-vorlage-fotos` | `/schluessel-nach-vorlage/anfrage`, Fotoschritte (Vorderseite, Rückseite, Spitze), unter dem Hilfeblock „Unsicher bei den Fotos?“ | Verweis, neues Fenster | Wie fotografiere ich einen Schlüssel richtig? |
| `autoschluessel-fotos` | `/autoschluessel/anfrage`, Schritt Schlüsselfotos, unter „Sie kommen hier nicht weiter?“ | Verweis, neues Fenster | Wie fotografiere ich einen Autoschlüssel richtig? |
| `autoschluessel-fahrzeugschein` | `/autoschluessel/anfrage`, Schritt Fahrzeugschein | Verweis, neues Fenster | keins (Tutorial „Angaben im Fahrzeugschein“ unveröffentlicht): nichts |
| `schluessel-nach-code` | `/schluessel-nach-code`, Abschnitt „Passende Bereiche und Erklärungen“, über der Liste | Kasten | Wie funktioniert Schlüssel nach Code? |
| `schluessel-einschicken` | `/schluessel-einschicken`, Abschnitt 01, unter „Einsendung anmelden“ | Kasten | Wie sende ich meinen Schlüssel ein? |
| `gleichschliessende-zylinder` | `/gleichschliessende-zylinder`, Abschnitt 04 Messhilfe, unter „Ausführliche Anleitung zum Ausmessen“ | nur Verweise (die Seite trägt Messhilfe und Funktion schon) | Wie messe ich einen Profilzylinder?; Was ist die Not- und Gefahrenfunktion?; Was bedeutet gleichschließend? |
| `gleichschliessende-zylinder-messen` | `/gleichschliessende-zylinder/konfigurator`, Schritt Zylinder, unter dem Hilfeblock „Maß unbekannt oder unsicher?“ | Verweis, neues Fenster | Wie messe ich einen Profilzylinder? |
| `gleichschliessende-zylinder-funktion` | dort, direkt darunter (die Funktion wählt man im selben Schritt) | Verweis, neues Fenster | Was ist die Not- und Gefahrenfunktion? |
| `schliessanlagen` | `/schliessanlagen`, Abschnitt 01 „Die fünf Systeme“, unter dem Vergleich | Kasten | Was ist HS und GHS? |
| `autoschluessel-gehaeuse` | `/autoschluessel/gehaeuse`, Abschnitt 02, unter „Funkschlüssel und Gehäuse im Überblick“ | Kasten | keins (Tutorial „Gehäuseumbau“ unveröffentlicht): nichts |

Der Kasten zeigt je Tutorial den Titel als Frage und den ersten Satz der Kurzantwort; „mit Video“ nur, wenn ein Video hinterlegt und der Schalter gesetzt ist. Der Hinweis ist ein Serverbaustein ohne Skript und ohne Datenzugriff (`src/components/tutorial/tutorial-hinweis.tsx`); die Seite holt die Verweise (`tutorialVerweiseFuer` in `src/lib/tutorials/hinweise.ts`) und gibt den Formularen den fertig gerenderten Hinweis als Eigenschaft (A-071). Verweise sind gewöhnliche `<a>` ohne Vorladen.

## Belege

Skripte und Protokolle in `_werkstatt/ausbau/protokolle/FA-INHALT-01B/` (`probe-video.mjs/.log/.json`, `probe-ohne.mjs/.log/.json`, `probe-hinweise.mjs/.log/.json`, `gewicht.mjs`, `gewicht-*.json`). Bildschirmfotos nur im Arbeitsordner: `/tmp/claude-0/-home-user-schluesselmacher24/50ccec0a-b61b-52e7-997c-918359eccaec/scratchpad/bilder/` (`video-vor-klick-412.png`, `video-vor-klick-1280.png`, `video-nach-klick-412.png`, `video-nach-klick-1280.png`, `hinweis-<ort>-412.png` und `-1280.png`).

Probeneintrag: Kopie `protokolle/FA-INHALT-01B/tutorials.json.kopie` (sha256 36c38cc8…ac109f81), für die Proben ein erfundenes Video (Kennung `Pr0be_V1d3o`, Titel, 2:47, 20.11.2026, Transkript) beim veröffentlichten Tutorial „Schlüssel richtig fotografieren“; danach `content/tutorials.json` aus der Kopie zurückgelegt, `cmp` gleich, sha256 gleich. Die letzten Builds liefen ohne Probeneintrag und ohne Schalter.

**Mit Schalter** (Build und `next start` mit `SM24_VIDEOS=an`, `probe-video.log`, 38 von 38 bei 412 und 1280 px):
- Antwortkopf mit `frame-src 'self' https://www.youtube-nocookie.com`, sonst unverändert.
- Vor dem Klick: kein Rahmen, keine fremde Anfrage (0), im HTML und im DOM nach dem Hydrieren keine Adresse von YouTube oder Google.
- Nur Tastatur: „Video laden“ per Tab erreichbar (44 px hoch), Enter.
- Nach dem Klick: genau ein Rahmen, `https://www.youtube-nocookie.com/embed/Pr0be_V1d3o?autoplay=1`, `title` aus dem Videotitel; angefragt wurde nur youtube-nocookie.com (von der Attrappe beantwortet), keine Meldung der Sicherheitsrichtlinie in der Konsole, Rahmen und Inhalt darunter an gleicher Stelle, Layoutverschiebung durch den Klick 0 (alle Einträge, auch nach Eingabe), Fokus auf dem Player (IFRAME), kein Cookie.
- Datenschutzerklärung mit dem Absatz zu YouTube und Abschnitt `verarbeitung-videos`, „Videos“ nicht mehr unter „nicht eingebunden“; Hinweis auf `/schluessel-nach-vorlage` mit „mit Video“.

**Ohne Schalter** (Build ohne Schalter mit Probeneintrag, `probe-ohne.log`, 20 von 20, Vergleich mit dem Messstand auf Port 3200):
- Richtlinie auf `/`, Tutorial-Seite, Datenschutzerklärung und Vorlage-Anfrage gleich dem Messstand, ohne `frame-src`. Auch am letzten Build: Kopfzeile der Startseite `cmp`-gleich mit dem Messstand.
- Datenschutzerklärung: `<main>` Zeichen für Zeichen gleich dem Messstand (20 846 Zeichen).
- Tutorial-Seite mit Probeneintrag bei 412 und 1280 px: der Satz aus Teil A, kein Knopf, kein Rahmen, keine Kennung und keine fremde Adresse im HTML, kein VideoObject, Transkript zum Aufklappen.

**Hinweise** (letzter Build, `probe-hinweise.log`, 154 von 154 bei 412 und 1280 px): Jeder Ort mit Eintrag zeigt den Hinweis, die Verweise führen auf die richtige Tutorial-Seite (200, Überschrift gleich dem Titel), Bedienflächen 44 px; Gehäuse zeigt nichts; im Assistenten steht der Hinweis für die Schlüsselfotos in der Nutzlast der Seite, für den Fahrzeugschein nichts. Vorlage-Anfrage und Konfigurator: Der Verweis öffnet ein neues Fenster mit der Tutorial-Seite, das Formular bleibt auf derselben Adresse und im selben Schritt, der Zwischenstand im Browser ist unverändert. Kleinste Schrift in den Hinweisen 15 px, nichts läuft über, kein waagerechtes Rollen auf den neun Seiten (412 px). Keine fremde Anfrage.

**Tests**, die das Paket verlangt (alle neu oder angepasst, alle grün):
- `src/lib/tutorials/freigabe.test.tsx`: ohne Schalter Richtlinie (vier Fassungen: Entwicklung und Produktion, mit und ohne Mess-ID) und Datenschutzerklärung (mit und ohne Statistik) Zeichen für Zeichen gleich dem vor dem Paket erfassten Stand (`src/lib/tutorials/freigabe-vorher.json`), Verarbeitungen und Dienstleister unverändert; mit Schalter genau der eine Rahmen und keine andere Richtlinie geändert; YouTube in Übersicht, Dienstleistern und Absatz.
- `src/components/tutorial/video-einbettung.test.tsx` (happy-dom, Rahmen werden nicht geladen): ohne Schalter der Satz aus Teil A; mit Schalter vor dem Klick keine Adresse; der Test klickt „Video laden“ und findet genau einen Rahmen auf `https://www.youtube-nocookie.com`, Fokus auf dem Player, gleicher Rahmen, keine Anfrage, kein Speicher; auch nach dem Hydrieren des Server-HTML.
- `src/components/tutorial/tutorial-hinweis.test.tsx`: unveröffentlichte und nicht zugeordnete Tutorials ergeben keinen Hinweis, ohne Eintrag kein Markup, alle elf Orte gegen den Startbestand, neues Fenster mit Zusatz, „mit Video“ nur mit Schalter.
- `src/components/tutorial/tutorial-grenze.test.ts` (Muster `auftragsweg-grenze.test.ts`, mit Selbsttest): Der Hinweis erreicht weder Datenschicht noch Einbettung, die drei Formulare erreichen weder Hinweis, Verweise noch Einbettung (transitiv), kein Client-Baustein importiert die Verweise, `video-rahmen` hängt nur an der Tutorial-Seite, jede Seite gibt ihren Ort weiter.
- `src/lib/tutorials/tutorials.test.ts`: Indexierung mit und ohne Schalter, `VideoObject` nur mit Schalter und vollständigen Angaben, ohne Adresse von YouTube, kein `HowTo`.

## Skript-Gewicht vorher und nachher

Gemessen wird, was der Browser lädt (A-076), mit `gewicht.mjs` je Ansicht in frischem Kontext bei 1280 px bis zur Netzruhe (dabei zählt auch Vorladen sichtbarer Verweise); vorher = Messstand Port 3200, nachher = letzter Build ohne Schalter auf frisch gestartetem Server Port 3000.

| Ansicht | Skripte vorher / nachher | JS gz vorher | JS gz nachher (ohne Schalter) | Differenz | mit Schalter |
|---|---|---|---|---|---|
| `/schluessel-nach-vorlage` | 18 / 18 | 227.5 KB | 227.5 KB | +32 B | 227.5 KB |
| `/schluessel-nach-vorlage/anfrage` | 17 / 17 | 220.8 KB | 220.8 KB | +32 B | 220.8 KB |
| `/autoschluessel/anfrage` | 18 / 18 | 236.9 KB | 236.9 KB | +15 B | 236.9 KB |
| `/schluessel-nach-code` | 15 / 15 | 194.4 KB | 194.4 KB | +0 B | 194.4 KB |
| `/schluessel-einschicken` | 19 / 19 | 230.9 KB | 230.9 KB | +32 B | 230.9 KB |
| `/gleichschliessende-zylinder` | 17 / 17 | 215.4 KB | 215.4 KB | +22 B | 215.4 KB |
| `/gleichschliessende-zylinder/konfigurator` | 20 / 20 | 255.1 KB | 255.2 KB | +22 B | 255.2 KB |
| `/schliessanlagen` | 14 / 14 | 188.7 KB | 188.7 KB | +0 B | 188.7 KB |
| `/autoschluessel/gehaeuse` | 18 / 18 | 229.8 KB | 229.8 KB | +0 B | 229.8 KB |
| `/tutorials/schluessel-richtig-fotografieren` | 19 / 19 | 228.2 KB | 228.7 KB | +511 B | 228.7 KB |
| `/tutorials/profilzylinder-messen` | 18 / 18 | 221.6 KB | 222.1 KB | +501 B | 222.1 KB |
| `/tutorials` | 14 / 15 | 182.1 KB | 183.3 KB | +1210 B | 183.3 KB |
| `/` | 13 / 13 | 179.6 KB | 179.6 KB | +0 B | 179.6 KB |
| `/ratgeber/zylinder-richtig-ausmessen` | 15 / 15 | 188.3 KB | 188.3 KB | +0 B | 188.3 KB |
| `/service-und-termin/kontakt` | 17 / 17 | 216.3 KB | 216.3 KB | +0 B | 216.3 KB |

Woher die Unterschiede kommen (Dateien verglichen):
- +15 bis +32 B: die Bündel der drei Formulare (Vorlage-Anfrage, Assistent, Konfigurator), die jetzt die Eigenschaft `tutorialHinweis(e)` entgegennehmen und ausgeben. Sie erscheinen auf den Formularseiten und auf Seiten, die deren Route vorladen (Vorlage, Einschicken, Gleichschließende Zylinder); alle diese Seiten tragen selbst einen Hinweis. Der Hinweis bringt kein Skript mit.
- Startseite: zuerst +29 B, weil der Import der gemeinsamen Glyphe „Abspielen“ sie in ein eigenes Modul zog; behoben (eigene Zeichnung im Rahmen), jetzt 0 B.
- Tutorial-Seiten +0,5 KB, Übersicht `/tutorials` +1,2 KB (dort durch Vorladen der Einzelseiten): das Bündel des Client-Bausteins `VideoRahmen` (2,5 KB roh, 1,2 KB gz). Siehe OFFENE FRAGEN 1.

## WAS UND WARUM

- **Freigabe-Schalter** `src/lib/tutorials/freigabe.ts` (`videosFreigegeben`, `videosFreiBei`, `VIDEO_RAHMEN_HOST`), dieselbe Bedingung in `next.config.ts`. Muster wie die Statistik; der Wert wird nur auf dem Server gelesen und wirkt ab dem nächsten Build.
- **Sicherheitsrichtlinie**: nur mit Schalter `frame-src 'self' https://www.youtube-nocookie.com`. `'self'` hält die eigenen Rahmen so offen wie bisher über `default-src 'self'` (ein `frame-src` ohne `'self'` hätte sie still gesperrt). Kein `img-src`, `script-src` oder `connect-src` geändert. Gelesen: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` (Abschnitt „Without Nonces“) und `lazy-loading.md`.
- **Einbettung**: `VideoHinweis` zeigt ohne Schalter den Satz aus Teil A, mit Schalter die Fassade (eigenes Vorschaubild aus der Medienablage, sonst helle Fläche mit „Video“, Titel und Dauer, Dauer vorgelesen) im festen Rahmen 16 zu 9, darunter den Satz „Mit dem Klick auf „Video laden“ wird das Video von YouTube geladen. Dabei gehen Daten an YouTube.“ mit Verweis auf die Datenschutzerklärung; das Transkript bleibt darunter. Einziger Client-Baustein `video-rahmen.tsx`: Knopf „Video laden“ (44 px), nach dem Klick der Player im selben Rahmen, Fokus auf dem Player; die Adresse des Players entsteht erst im Browser nach dem Klick. Nichts wird gespeichert.
- **Datenschutzerklärung** (`datenschutz-inhalt.tsx`): neue Eigenschaft `videos` (Standard: Schalter des Servers, weil die Seite selbst nicht im Schreibrecht liegt). Ohne Schalter sind die bisherigen Absätze unverändert im Quelltext; mit Schalter eine eigene Fassung des ersten Absatzes in Abschnitt 5 und ein neuer Absatz. `verarbeitungen.ts`: `videos` als Option, `VIDEOS_VERARBEITUNG` und Dienstleister `YOUTUBE`, beide nur mit Option.
- **Strukturdaten**: `pageGraphSchema` kennt `video` (`VideoObject` mit Name, Beschreibung, Datum, eigenem Vorschaubild, Dauer ISO 8601), bewusst ohne `embedUrl`/`contentUrl`, damit vor dem Klick keine Adresse von YouTube im HTML steht. Die Tutorial-Seite übergibt es nur über `videoDaten()` (Schalter und alle Angaben). Kein `HowTo`.
- **Indexierung**: `VIDEO_EINBETTUNG_FREI` aus Teil A ersetzt durch den Schalter; ein Video zählt nur, wenn es sichtbar ist (Schalter und gültige Kennung, `videoSichtbar`). Ohne Schalter macht ein Video keine Seite indexierbar (Test).
- **Admin**: Die Feldbeschreibung des Videos sagt schon seit Teil A „Das Video erscheint auf der Seite, sobald die Einbettung freigeschaltet ist; bis dahin steht dort nur ein kurzer Hinweis.“ Sie trifft zu; deshalb unverändert, `payload-types.ts` unverändert.
- **Betrieb**: `docs/betrieb/tutorials-videos.md` (Video hinterlegen, Vorschaubild, Transkript, was der Schalter tut, wer ihn wann setzt, Hinweise an den Orten).

## GEÄNDERTE DATEIEN

Neu: `src/lib/tutorials/freigabe.ts`, `src/lib/tutorials/hinweise.ts`, `src/components/tutorial/tutorial-hinweis.tsx`, `src/components/tutorial/video-rahmen.tsx`, `docs/betrieb/tutorials-videos.md`; Tests `src/lib/tutorials/freigabe.test.tsx` mit `src/lib/tutorials/freigabe-vorher.json`, `src/components/tutorial/tutorial-hinweis.test.tsx`, `src/components/tutorial/video-einbettung.test.tsx`, `src/components/tutorial/tutorial-grenze.test.ts`; Protokolle unter `_werkstatt/ausbau/protokolle/FA-INHALT-01B/`; dieser Bericht.

Geändert: `next.config.ts` (nur `frame-src` hinter dem Schalter), `src/lib/tutorials/tutorials.ts`, `src/lib/tutorials/tutorials.test.ts`, `src/components/tutorial/video-hinweis.tsx`, `src/components/tutorial/tutorial-inhalt.tsx`, `src/app/(site)/tutorials/[slug]/page.tsx`, `src/components/seo/json-ld.tsx` und `seiten-daten.tsx` (nur `VideoObject`), `src/app/(site)/rechtliches/datenschutz/datenschutz-inhalt.tsx` (nur Fassung hinter dem Schalter), `src/lib/rechtliches/verarbeitungen.ts` (nur der Dienst hinter dem Schalter); Einbindung des Hinweises (nur Einbindung und Weitergabe als Eigenschaft) in `src/app/(site)/schluessel-nach-vorlage/page.tsx`, `…/schluessel-nach-vorlage/anfrage/page.tsx` und `anfrage-formular.tsx`, `…/autoschluessel/anfrage/page.tsx` und `assistent.tsx`, `…/schluessel-nach-code/page.tsx`, `…/schluessel-einschicken/page.tsx`, `…/gleichschliessende-zylinder/page.tsx`, `…/gleichschliessende-zylinder/konfigurator/page.tsx` und `konfigurator.tsx`, `…/schliessanlagen/page.tsx`, `…/autoschluessel/gehaeuse/page.tsx`; Mocks der Datenschicht um `getTutorialsFuer: async () => []` ergänzt in `…/gleichschliessende-zylinder/page.test.tsx` und `…/schluessel-nach-code/page.test.tsx` (keine Prüfung gelockert).

Unverändert (geprüft): `content/**` (Probe zurückgenommen, bytegleich), `src/payload/**`, `src/payload-types.ts`, `src/lib/einwilligung.ts`, Cookie-Einstellungen, `src/components/statistik/**`, `src/components/flow/**`, `src/components/visual/generators/**`, `src/components/forms/photo-upload*.tsx`, Navigation, Startseite, `globals.css`, `tailwind.config.ts`, `package.json`, `.env*`, `AGENTS.md`.

## GEMEINSAME DATEIEN

- `next.config.ts`: eine Konstante und eine Zeile im Array der Richtlinie, beide nur mit Schalter.
- `src/components/seo/json-ld.tsx` (`pageGraphSchema` hat die optionale Eingabe `video`) und `seiten-daten.tsx` (Eigenschaft `video`); ohne Angabe gleiche Ausgabe wie bisher.
- `src/lib/rechtliches/verarbeitungen.ts`: `dienstleister()` baut die Liste jetzt aus drei Teilen; ohne Optionen gleich (Test gegen den Stand vorher).
- Die drei Formulare: je eine optionale Eigenschaft und ihre Ausgabe beim Hilfeblock.

## PRÜFUNG UND ERGEBNIS

Alles über `_werkstatt/ausbau/werkzeuge/sicher.sh --json`:
- `npx vitest run`: 282 Dateien, 4373 Tests grün.
- `npm run typecheck`: grün.
- `npm run lint`: grün.
- Build mit Schalter und Probeneintrag (`env SM24_INDEXIERUNG=an SM24_VIDEOS=an npm run build`): grün, 190 Seiten. Build ohne Schalter mit Probeneintrag: grün.
- Zuletzt ohne Probeneintrag und ohne Schalter: `npm run build` grün (190/190) und `SM24_INDEXIERUNG=an npm run build` grün (190/190).
- Browserproben: mit Schalter 38/38, ohne Schalter 20/20, Hinweise 154/154 (siehe Belege).

Zwischenfall: Beim ersten Lauf von `video-einbettung.test.tsx` war die Option zum Abschalten des Rahmenladens von happy-dom falsch geschachtelt; happy-dom startete daraufhin eine Anfrage an `https://www.youtube-nocookie.com/embed/aB3_dE-5gH7?autoplay=1`, die beim Abbau der Testumgebung abgebrochen wurde („The operation was aborted“). Ob sie den Proxy erreicht hat, ist nicht feststellbar. Behoben (`@vitest-environment-options {"settings":{"disableIframePageLoading":true,…}}`); seitdem meldet happy-dom nur „Iframe page loading is disabled“, und der Test sperrt `fetch` zusätzlich. Im Browser lief jede Anfrage an YouTube nur gegen die Attrappe.

## ENTWURF ZUR ANWALTLICHEN PRÜFUNG

Erscheint nur mit `SM24_VIDEOS=an`. Entwurf (R10), nicht freigegeben.

**Datenschutzerklärung, Abschnitt 5, erster Absatz** (ersetzt mit Schalter den bisherigen; ohne Statistik):
„Wir verwenden keine Cookies oder Techniken zur Analyse, Reichweitenmessung oder Werbung. Inhalte fremder Anbieter wie Karten oder Schriftarten-Dienste binden wir nicht ein; Videos von YouTube laden erst nach Ihrem Klick (siehe unten). Die Schriftarten liefern wir selbst aus; beim Aufruf der Seite besteht keine Verbindung zu Google oder anderen Schriftanbietern.“

(mit Statistik): „Cookies zur Reichweitenmessung setzt nur Google Analytics – und erst, wenn Sie auf der Seite Cookie-Einstellungen oder im Hinweis beim ersten Besuch in „Statistik“ einwilligen (siehe 2.x). Ohne Einwilligung wird das Skript von Google nicht geladen. Werbe-Cookies verwenden wir nicht. Inhalte fremder Anbieter wie Karten oder Schriftarten-Dienste binden wir nicht ein; Videos von YouTube laden erst nach Ihrem Klick (siehe unten). Die Schriftarten liefern wir selbst aus.“

**Neuer Absatz in Abschnitt 5** (nach „Gespeichert wird nur …“):
„Videos auf unseren Tutorial-Seiten kommen von YouTube, einem Dienst der Google Ireland Limited. Wir binden sie im erweiterten Datenschutzmodus (youtube-nocookie.com) ein. Beim Aufruf der Seite sehen Sie zuerst nur eine Vorschau von uns; eine Verbindung zu YouTube besteht dann nicht. Erst wenn Sie auf „Video laden“ klicken, lädt Ihr Browser das Video von YouTube. Dabei erhält YouTube Ihre IP-Adresse, Angaben zu Browser und Gerät und die Adresse der Seite. Beim Abspielen kann YouTube Cookies oder ähnliche Kennungen in Ihrem Browser speichern. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (siehe 2.x). Wir speichern Ihre Wahl nicht; beim nächsten Video entscheiden Sie neu. Google kann Daten in die USA übermitteln (siehe 4.).“

**Übersicht der Verarbeitungen, neuer Eintrag 2.x „Videos von YouTube (erst nach Ihrem Klick)“** (nach der Statistik, vor der Ratenbegrenzung):
- Zweck: „Wiedergabe von Anleitungsvideos auf unseren Tutorial-Seiten.“
- Daten: „IP-Adresse; Geräte- und Browserangaben; Adresse der Seite, auf der das Video steht, und Zeitpunkt des Abrufs; Angaben zur Wiedergabe, etwa Start und Dauer; Kennungen, die YouTube beim Abspielen im Browser speichern kann“
- Rechtsgrundlage: „Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, die Sie mit dem Klick auf „Video laden“ für dieses eine Video geben. Ohne Klick besteht keine Verbindung zu YouTube. Wir speichern Ihre Wahl nicht; beim nächsten Video und nach dem Neuladen der Seite entscheiden Sie neu.“
- Empfänger: „Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland (Betreiberin von YouTube)“
- Drittland: „USA (Google LLC): EU-US Data Privacy Framework (Art. 45 DSGVO).“
- Speicherdauer: „Wir selbst speichern dabei nichts. Wie lange YouTube die Daten speichert, regelt die Datenschutzerklärung von Google.“
- Prüfhinweis (nur außerhalb der Produktion sichtbar): „Einwilligung durch den Klick ohne Speicherung, Rolle von Google (Art. 26 DSGVO) und Übermittlungsgrundlage (DPF-Zertifizierung von Google LLC) anwaltlich prüfen.“

**Dienstleister** (Abschnitt 3): „Google Ireland Limited (YouTube) (Gordon House, Barrow Street, Dublin 4, Irland) – Wiedergabe eingebetteter Videos auf den Tutorial-Seiten, erst nach Ihrem Klick auf „Video laden“; für die Verarbeitung nach dem Laden des Videos eigener Verantwortlicher.“ Prüfhinweis: „Rolle von Google bei eingebetteten Videos anwaltlich prüfen (gemeinsame Verantwortung für die Erhebung beim Laden, Art. 26 DSGVO, und Vereinbarung dazu).“

**Satz auf der Tutorial-Seite unter der Vorschau**: „Mit dem Klick auf „Video laden“ wird das Video von YouTube geladen. Dabei gehen Daten an YouTube. Mehr in der Datenschutzerklärung.“

Fragen an den Anwalt: Genügt der Klick auf „Video laden“ als Einwilligung nach § 25 Abs. 1 TDDDG, ohne sie zu speichern? Rolle von Google (gemeinsame Verantwortlichkeit für die Erhebung beim Laden)? Bleibt der Satz „Gespeichert wird nur, was für die von Ihnen genutzten Funktionen unbedingt nötig ist …“ mit dem neuen Absatz richtig? Fassung und Stand der Erklärung (`VERARBEITUNGEN_FASSUNG`, heute Fassung 2 vom 25.10.2026) sind bewusst nicht geändert, weil die Seite ohne Schalter Zeichen für Zeichen gleich bleiben muss.

## OFFENE FRAGEN

1. **Skript auf Tutorial-Seiten ohne Video (A-076).** Der Client-Baustein `VideoRahmen` hängt am Modulgraphen der Route `/tutorials/[slug]` und wird deshalb auf allen Tutorial-Seiten geladen, auch ohne Video und ohne Schalter: +0,5 KB gz je Einzelseite, +1,2 KB gz auf `/tutorials` durch Vorladen. Next.js teilt Client-Bausteine, die ein Serverbaustein importiert, nicht nach Bedarf auf (laut `lazy-loading.md`: „When a Server Component dynamically imports a Client Component, automatic code splitting is currently not supported“). Lösungswege außerhalb meines Schreibrechts: in `next.config.ts` hinter demselben Schalter einen Alias, der `video-rahmen` ohne Schalter durch eine leere Datei ersetzt (dann 0 B ohne Schalter); oder die Mehrlast als Preis der Einbettung annehmen. Entscheidung des Orchestrators.
2. **Admin-Hilfe „Erscheint auf“** (`src/payload/collections/Tutorials.ts`): sagt noch „Auf den Seiten und Schritten ist das noch nicht eingeschaltet.“ Das stimmt jetzt nicht mehr. Ändern braucht Schreibrecht und ein neu erzeugtes `payload-types.ts` (nur Kommentar). Vorschlag: „Hier wählen Sie, wo das Tutorial als Hilfe erscheint, auf Leistungsseiten und in Anfrageformularen.“
3. **Beschreibung im `VideoObject`**: Es gibt kein Feld „Beschreibung des Videos“. Ich nehme die sichtbare Kurzantwort des Tutorials (steht im Seitenkopf). Soll es ein eigenes Feld geben (Datenschema, nicht in diesem Paket)?
4. **`frame-src 'self' …`** statt nur `frame-src https://www.youtube-nocookie.com` wie im Auftrag: ohne `'self'` würden mit Schalter alle eigenen Rahmen gesperrt, die heute über `default-src 'self'` erlaubt sind. Fremd ist nur der eine Rahmen. Bitte bestätigen.
5. **Konfigurator**: Messen und Not- und Gefahrenfunktion stehen als zwei getrennte Verweise untereinander (je eigener Ort). Zusammenfassen zu einem Block?
6. **Probeneintrag-Kopie** `protokolle/FA-INHALT-01B/tutorials.json.kopie` liegt noch im Protokollordner (vom Auftrag verlangt). Löschen vor dem Commit?

## FÜR MENSCHEN

- **Anwalt**: den Entwurf oben prüfen (Absatz, Verarbeitung, Dienstleister, Satz unter der Vorschau, Einwilligung durch den Klick ohne Speicherung, Rolle von Google).
- **Inhaber**: Freigabe des geprüften Textes; danach Fassung und Stand der Datenschutzerklärung festlegen.
- **Betrieb**: erst nach Prüfung und Freigabe in den Umgebungsvariablen bei Vercel `SM24_VIDEOS=an` setzen und neu bauen lassen (Anleitung `docs/betrieb/tutorials-videos.md`). Bis dahin nichts tun; die Seite bleibt wie heute.
- **Inhaber/Team**: Videos bei YouTube veröffentlichen und im Admin verlinken, je ein eigenes Vorschaubild hochladen (für den Videoeintrag in den Strukturdaten nötig) und ein Transkript pflegen; Tutorials „Angaben im Fahrzeugschein“ und „Gehäuseumbau“ fachlich prüfen und veröffentlichen, dann erscheinen auch dort Hinweise.
- **Orchestrator**: OFFENE FRAGEN 1, 2 und 4 entscheiden.

=== ENDE FA-INHALT-01B · BEREIT ZUR RÜCKGABE ===
