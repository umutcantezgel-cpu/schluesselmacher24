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

## Architektur Blueprint (JC-AUDITOR-ARCHITECT-v1)

Die Architektur wurde systematisch geprüft und ein deterministischer 5-Phasen Blueprint erstellt:
- **Zero-New-Routes Invariante**: Keine neuen Routen wurden erstellt.
- **Erhalt der Marken-DNA**: Farbsystem und Design-Metriken wurden als OKLCH dokumentiert.
- **Direct-to-Main Pipeline**: Blueprint-Status ist aktiv in `.jules/`.
Siehe `.jules/revolution-plan.json` und `.jules/architecture-matrix.md` für vollständige Pläne.
