# FA-KERN-06 · Bericht

## GEÄNDERTE DATEIEN

- `src/lib/livegang-pruefung.ts`: neue Funktionen `liegtAufEigenerDomain` und `umgebungsMailFunde` (prüft `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und jeden Eintrag von `MAIL_TEAM_ADDRESS`, meldet nur den Variablennamen); `mailadresseFunde` meldet Platzhalter nicht mehr, weil `firmendatenPruefen` sie schon unter „Noch offen“ meldet; `firmendatenFunde` meldet die Firmen-E-Mail (leer, fremde Domain), ohne den Wert auszugeben.
- `src/scripts/livegang-pruefen.ts`: Runner ruft `umgebungsMailFunde()` auf.
- `src/lib/livegang-pruefung.test.ts`: Tests für die Firmen-E-Mail (fremde Domain, Platzhalter genau einmal, leer, Großschreibung) und für `umgebungsMailFunde`.
- `src/lib/mail/adressen.test.ts` (neu): durchsucht `src`, `scripts`, `docs`, `content`, `.env.example` und die Wurzeldateien `README.md`, `UMSETZUNG.md`, `vercel.json`, `next.config.ts`, `package.json` ohne Tests, Testdaten und `src/test`; außerhalb der Tests ist nur `schluesselmacher24.de` erlaubt. Prüft außerdem, dass bekannte Fundstellen gefunden werden, dass die Firmen-E-Mail genau `info@schluesselmacher24.de` ist, und dass Antwort- und Betriebsadresse ohne Anbieter auf die Firmen-E-Mail fallen.
- `docs/betrieb/mail-einrichten.md` (neu): Anleitung für Zoho Mail, MX, SPF, DKIM, DMARC, Versanddienst Resend, Prüfung und Fundstellen.
- `docs/LIVEGANG.md`: nur Abschnitt 1 (Postfach) und Schritt 2 von Abschnitt 3 (Resend) verweisen auf die neue Anleitung.
- `_werkstatt/ausbau/berichte/FA-KERN-06.md` (dieser Bericht).

Nicht geändert: `content/settings.json`, `src/payload/globals/Einstellungen.ts` (außerhalb des Schreibrechts), Rechtstexte, `.env`-Dateien, `.env.example`, `src/lib/mail/**` und `src/lib/integrations/**` (kein Code mit Adressquelle war falsch, siehe Inventar).

## INVENTAR

Quellen der Absender-, Antwort- und Empfängeradressen. Stand: alle Stellen außerhalb der Tests.

| Datei und Zeile | Quelle | Wert oder Variable | Bewertung |
|---|---|---|---|
| `content/settings.json:12` | Einstellungen (Firma → E-Mail) | `info@schluesselmacher24.de` | Richtig, nicht verändert |
| `content/startwerte/2026-10-25/settings.json:12` | Schnappschuss des Seeds | `info@schluesselmacher24.de` | Richtig, Vergleichsstand, nicht ausgeliefert |
| `src/lib/data/defaults/settings.ts:26` | Standardwert ohne Datenbank | `[Platzhalter: E-Mail-Adresse]` | Absichtlich Platzhalter; die Livegang-Prüfung meldet ihn einmal (unter „Noch offen“) |
| `src/lib/rechtliches/firma.ts:78-80` | Firmen-E-Mail, nur wenn echt | `company.email` | Richtig; speist Impressum, Datenschutz, Widerruf, Fußzeile, Kontakt, strukturierte Daten (`src/components/seo/json-ld.tsx:59-73`) |
| `src/lib/mail/versand.ts:36-38` | `antwortAdresse`: `MAIL_REPLY_TO`, sonst Firmen-E-Mail | Variable oder Einstellung | Richtig |
| `src/lib/mail/versand.ts:41-46` | `teamEmpfaenger`: `MAIL_TEAM_ADDRESS`, sonst Firmen-E-Mail | Variable oder Einstellung | Richtig |
| `src/lib/mail/transport-resend.ts:176-179` | Absender und Antwort an Resend | `konfiguration.fromAddress`, `replyTo` | Richtig |
| `src/lib/umgebung.ts:177-189` | `mailKonfiguration` | `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO`, `MAIL_TEAM_ADDRESS`, `MAIL_REDIRECT_TO` | Richtig; Umleitung nur außerhalb der Produktion |
| `src/payload.config.ts:113-115` | Payload-Systemmails (Passwort zurücksetzen, Einladungen): `resendAdapter` mit `defaultFromAddress` | `mail.fromAddress` aus `MAIL_FROM_ADDRESS` (über `mailKonfiguration`) | Richtig; Absender der Backend-Mails, deshalb in der Livegang-Prüfung mitgeprüft |
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

Ergebnis der Suche: In Code, Inhalten, Templates und Seeds ist keine fremde oder alte Mailadresse fest eingetragen. Die Kundenadressen kommen aus der Firmen-E-Mail oder aus den Umgebungsvariablen (Vercel). In `.env.example` stehen diese Variablen auf `info@schluesselmacher24.de`. Welche echten Werte in Vercel stehen, ist nicht geprüft und kann nur ein Mensch prüfen.

## WAS UND WARUM

- **Adressquelle geprüft.** Die Regel „Kundenkontakt über Firma → E-Mail; Absender und Antwort aus den Einstellungen oder aus genau einer Umgebungsvariable“ ist bereits so umgesetzt. Es gab nichts umzubauen, deshalb ist kein Code in `src/lib/mail/**` oder `src/lib/integrations/**` geändert.
- **Neue Prüfung in der Livegang-Prüfung.** `mailadresseFunde` meldet leere und fremde Firmen-E-Mails. `umgebungsMailFunde` prüft `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und jeden Eintrag von `MAIL_TEAM_ADDRESS` mit derselben Domainregel (`liegtAufEigenerDomain`) und meldet nur den Variablennamen. Der Runner `src/scripts/livegang-pruefen.ts` ruft beides auf, `npm run pruefen:livegang` gibt die Funde aus.
- **Neuer Test für den Quelltext.** `src/lib/mail/adressen.test.ts` schlägt an, sobald eine Adresse außerhalb der eigenen Domain in ausgelieferten Dateien und Wurzeldateien steht. Tests, Testdaten, `src/test` und `node_modules` sind ausgenommen. Bildnamen mit Dichte-Angabe wie `logo@2x.png` werden nicht als Adresse gewertet; alle anderen Endungen wie `.md` oder `.js` werden geprüft.
- **Anleitung.** `docs/betrieb/mail-einrichten.md` beschreibt die Einrichtung in Alltagssprache. Werte, die vom Konto abhängen (MX, DKIM, SPF-Angaben), stehen nicht im Dokument; dort steht, dass Zoho beziehungsweise Resend sie anzeigt. Der Versanddienst des Bestands ist Resend (`src/lib/mail/transport-resend.ts`, `src/lib/umgebung.ts`).
- **Keine erfundenen Werte.** Die Anleitung nennt keine SPF-Includes und keine DKIM-Namen. Das Konto liefert sie.

## PRÜFUNG UND ERGEBNIS

Alle Befehle über `_werkstatt/ausbau/werkzeuge/sicher.sh --json --`, ohne `--pg`, ohne Build, ohne Server, ohne Netzabruf.

- Gezielt: `npx vitest run src/lib/mail/adressen.test.ts src/lib/livegang-pruefung.test.ts`: 2 Dateien, 24 Tests, alle grün.
- `npx vitest run` (vollständig): 184 Dateien, 2381 Tests, alle grün, Exit 0.
- `npm run typecheck` (`tsc --noEmit`): ohne Fehler, Exit 0.
- `npm run lint` (`eslint .`): ohne Fehler, Exit 0.

Die Prüfungen wurden nicht abgeschaltet oder gelockert (G8).

Nicht ausgeführt: `npm run pruefen:livegang`. Es lädt die Payload-Konfiguration und verlangt damit mehr als die Unit-Prüfung; die Logik ist durch die Tests von `mailadresseFunde`, `umgebungsMailFunde` und `firmendatenFunde` abgedeckt.

Gesamtergebnis: grün.

## OFFENE FRAGEN

1. **SPF und Resend-Unterdomain.** Die Vorgabe verlangt einen SPF-Eintrag am Hauptnamen, der Zoho und den Versanddienst nennt. `docs/LIVEGANG.md` (Abschnitt 3) lässt Resend dagegen SPF und MX auf der Unterdomain `send` einrichten. Die Anleitung nennt das als Abweichung; die Entscheidung liegt beim Inhaber (MA-32).
2. **Region des Zoho-Kontos.** Die MX- und SPF-Werte hängen von der Region ab. Die Anleitung lässt sie offen.
3. **Alte Anschrift außerhalb des Mail-Abschnitts.** `docs/LIVEGANG.md` nennt in Zeile 76 „Gloelstraße 11“ und in Zeile 133 „Werkstatt Langgasse 70“. Das betrifft die Anschrift, nicht die Mail, und liegt außerhalb meines Schreibrechts. Der Orchestrator sollte prüfen, ob der Abschnitt angepasst wird (A-045).
4. **Git-Zweig und Commits.** Der Befehl `git branch --show-current` meldet `claude/new-session-li9jsf`. Das Startritual nennt `claude/designs-texte-live-czlz4t`. Ich habe nichts committet und keine Git-Konfiguration verändert. Während des Laufs entstanden die Commits `53658db` (12:27:52, „Zwischenstand laufender Pakete, noch ungeprüft“) und `37f5279` (12:28:33, Laufprotokoll aus der Versionierung genommen). Nicht von mir. `53658db` enthält meine Nachbesserungsstände bereits, bevor die Gegenprüfung abgeschlossen ist. Ob das so bleibt, entscheidet der Orchestrator.
5. **Fremde Änderungen im Arbeitsbaum.** Im Arbeitsbaum liegen Änderungen aus anderen Paketen (etwa `content/seo.json`, `src/lib/data/defaults/content.ts`, Autoschlüssel-Seiten). Ich habe sie weder angefasst noch verändert.
6. **Hinweis am Backend-Feld „E-Mail“.** Das Feld in `src/payload/globals/Einstellungen.ts` trägt keine Beschreibung, dass nur eine Adresse auf `schluesselmacher24.de` passt. Die Ergänzung wäre sinnvoll, liegt aber außerhalb des Schreibrechts dieses Pakets. Entscheidung beim Orchestrator.
7. **Domainprüfung im Build.** `scripts/build.mjs:124` prüft nur, ob die Variablen gesetzt sind. Die Domainprüfung läuft im Runner `pruefen:livegang`, der im Produktions-Build Pflicht ist. Eine Änderung an `scripts/build.mjs` liegt außerhalb des Schreibrechts.

## FÜR MENSCHEN

- **MA-32 bleibt offen.** Postfach bei Zoho anlegen, DNS-Einträge setzen (MX, ein SPF-TXT am Hauptnamen, DKIM für Zoho und Resend, DMARC mit `p=none` zuerst), Domain bei Resend bestätigen. Konten und DNS ändert nur ein Mensch (G3). Danach `ANTWORTEN: Mail eingerichtet`.
- **Vercel prüfen (Scope Production).** `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und `MAIL_TEAM_ADDRESS` in Vercel auf `info@schluesselmacher24.de` setzen oder prüfen. `npm run pruefen:livegang` meldet fremde Domains in diesen Variablen, ohne den Wert zu zeigen. Die Werte in `.env.example` sind Beispiele, nicht die echten Schlüssel; ob die echten Vercel-Werte stimmen, prüft ein Mensch.
- **Testmail an mich** nach dem Einrichten senden und die Kopfzeilen prüfen (`spf=pass`, `dkim=pass`, `dmarc=pass`). Anleitung: `docs/betrieb/mail-einrichten.md`, Schritt 4.
- **DMARC später verschärfen** auf `p=quarantine`, wenn die Berichte an `info@` ruhig sind.
- **Anschrift in `docs/LIVEGANG.md`** (Zeilen 76 und 133) passt nicht mehr zu A-045. Entscheidung beim Orchestrator.

## NACHBESSERUNG

Befunde der beiden Gegenprüfer, je am Code geprüft.

1. **[rot] Umgebungsvariablen ohne Domainprüfung: behoben.** `umgebungsMailFunde` in `src/lib/livegang-pruefung.ts` prüft `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und `MAIL_TEAM_ADDRESS` mit der Domainregel `liegtAufEigenerDomain` und meldet nur den Variablennamen. Der Runner ruft die Funktion auf. Tests in `src/lib/livegang-pruefung.test.ts` (Umgebung: richtige Werte, leer, fremde Antwortadresse, fremder Absender und Betriebsempfänger). Die Behauptung im Bericht, die Variablen stünden auf `info@`, ist auf `.env.example` eingeschränkt (siehe Ergebnis der Suche und FÜR MENSCHEN).
2. **[rot] Anleitung zu „die Seite schreibt nur an info@“: behoben.** Die Einleitung von `docs/betrieb/mail-einrichten.md` sagt jetzt, dass die Seite Kundenmails an die Adresse des Kunden schreibt und dass Absender, Antwort und Betriebsmails aus den Einstellungen und Vercel-Werten kommen.
3. **[gelb] SPF-Widerspruch in der Anleitung: behoben.** Der Abschnitt „SPF“ sagt jetzt eindeutig: Am Hauptnamen steht nur der SPF von Zoho; Resend legt seinen auf `send` an; ein gemeinsamer Eintrag nur, wenn Resend ihn ausdrücklich anzeigt. Schritt 3 nennt die Einträge, die Resend anzeigt. Die Abweichung von der Vorgabe steht als offene Frage für den Inhaber (MA-32).
4. **[gelb] Inventar ohne `src/payload.config.ts`: behoben.** Zeile im Inventar ergänzt (Quelle `MAIL_FROM_ADDRESS`, Backend-Systemmails). In `docs/betrieb/mail-einrichten.md` steht beim Absender jetzt „auch Backend-Mails wie Passwort zurücksetzen und Einladungen“.
5. **[gelb] Wurzeldateien nicht geprüft: behoben.** `PRUEFBAR` in `src/lib/mail/adressen.test.ts` enthält `README.md`, `UMSETZUNG.md`, `vercel.json`, `next.config.ts` und `package.json`. Der Test bleibt grün, dort steht keine fremde Adresse.
6. **[gelb] Platzhalter doppelt gemeldet: behoben.** `mailadresseFunde` meldet einen Platzhalter nicht mehr; `firmendatenPruefen` meldet ihn unter „Noch offen“. Test: Eine Firmen-E-Mail mit Platzhalter ergibt genau einen Fund.
7. **[gelb] Strukturierte Daten fehlen in der Tabelle: teilweise.** Die Spalte „Wer es nutzt“ nennt jetzt „strukturierte Daten (Suchmaschinen)“. Der Hinweis am Backend-Feld (`Einstellungen.ts`, Feld `email`) ist nicht umgesetzt, weil das Schreibrecht fehlt; offene Frage 6.
8. **[gelb] Bestandsprüfung könnte leer grün sein: behoben.** Der Test in `src/lib/mail/adressen.test.ts` prüft zusätzlich, dass `.env.example` und `content/settings.json` die Adresse `info@schluesselmacher24.de` enthalten. Sonst wäre die Prüfung auf fremde Adressen bei einer kaputten Suche leer und grün.
9. **[gelb] Endungsausnahme zu breit: behoben.** `KEINE_DOMAIN_ENDUNG` ist durch `BILDNAME` ersetzt, das nur Bildnamen mit Dichte-Angabe (`@2x.png` und ähnlich) ausnimmt. Probe: `kunde@firma.md` wird als Adresse erkannt, `logo@2x.png` nicht.
10. **[gelb] Satz „schreibt und antwortet nur an info@“ ungenau: behoben.** Zusammen mit Befund 2 umformuliert: Kundenmails gehen an den Kunden; Absender, Antwortadresse und Betriebsempfänger sind `info@`, sofern die Einstellungen und Vercel-Werte so gesetzt sind.

Neun Befunde sind vollständig behoben. Befund 7 ist nur teilweise behoben: Der Hinweis am Backend-Feld liegt außerhalb des Schreibrechts. Kein Befund war unzutreffend. Die offenen Punkte zu Befund 7 (Backend-Feld) und zur Domainprüfung im Build (`scripts/build.mjs`) liegen beim Orchestrator (offene Fragen 6 und 7).

## ABNAHME (Orchestrator, 15.11.2026)

- **Umgebungsadressen sind ein Hinweis, kein Abbruch.** `umgebungsMailFunde` bleibt, der Runner `src/scripts/livegang-pruefen.ts` gibt die Funde aber nur als Hinweis aus und bricht den Produktions-Build dafür nicht ab. Grund: Absender und Antwortadresse dürfen erst auf `info@schluesselmacher24.de` zeigen, wenn das Postfach steht (MA-32). Ein erzwungener Wechsel vorher ließe Antworten von Kunden ins Leere laufen und hielte jede Veröffentlichung an. Die Firmen-E-Mail (Einstellungen) bleibt ein harter Fund. `docs/betrieb/mail-einrichten.md` beschreibt beides.
- **Hinweis am Backend-Feld ergänzt** (offene Frage 6): `src/payload/globals/Einstellungen.ts`, Feld E-Mail, mit kurzem Hilfetext zur eigenen Domain. Kein Schema geändert.
- **Alte Anschriften in `docs/LIVEGANG.md` berichtigt** (A-045): Langgasse 61 statt Gloelstraße 11 und Werkstatt Langgasse 70; „Öffnungszeiten“ dort durch die Aussage zur Erreichbarkeit und die Terminzeiten der Werkstatt ersetzt.
- **Zweigname**: `claude/new-session-li9jsf` ist richtig (A-043); die ältere Angabe im Startritual ist überholt.
