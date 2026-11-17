/**
 * Bildfläche eines Tutorial-Schritts. Sie steht unter dem Text des Schritts und nie in einer schmalen
 * Spalte daneben: Die Zeichnungen tragen Schrift, und die muss auf dem Bildschirm bei jeder Fensterbreite
 * mindestens 14 px groß sein (Entscheidung A-068). Die Abnahme von FA-INHALT-01 hat in einer Spalte von
 * 244 px Breite 10,95 px gemessen.
 *
 * Unter 640 px füllt die Fläche die Inhaltsbreite (320 px bei 360 px Fensterbreite) und zeigt die schmale
 * Fassung der Zeichnung; ab 640 px ist sie höchstens `max-w-sm` breit und zeigt die breite Fassung.
 * `schritt-bild.test.tsx` rechnet beide Fälle für jeden Schritt des Startbestands nach.
 */
export const SCHRITT_BILD_BREITE = { telefon: 320, breit: 384 } as const;

/** Ab 640 px bündig unter dem Text des Schritts (Nummer 2rem, Abstand 1rem). */
export const SCHRITT_BILD_EINZUG = 'sm:pl-12';

/** `max-w-sm` sind 24rem, also 384 px. */
export const SCHRITT_BILD_KLASSE = 'sm:max-w-sm';

export const SCHRITT_BILD_SIZES = `(min-width: 640px) ${SCHRITT_BILD_BREITE.breit}px, 100vw`;
