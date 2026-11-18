import { afterEach, describe, expect, it, vi } from 'vitest';

import { zeigtGeladenenStand, zumSchrittScrollen } from './use-flow';

describe('zeigtGeladenenStand', () => {
  it('meldet einen gespeicherten Stand vor der ersten eigenen Eingabe', () => {
    expect(zeigtGeladenenStand(true, false, false)).toBe(true);
  });

  it('meldet nichts, wenn die Anzeige aus eigener Eingabe stammt', () => {
    // Nach der ersten Eingabe steht der Stand im Speicher, ist aber kein geladener.
    expect(zeigtGeladenenStand(true, true, false)).toBe(false);
  });

  it('meldet nichts ohne gespeicherten Stand oder nach dem Schließen des Hinweises', () => {
    expect(zeigtGeladenenStand(false, false, false)).toBe(false);
    expect(zeigtGeladenenStand(false, true, false)).toBe(false);
    expect(zeigtGeladenenStand(true, false, true)).toBe(false);
  });
});

/** Browser-Ersatz: Breite und Schrittüberschrift wählbar, Bildaufbau sofort. */
function browser({
  schmal,
  mitTitel = true,
  mitMatchMedia = true,
  titelOben = 300,
  scrollY = 0,
}: {
  schmal: boolean;
  mitTitel?: boolean;
  mitMatchMedia?: boolean;
  /** Lage der Überschrift im Bild vor dem Wechsel. */
  titelOben?: number;
  scrollY?: number;
}) {
  const scrollTo = vi.fn();
  const scrollIntoView = vi.fn();
  const querySelector = vi.fn(() =>
    mitTitel ? { scrollIntoView, getBoundingClientRect: () => ({ top: titelOben, bottom: titelOben + 40 }) } : null,
  );
  vi.stubGlobal('window', {
    scrollTo,
    scrollY,
    innerHeight: 800,
    requestAnimationFrame: (rueckruf: () => void) => rueckruf(),
    ...(mitMatchMedia && {
      matchMedia: (anfrage: string) => ({ matches: anfrage === '(max-width: 767px)' && schmal }),
    }),
  });
  vi.stubGlobal('document', { querySelector });
  return { scrollTo, scrollIntoView, querySelector };
}

describe('zumSchrittScrollen', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('bringt am Smartphone die Schrittüberschrift an den oberen Rand', () => {
    const b = browser({ schmal: true });
    zumSchrittScrollen();
    expect(b.querySelector).toHaveBeenCalledWith('[data-schritt-titel]');
    expect(b.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
    expect(b.scrollTo).not.toHaveBeenCalled();
  });

  it('geht ab 768 px wie bisher an den Seitenanfang, wenn die Überschrift dort im Bild steht', () => {
    // Überschrift vor dem Wechsel bei 300 px im Bild, Seite um 200 px gerollt: am Seitenanfang bei 500–540 px.
    const b = browser({ schmal: false, titelOben: 300, scrollY: 200 });
    zumSchrittScrollen();
    expect(b.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(b.scrollIntoView).not.toHaveBeenCalled();
  });

  it('geht ab 768 px zur Überschrift, wenn der Ablauf weiter unten steht (eingebettet, FA-QA-04E)', () => {
    // Am Seitenanfang stünde die Überschrift bei 1900 px, unter dem Bild (800 px).
    const b = browser({ schmal: false, titelOben: 100, scrollY: 1800 });
    zumSchrittScrollen();
    expect(b.scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
    expect(b.scrollTo).not.toHaveBeenCalled();
  });

  it('ab 768 px ohne Überschrift an den Seitenanfang', () => {
    const b = browser({ schmal: false, mitTitel: false });
    zumSchrittScrollen();
    expect(b.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('geht ohne Überschrift oder ohne matchMedia an den Seitenanfang', () => {
    const ohneTitel = browser({ schmal: true, mitTitel: false });
    zumSchrittScrollen();
    expect(ohneTitel.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });

    // Ohne matchMedia gilt zudem „Bewegung reduzieren“: Die Seite springt.
    const ohneAbfrage = browser({ schmal: true, mitMatchMedia: false });
    zumSchrittScrollen();
    expect(ohneAbfrage.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    expect(ohneAbfrage.scrollIntoView).not.toHaveBeenCalled();
  });

  it('tut ohne Browser nichts', () => {
    expect(typeof window).toBe('undefined');
    expect(() => zumSchrittScrollen()).not.toThrow();
  });
});
