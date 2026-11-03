import localFont from 'next/font/local';

/*
 * Schriften der Seite (A-003, KERN 2.0): IBM Plex Sans für Text und Überschriften (variabel,
 * Stärken 100 bis 700) und IBM Plex Mono für Zahlen, Maße und Kennungen, beide unter der
 * SIL Open Font License 1.1 (OFL-IBM-Plex-*.txt), als Dateien im Projekt, ohne Abruf von außen.
 *
 * Teilmengen: `latin` (Deutsch, Anführungszeichen, €) wird vorgeladen; `latin-ext` (etwa das Š in
 * Škoda) lädt der Browser über `unicode-range` nur, wenn eine Seite solche Zeichen zeigt. Beide
 * Teile tragen denselben Familiennamen, so dass der Browser sie zu einer Schrift zusammensetzt.
 * Der Familienname ist der Name der Konstante (`plexSans`, `plexMono`): Turbopack setzt ihn in die
 * CSS-Variable ein (Next-Dokumentation zu `declarations`); ein anderer Name ginge ins Leere.
 *
 * Ersatz während des Ladens: kein automatischer Ersatz von next/font (`adjustFontFallback: false`),
 * sondern der maßgleiche eigene Ersatz `SM24 Ersatz Plex Sans` und `SM24 Ersatz Plex Mono` aus
 * globals.css (mit fettem Schnitt und Schriften für Systeme ohne Arial, E7-L-43); Tailwind setzt
 * ihn in `font-sans`, `font-display` und `font-mono` hinter die Webschrift.
 */

/* Die Werte stehen ausgeschrieben in jedem Aufruf: next/font verlangt Literale. Bereiche wie bei
   Google Fonts: latin und latin-ext. */

export const plexSans = localFont({
  src: './ibm-plex-sans-latin-wght.woff2',
  weight: '100 700',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-sans',
  declarations: [
    { prop: 'font-family', value: 'plexSans' },
    { prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
  ],
});

export const plexSansErweitert = localFont({
  src: './ibm-plex-sans-latin-ext-wght.woff2',
  weight: '100 700',
  style: 'normal',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  variable: '--font-sans-erweitert',
  declarations: [
    { prop: 'font-family', value: 'plexSans' },
    { prop: 'unicode-range', value: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  ],
});

export const plexMono = localFont({
  src: [
    { path: './ibm-plex-mono-latin-400.woff2', weight: '400', style: 'normal' },
    { path: './ibm-plex-mono-latin-500.woff2', weight: '500', style: 'normal' },
    { path: './ibm-plex-mono-latin-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  /* Mono steht nie im größten Element des ersten Bildschirms; vorgeladen wird nur Plex Sans. */
  preload: false,
  adjustFontFallback: false,
  variable: '--font-mono',
  declarations: [
    { prop: 'font-family', value: 'plexMono' },
    { prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
  ],
});

export const plexMonoErweitert = localFont({
  src: [
    { path: './ibm-plex-mono-latin-ext-400.woff2', weight: '400', style: 'normal' },
    { path: './ibm-plex-mono-latin-ext-500.woff2', weight: '500', style: 'normal' },
    { path: './ibm-plex-mono-latin-ext-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  variable: '--font-mono-erweitert',
  declarations: [
    { prop: 'font-family', value: 'plexMono' },
    { prop: 'unicode-range', value: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  ],
});

/** Klassen für `<html>`: setzen die Variablen und binden alle vier Teile ein. */
export const schriftKlassen = [plexSans, plexSansErweitert, plexMono, plexMonoErweitert]
  .map((schrift) => schrift.variable)
  .join(' ');
