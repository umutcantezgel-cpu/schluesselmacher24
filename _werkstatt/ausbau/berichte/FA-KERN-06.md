# FA-KERN-06 · Bericht

## GEÄNDERTE DATEIEN

- `src/lib/livegang-pruefung.ts`: neue Funktion `mailadresseFunde` und Konstante `EIGENE_MAILDOMAIN`; `firmendatenFunde` meldet die Firmen-E-Mail (leer, Platzhalter, fremde Domain), ohne den Wert auszugeben.
- `src/lib/livegang-pruefung.test.ts`: Tests für die Firmen-E-Mail (fremde Domain, Platzhalter, leer, Großschreibung).
- `src/lib/mail/adressen.test.ts` (neu): durchsucht `src`, `scripts`, `docs`, `content` und `.env.example` ohne Tests, Testdaten und `src/test`; außerhalb der Tests ist nur `schluesselmacher24.de` erlaubt. Prüft außerdem, dass die Firmen-E-Mail genau `info@schluesselmacher24.de` ist, und dass Antwort- und Betriebsadresse ohne Anbieter auf die Firmen-E-Mail fallen.
- `docs/betrieb/mail-einrichten.md` (neu): Anleitung für Zoho Mail, MX, SPF, DKIM, DMARC, Versanddienst Resend, Prüfung und Fundstellen.
- `docs/LIVEGANG.md`: nur Abschnitt 1 (Postfach) und Schritt 2 von Abschnitt 3 (Resend) verweisen auf die neue Anleitung.
- `_werkstatt/ausbau/berichte/FA-KERN-06.md` (dieser Bericht).

Nicht geändert: `content/settings.json`, Rechtstexte, `.env`-Dateien, `.env.example`, `src/lib/mail/**` und `src/lib/integrations/**` (kein Code mit Adressquelle war falsch, siehe Inventar).

## INVENTAR

Quellen der Absender-, Antwort- und Empfängeradressen. Stand: alle Stellen außerhalb der Tests.

| Datei und Zeile | Quelle | Wert oder Variable | Bewertung |
|---|---|---|---|
| `content/settings.json:12` | Einstellungen (Firma → E-Mail) | `info@schluesselmacher24.de` | Richtig, nicht verändert |
| `content/startwerte/2026-10-25/settings.json:12` | Schnappschuss des Seeds | `info@schluesselmacher24.de` | Richtig, Vergleichsstand, nicht ausgeliefert |
| `src/lib/data/defaults/settings.ts:26` | Standardwert ohne Datenbank | `[Platzhalter: E-Mail-Adresse]` | Absichtlich Platzhalter; die Livegang-Prüfung meldet ihn |
| `src/lib/rechtliches/firma.ts:78-80` | Firmen-E-Mail, nur wenn echt | `company.email` | Richtig; speist Impressum, Datenschutz, Widerruf, Fußzeile, Kontakt |
| `src/lib/mail/versand.ts:36-38` | `antwortAdresse`: `MAIL_REPLY_TO`, sonst Firmen-E-Mail | Variable oder Einstellung | Richtig |
| `src/lib/mail/versand.ts:41-46` | `teamEmpfaenger`: `MAIL_TEAM_ADDRESS`, sonst Firmen-E-Mail | Variable oder Einstellung | Richtig |
| `src/lib/mail/transport-resend.ts:176-179` | Absender und Antwort an Resend | `konfiguration.fromAddress`, `replyTo` | Richtig |
| `src/lib/umgebung.ts:177-189` | `mailKonfiguration` | `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO`, `MAIL_TEAM_ADDRESS`, `MAIL_REDIRECT_TO` | Richtig; Umleitung nur außerhalb der Produktion |
| `src/lib/integrations/index.ts:135` | Statusanzeige Mailversand | Liste der Pflicht-Variablen | Richtig |
| `src/lib/server/benachrichtigungen.ts:129, 392` | Warntexte im Log | Erwähnung von `MAIL_TEAM_ADDRESS` | Nur Text, keine Adresse |
| `src/lib/mail/vorlagen/erinnerung.ts:118` | UID der Kalenderdatei | Host der Seite (`host(kontext.site)`) | Keine Mailadresse |
| `src/lib/mail/vorlagen/testmail.ts:19` | Testmail-Text | „Absender und Antwortadresse“ | Nur Text |
| `.env.example:82, 85, 87` | Beispielwerte für Vercel | `info@schluesselmacher24.de` (Absender, Antwort, Team) | Richtig; `MAIL_REDIRECT_TO=` leer |
| `docs/LIVEGANG.md:26, 38, 64, 69-71` | Anleitung | `info@schluesselmacher24.de` (Postfach, DMARC-Bericht, Variablen) | Richtig |
| `docs/gestaltung/MENSCHEN.md:10` | Firmendaten-Notiz | `info@schluesselmacher24.de` | Richtig |
| `src/payload/globals/Einstellungen.ts` | Backend-Feld „E-Mail“ | Feld `email` | Richtig; kein fester Wert |
| `scripts/*`, `src/payload/**` (ohne Tests) | Seeds und Hooks | keine Adresse fest eingetragen | Kein Befund |
| `src/lib/kalender-ics.ts`, `src/lib/mail/termin-mails.test.ts`, `src/lib/server/*.test.ts` | Testdaten | `sm24-t-…@schluesselmacher24.de`, `team@`, `inhaber@`, `mina@`, `test@` | Testkennungen beziehungsweise Test-Empfänger auf eigener Domain; im Versand werden sie nicht fest verwendet |
| Tests in `src/**` | Testdaten | `example.*`, `example.invalid`, `beispiel.test` | Erlaubt |
| Keine Treffer | Suche nach `gmail`, `gmx`, `web.de`, `t-online`, `outlook`, `icloud`, `yahoo`, alten Wetzlar-Adressen | außerhalb von `_werkstatt` | Keine Gmail-Adresse und keine alte Betriebsadresse im Quelltext |

Ergebnis der Suche: In Code, Inhalten, Templates und Seeds ist keine fremde oder alte Mailadresse fest eingetragen. Alle Kundenadressen kommen aus der Firmen-E-Mail oder aus Umgebungsvariablen, die auf `info@schluesselmacher24.de` stehen.

## WAS UND WARUM

- **Adressquelle geprüft.** Die Regel „Kundenkontakt über Firma → E-Mail; Absender und Antwort aus den Einstellungen oder aus genau einer Umgebungsvariable“ ist bereits so umgesetzt. Es gab nichts umzubauen, deshalb ist kein Code in `src/lib/mail/**` oder `src/lib/integrations/**` geändert.
- **Neue Prüfung in der Livegang-Prüfung.** `mailadresseFunde` meldet, wenn die Firmen-E-Mail fehlt, ein Platzhalter ist oder nicht auf `schluesselmacher24.de` liegt. Der Wert erscheint nie im Bericht. Die Funktion hängt an `firmendatenFunde`, damit `npm run pruefen:livegang` sie ohne Änderung am Runner ausgibt.
- **Neuer Test für den Quelltext.** `src/lib/mail/adressen.test.ts` schlägt an, sobald eine Adresse außerhalb der eigenen Domain in ausgelieferten Dateien steht. Tests, Testdaten, `src/test` und `node_modules` sind ausgenommen. Die Dateiendungen wie `logo@2x.png` werden nicht als Adresse gewertet.
- **Anleitung.** `docs/betrieb/mail-einrichten.md` beschreibt die Einrichtung in Alltagssprache. Werte, die vom Konto abhängen (MX, DKIM, SPF-Angaben), stehen nicht im Dokument; dort steht, dass Zoho beziehungsweise Resend sie anzeigt. Der Versanddienst des Bestands ist Resend (`src/lib/mail/transport-resend.ts`, `src/lib/umgebung.ts`).
- **Keine erfundenen Werte.** Die Anleitung nennt keine SPF-Includes und keine DKIM-Namen. Das Konto liefert sie.

## PRÜFUNG UND ERGEBNIS

Alle Befehle über `_werkstatt/ausbau/werkzeuge/sicher.sh --json --`, ohne `--pg`, ohne Build, ohne Server, ohne Netzabruf.

- Gezielt: `npx vitest run src/lib/mail/adressen.test.ts src/lib/livegang-pruefung.test.ts`: 2 Dateien, 19 Tests, alle grün.
- `npx vitest run` (vollständig): 183 Dateien, 2372 Tests, alle grün, Exit 0.
- `npm run typecheck` (`tsc --noEmit`): ohne Fehler, Exit 0.
- `npm run lint` (`eslint .`): ohne Fehler, Exit 0.

Die Prüfungen wurden nicht abgeschaltet oder gelockert (G8).

Nicht ausgeführt: `npm run pruefen:livegang`. Es lädt die Payload-Konfiguration und verlangt damit mehr als die Unit-Prüfung; die Logik ist durch die Tests von `mailadresseFunde` und `firmendatenFunde` abgedeckt.

Gesamtergebnis: grün.

## OFFENE FRAGEN

1. **SPF und Resend-Unterdomain.** Die Vorgabe verlangt einen SPF-Eintrag am Hauptnamen, der Zoho und den Versanddienst nennt. `docs/LIVEGANG.md` (Abschnitt 3) lässt Resend dagegen SPF und MX auf der Unterdomain `send` einrichten. Beide Varianten lassen sich verbinden, aber der genaue Inhalt des Hauptnamen-Eintrags hängt von der Resend-Anzeige ab. Die Anleitung weist darauf hin; die Entscheidung liegt beim Menschen mit Kontozugang (MA-32).
2. **Region des Zoho-Kontos.** Die MX- und SPF-Werte hängen von der Region ab. Die Anleitung lässt sie offen.
3. **Alte Anschrift außerhalb des Mail-Abschnitts.** `docs/LIVEGANG.md` nennt in Zeile 76 „Gloelstraße 11“ und in Zeile 133 „Werkstatt Langgasse 70“. Das betrifft die Anschrift, nicht die Mail, und liegt außerhalb meines Schreibrechts. Der Orchestrator sollte prüfen, ob der Abschnitt angepasst wird (A-045).
4. **Git-Zweig.** Der Befehl `git branch --show-current` meldet `claude/new-session-li9jsf`. Das Startritual nennt `claude/designs-texte-live-czlz4t`. Ich habe nichts committet und keine Git-Konfiguration verändert.
5. **Fremde Änderungen im Arbeitsbaum.** Im Arbeitsbaum liegen Änderungen aus anderen Paketen (etwa `content/seo.json`, `src/lib/data/defaults/content.ts`, Autoschlüssel-Seiten). Ich habe sie weder angefasst noch verändert.

## FÜR MENSCHEN

- **MA-32 bleibt offen.** Postfach bei Zoho anlegen, DNS-Einträge setzen (MX, ein SPF-TXT am Hauptnamen, DKIM für Zoho und Resend, DMARC mit `p=none` zuerst), Domain bei Resend bestätigen. Konten und DNS ändert nur ein Mensch (G3). Danach `ANTWORTEN: Mail eingerichtet`.
- **Vercel prüfen (Scope Production).** `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und `MAIL_TEAM_ADDRESS` stehen dort auf `info@schluesselmacher24.de`. Die Werte in `.env.example` sind Beispiele, nicht die echten Schlüssel.
- **Testmail an mich** nach dem Einrichten senden und die Kopfzeilen prüfen (`spf=pass`, `dkim=pass`, `dmarc=pass`). Anleitung: `docs/betrieb/mail-einrichten.md`, Schritt 4.
- **DMARC später verschärfen** auf `p=quarantine`, wenn die Berichte an `info@` ruhig sind.
- **Anschrift in `docs/LIVEGANG.md`** (Zeilen 76 und 133) passt nicht mehr zu A-045. Entscheidung beim Orchestrator.
