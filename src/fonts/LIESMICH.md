# Schriften (A-003, KERN 2.0)

| Datei | Schrift | Teilmenge | Stärken | Größe |
|---|---|---|---|---|
| `ibm-plex-sans-latin-wght.woff2` | IBM Plex Sans (variabel) | latin, vorgeladen | 100 bis 700 | 45,7 KB |
| `ibm-plex-sans-latin-ext-wght.woff2` | IBM Plex Sans (variabel) | latin-ext, nur bei Bedarf | 100 bis 700 | 31,0 KB |
| `ibm-plex-mono-latin-400/500/600.woff2` | IBM Plex Mono | latin | 400, 500, 600 | 14,7 / 14,9 / 15,6 KB |
| `ibm-plex-mono-latin-ext-400/500/600.woff2` | IBM Plex Mono | latin-ext, nur bei Bedarf | 400, 500, 600 | 13,3 / 13,4 / 14,3 KB |

- Herkunft: npm-Pakete `@fontsource-variable/ibm-plex-sans@5.3.0` und `@fontsource/ibm-plex-mono@5.3.0` (Teilmengen wie bei Google Fonts), Dateien unverändert übernommen; die Pakete sind keine Abhängigkeit des Projekts.
- Lizenz: SIL Open Font License 1.1, Copyright IBM Corp. (`OFL-IBM-Plex-Sans.txt`, `OFL-IBM-Plex-Mono.txt`), ohne reservierten Schriftnamen.
- Maße (fontkit): Einheiten 1000, Oberlänge 1025, Unterlänge 275, mittlere Breite 533 (Sans) und 600 (Mono); gleich wie die statischen Schnitte, auf die der Ersatz in `globals.css` abgestimmt ist.
- Eingebunden in `schriften.ts` über `next/font/local`; das Vorschaubild (`src/lib/og/bereichsbild.tsx`) liest weiter die WOFF-Dateien aus `@fontsource/ibm-plex-sans`, weil Satori kein WOFF2 liest.
- Typische Seite: 45,7 KB Plex Sans plus bis 45,2 KB Mono, also unter dem Budget von 250 KB.
