# E-Mail einrichten: info@schluesselmacher24.de

Diese Anleitung richtet das Postfach für Kundenanfragen und Betriebsmails ein. Sie ist für Menschen geschrieben, die ein Konto bei Zoho und beim Domainhoster bedienen. Die Seite schreibt Kundenmails an die Adresse des Kunden. Absender, Antwortadresse und Betriebsempfänger kommen aus den Einstellungen und aus den Vercel-Werten in Schritt 3. Stehen diese auf `info@schluesselmacher24.de`, gehen Absender, Antwort und Betriebsmails über diese Adresse.

**Verbindliche Vorgabe:** Kundenanfragen laufen über `info@schluesselmacher24.de`. Keine alte Betriebsadresse und keine Gmail-Adresse für Kundenanfragen.

Wo ein Wert vom Konto abhängt, steht in dieser Anleitung „den Wert zeigt Zoho beziehungsweise der Versanddienst an“. Diese Werte werden hier nicht erfunden und nicht aus alten Anleitungen übernommen. Man kopiert sie aus dem jeweiligen Konto.

## Was man braucht

- Zugang zum Domainhoster (dort liegen die DNS-Einträge der Domain `schluesselmacher24.de`)
- Zugang zu Zoho Mail (Postfach für die Domain)
- Zugang zu Resend (Versanddienst der Seite, siehe `docs/LIVEGANG.md`, Abschnitt 3)
- Zugang zu Vercel, Scope „Production“, für die Umgebungsvariablen

Konten und DNS ändert nur ein Mensch mit Zugang. Die Seite kann das nicht übernehmen.

## Schritt 1: Postfach bei Zoho Mail

1. In Zoho Mail die Domain `schluesselmacher24.de` hinzufügen.
2. Zoho verlangt, dass man die Domain bestätigt. Dafür legt man den TXT-Eintrag an, den Zoho anzeigt. Den Wert zeigt Zoho an.
3. Das Postfach `info@schluesselmacher24.de` anlegen.
4. Die MX-Einträge setzen, die Zoho anzeigt. Die Werte zeigt Zoho an. Die Einträge müssen die Zustellung übernehmen, bevor Mails ankommen.
5. Zoho zeigt an, wenn die Domain und das Postfach bereit sind.

## Schritt 2: DNS-Einträge beim Domainhoster

Vier Einträge sind wichtig. Sie sorgen dafür, dass Mails ankommen und nicht als Spam oder Fälschung gelten.

### MX

Die MX-Einträge von Zoho aus Schritt 1 unverändert übernehmen. Den Wert zeigt Zoho an.

### SPF: genau ein TXT-Eintrag am Hauptnamen

- Es darf nur **ein** SPF-Eintrag auf dem Hauptnamen der Domain (`@`) existieren. Zwei SPF-Einträge machen SPF ungültig, dann landen Mails oft im Spam.
- Am Hauptnamen steht nur der SPF-Eintrag von Zoho. Den Wert zeigt Zoho an.
- Resend legt seinen eigenen SPF-Eintrag auf der Unterdomain `send` an. Den Wert zeigt Resend an. Er gehört nicht an den Hauptnamen.
- Nur wenn Resend ausdrücklich einen Eintrag für den Hauptnamen anzeigt, kommt diese Angabe in denselben Eintrag wie Zoho.
- Ein bestehender SPF-Eintrag am Hauptnamen wird ersetzt, nicht ergänzt.

Die Abweichung von der Vorgabe, die einen gemeinsamen Eintrag verlangt, ist offen, siehe unten.

### DKIM: je Dienst ein eigener Schlüssel

- Zoho zeigt einen DKIM-Eintrag für die Domain an. Den Namen und den Wert zeigt Zoho an.
- Resend zeigt einen eigenen DKIM-Eintrag an. Den Namen und den Wert zeigt Resend an.
- Beide Einträge werden getrennt angelegt. Keiner ersetzt den anderen.

### DMARC: zuerst nur beobachten

Am Anfang steht ein TXT-Eintrag auf dem Namen `_dmarc` mit diesem Wert:

```
v=DMARC1; p=none; rua=mailto:info@schluesselmacher24.de
```

- `p=none` bedeutet: Es passiert nichts mit fehlerhaften Mails. Man bekommt nur Berichte an `info@`.
- Nach einigen Wochen, in denen die Berichte und Testmails unauffällig sind, wird `p=none` durch `p=quarantine` ersetzt. Dann landen gefälschte Mails im Spam statt im Posteingang.

## Schritt 3: Versanddienst (Resend) und Vercel

Resend prüft die Domain. Dafür setzt man die Einträge, die Resend anzeigt (DKIM und die Angaben auf der Unterdomain `send`). Anschließend zeigt Resend die Domain als bestätigt an.

In Vercel (Scope „Production“) stehen diese Werte. Sie sind in `.env.example` und `docs/LIVEGANG.md` beschrieben:

| Variable | Wert | Wozu |
|---|---|---|
| `MAIL_PROVIDER` | `resend` | Versanddienst |
| `MAIL_API_KEY` | aus Resend | Zugang zum Versand, nur „Sending access“ auf diese Domain |
| `MAIL_FROM_ADDRESS` | `info@schluesselmacher24.de` | Absender aller Mails der Seite |
| `MAIL_FROM_NAME` | `SCHLÜSSELMACHER24` | Anzeigename des Absenders |
| `MAIL_REPLY_TO` | `info@schluesselmacher24.de` | Antworten der Kunden landen hier |
| `MAIL_TEAM_ADDRESS` | `info@schluesselmacher24.de` | Empfänger der Betriebsmails (neuer Vorgang, Zahlung, Widerruf); mehrere Adressen kommagetrennt |
| `MAIL_REDIRECT_TO` | leer lassen | Nur für Vorschauen; wirkt in Produktion nie |

Ohne `MAIL_REPLY_TO` nimmt die Seite die Firmen-E-Mail aus den Einstellungen. Ohne `MAIL_TEAM_ADDRESS` ebenso.

## Schritt 4: prüfen, ob es wirkt

1. Im Backend unter Einstellungen → Anbindungen **Testmail an mich** senden. Die Mail muss im Posteingang ankommen, nicht im Spam.
2. Die Testmail öffnen, „Originalnachricht anzeigen“ oder „Kopfzeilen anzeigen“ wählen. Dort stehen drei Ergebnisse: `spf=pass`, `dkim=pass`, `dmarc=pass`. Steht dort etwas anderes als `pass`, zuerst die DNS-Einträge aus Schritt 2 prüfen.
3. Auf die Testmail antworten. Die Antwort muss in `info@schluesselmacher24.de` ankommen.
4. Im Zoho-Postfach prüfen, dass die Antwort dort liegt.

Die Testmail geht an die Adresse, die im Backend angemeldet ist.

## Wo in der Seite Absender und Empfänger stehen

| Was | Wo es steht | Wer es nutzt |
|---|---|---|
| Firmen-E-Mail | Backend → Einstellungen → Firma → E-Mail | Impressum, Datenschutz, Widerruf, Fußzeile, Kontakt, strukturierte Daten (Suchmaschinen) |
| Absender | `MAIL_FROM_ADDRESS` in Vercel | alle Mails der Seite, auch Backend-Mails wie Passwort zurücksetzen und Einladungen |
| Antwortadresse | `MAIL_REPLY_TO`, sonst Firmen-E-Mail | Bestätigungen und Statusmails an Kunden |
| Betriebsempfänger | `MAIL_TEAM_ADDRESS`, sonst Firmen-E-Mail | Mails an den Betrieb |

Im Quelltext ist keine andere Adresse fest eingetragen. Der Test `src/lib/mail/adressen.test.ts` prüft Quelltext, Inhalte und die Wurzeldateien (README, UMSETZUNG, vercel.json, next.config.ts, package.json). Außerhalb der Tests sind nur Adressen auf `schluesselmacher24.de` erlaubt.

Die Livegang-Prüfung (`npm run pruefen:livegang`) meldet die Firmen-E-Mail, wenn sie fehlt, ein Platzhalter ist oder nicht auf `schluesselmacher24.de` liegt. Ebenso meldet sie `MAIL_FROM_ADDRESS`, `MAIL_REPLY_TO` und `MAIL_TEAM_ADDRESS`, wenn dort eine Adresse nicht auf der eigenen Domain liegt. Gemeldet wird nur der Name der Variable, nie der Wert.

## Häufige Fehler

- **Zwei SPF-Einträge.** Ergebnis: `spf=permerror`. Nur einen Eintrag führen.
- **DKIM-Name abgeschrieben, Punkt vergessen.** Ergebnis: `dkim=fail`. Namen und Werte exakt aus dem Konto kopieren.
- **DNS-Einträge noch nicht verbreitet.** Nach einer Änderung kann es einige Zeit dauern, bis alle Prüfungen grün sind. Erst danach die Testmail senden.
- **Gmail-Adresse als Kundenadresse.** Nicht eintragen. Kundenanfragen laufen nur über `info@schluesselmacher24.de`.

## Offene Fragen

- Die Vorgabe sieht einen SPF-Eintrag am Hauptnamen vor, der Zoho und Resend nennt. Resend legt seinen eigenen SPF-Eintrag laut `docs/LIVEGANG.md` auf der Unterdomain `send` an. Diese Abweichung von der Vorgabe liegt offen beim Inhaber (MA-32). Vor dem Setzen mit der Resend-Anzeige abgleichen.
- Das Feld E-Mail im Backend (Einstellungen → Firma) hat noch keinen Hinweis, dass nur eine Adresse auf `schluesselmacher24.de` passt. Gemeldet wird eine fremde Domain erst in der Livegang-Prüfung. Ein Hinweis am Feld wäre sinnvoll, ist aber außerhalb dieses Pakets (Schreibrecht offen).
- Die Region des Zoho-Kontos (EU oder andere) bestimmt die Werte für MX und SPF. Welche Region gilt, legt das Konto fest.
