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

See `.jules/architecture-matrix.md` for the full routing architecture.


## Architecture Goals
- Next.js 16+ App Router, React 19.2+, TypeScript 5.5+
- strict typing, Server Actions, zero new routes invariant
- Design System: Swiss Light Mode (OKLCH, no dark mode, typography scales)
