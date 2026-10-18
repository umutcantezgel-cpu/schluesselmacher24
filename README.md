# SCHLÜSSELMACHER24

Website und Shop für Autoschlüssel, Schlüssel, Schließtechnik, elektronische
Zutrittslösungen und Sicherheitstechnik. Domain: `schluesselmacher24.de`

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Technischer Aufbau

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS 3** mit semantischen CSS-Variablen (`src/app/globals.css`)
- **Formulare**: react-hook-form + zod
- **Zwischenspeicherung** langer Konfiguratoren: `src/lib/flow/`
- **Datenschicht**: `src/lib/data/` — austauschbarer Adapter,
  Standard ist der JSON-Adapter auf `content/`

## Inhaltspflege ohne Entwickler

Alle pflegbaren Werte liegen in `content/*.json` und werden über das
Backend unter `/admin` bearbeitet:

| Datei | Inhalt |
|---|---|
| `content/settings.json` | Firmendaten, Öffnungszeiten, Vorlaufzeit, Anzahlung, Terminlängen |
| `content/service-pricing.json` | Preise, Anzahlung, Terminlänge je Leistung/Fahrzeuggruppe |
| `content/code-lines.json` | Codelinien (Shop-Produkte) |
| `content/cylinder-catalog.json` | Zylinderarten, Maße, Funktionen, Optionen |
| `content/vehicles.json` | Fahrzeugmarken, Modelle, Schlüsselarten |
| `content/blocked-days.json` | Sperrtage, Urlaub, Feiertage |
| `content/seo.json` | Titel, Beschreibung, Texte und interne Links je Seite |
| `content/guides.json` · `content/cities.json` | Ratgeber- und Stadtseiten |
| `content/records.json` | Vorgänge: Bestellungen, Anfragen, Termine, Projekte |

## Offene Anbindungen

Siehe `UMSETZUNG.md` — Zahlung, Mailversand und Datei-Ablage sind
vorbereitet, aber ohne Zugangsdaten inaktiv.




## Architecture Matrix

# Architecture Matrix

| URL Pfad | Datei | Status | Wörter (Ist) | Wörter (Soll) |
|---|---|---|---|---|
| /artikel/[slug] | src/app/(site)/artikel/[slug]/page.tsx | THIN_CONTENT | 558 | 950 |
| /artikel | src/app/(site)/artikel/page.tsx | THIN_CONTENT | 430 | 950 |
| /autoschluessel/anfrage | src/app/(site)/autoschluessel/anfrage/page.tsx | THIN_CONTENT | 344 | 950 |
| /autoschluessel/fahrzeugoeffnung | src/app/(site)/autoschluessel/fahrzeugoeffnung/page.tsx | THIN_CONTENT | 194 | 950 |
| /autoschluessel/funkschluessel | src/app/(site)/autoschluessel/funkschluessel/page.tsx | THIN_CONTENT | 177 | 950 |
| /autoschluessel/kopieren | src/app/(site)/autoschluessel/kopieren/page.tsx | THIN_CONTENT | 217 | 950 |
| /autoschluessel/marken/[make]/[model] | src/app/(site)/autoschluessel/marken/[make]/[model]/page.tsx | THIN_CONTENT | 789 | 950 |
| /autoschluessel/marken/[make] | src/app/(site)/autoschluessel/marken/[make]/page.tsx | THIN_CONTENT | 547 | 950 |
| /autoschluessel/marken | src/app/(site)/autoschluessel/marken/page.tsx | THIN_CONTENT | 437 | 950 |
| /autoschluessel/nachmachen | src/app/(site)/autoschluessel/nachmachen/page.tsx | THIN_CONTENT | 108 | 950 |
| /autoschluessel | src/app/(site)/autoschluessel/page.tsx | OK | 1422 | 1622 |
| /autoschluessel/programmieren | src/app/(site)/autoschluessel/programmieren/page.tsx | THIN_CONTENT | 211 | 950 |
| /autoschluessel/schluesselbart-fraesen | src/app/(site)/autoschluessel/schluesselbart-fraesen/page.tsx | THIN_CONTENT | 198 | 950 |
| /autoschluessel/smart-key | src/app/(site)/autoschluessel/smart-key/page.tsx | THIN_CONTENT | 249 | 950 |
| /bestellung/[id] | src/app/(site)/bestellung/[id]/page.tsx | OK | 895 | 1095 |
| /elektronische-zutrittsloesungen/konfigurator | src/app/(site)/elektronische-zutrittsloesungen/konfigurator/page.tsx | THIN_CONTENT | 231 | 950 |
| /elektronische-zutrittsloesungen | src/app/(site)/elektronische-zutrittsloesungen/page.tsx | OK | 1848 | 2048 |
| /gleichschliessende-zylinder/konfigurator | src/app/(site)/gleichschliessende-zylinder/konfigurator/page.tsx | THIN_CONTENT | 191 | 950 |
| /gleichschliessende-zylinder | src/app/(site)/gleichschliessende-zylinder/page.tsx | OK | 1277 | 1477 |
| /kasse | src/app/(site)/kasse/page.tsx | THIN_CONTENT | 148 | 950 |
| / | src/app/(site)/page.tsx | THIN_CONTENT | 490 | 950 |
| /ratgeber/[slug] | src/app/(site)/ratgeber/[slug]/page.tsx | THIN_CONTENT | 216 | 950 |
| /ratgeber | src/app/(site)/ratgeber/page.tsx | THIN_CONTENT | 125 | 950 |
| /rechtliches/agb | src/app/(site)/rechtliches/agb/page.tsx | THIN_CONTENT | 412 | 950 |
| /rechtliches/cookie-einstellungen | src/app/(site)/rechtliches/cookie-einstellungen/page.tsx | THIN_CONTENT | 205 | 950 |
| /rechtliches/datenschutz | src/app/(site)/rechtliches/datenschutz/page.tsx | THIN_CONTENT | 731 | 950 |
| /rechtliches/impressum | src/app/(site)/rechtliches/impressum/page.tsx | THIN_CONTENT | 233 | 950 |
| /rechtliches/versand-und-zahlung | src/app/(site)/rechtliches/versand-und-zahlung/page.tsx | THIN_CONTENT | 351 | 950 |
| /rechtliches/widerruf | src/app/(site)/rechtliches/widerruf/page.tsx | THIN_CONTENT | 374 | 950 |
| /schliessanlagen/konfigurator | src/app/(site)/schliessanlagen/konfigurator/page.tsx | THIN_CONTENT | 262 | 950 |
| /schliessanlagen | src/app/(site)/schliessanlagen/page.tsx | OK | 1447 | 1647 |
| /schluessel-nach-code/[slug] | src/app/(site)/schluessel-nach-code/[slug]/page.tsx | THIN_CONTENT | 474 | 950 |
| /schluessel-nach-code | src/app/(site)/schluessel-nach-code/page.tsx | THIN_CONTENT | 310 | 950 |
| /schluessel-nach-vorlage/anfrage | src/app/(site)/schluessel-nach-vorlage/anfrage/page.tsx | THIN_CONTENT | 124 | 950 |
| /schluessel-nach-vorlage | src/app/(site)/schluessel-nach-vorlage/page.tsx | OK | 1228 | 1428 |
| /service-und-termin/anfrage | src/app/(site)/service-und-termin/anfrage/page.tsx | THIN_CONTENT | 83 | 950 |
| /service-und-termin/kontakt | src/app/(site)/service-und-termin/kontakt/page.tsx | THIN_CONTENT | 221 | 950 |
| /service-und-termin | src/app/(site)/service-und-termin/page.tsx | OK | 1296 | 1496 |
| /service-und-termin/terminstatus | src/app/(site)/service-und-termin/terminstatus/page.tsx | THIN_CONTENT | 53 | 950 |
| /service-und-termin/vor-ort | src/app/(site)/service-und-termin/vor-ort/page.tsx | THIN_CONTENT | 457 | 950 |
| /sicherheitstechnik/[slug] | src/app/(site)/sicherheitstechnik/[slug]/page.tsx | THIN_CONTENT | 389 | 950 |
| /sicherheitstechnik | src/app/(site)/sicherheitstechnik/page.tsx | THIN_CONTENT | 545 | 950 |
| /sicherheitstechnik/sicherheitscheck | src/app/(site)/sicherheitstechnik/sicherheitscheck/page.tsx | THIN_CONTENT | 181 | 950 |
| /standorte/[city] | src/app/(site)/standorte/[city]/page.tsx | THIN_CONTENT | 210 | 950 |
| /standorte | src/app/(site)/standorte/page.tsx | THIN_CONTENT | 120 | 950 |
| /tuer-und-schliesstechnik/[slug] | src/app/(site)/tuer-und-schliesstechnik/[slug]/page.tsx | THIN_CONTENT | 266 | 950 |
| /tuer-und-schliesstechnik | src/app/(site)/tuer-und-schliesstechnik/page.tsx | OK | 1318 | 1518 |
| /warenkorb | src/app/(site)/warenkorb/page.tsx | THIN_CONTENT | 178 | 950 |
