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
}: {
  schmal: boolean;
  mitTitel?: boolean;
  mitMatchMedia?: boolean;
}) {
  const scrollTo = vi.fn();
  const scrollIntoView = vi.fn();
  const querySelector = vi.fn(() => (mitTitel ? { scrollIntoView } : null));
  vi.stubGlobal('window', {
    scrollTo,
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

  it('geht ab 768 px wie bisher an den Seitenanfang', () => {
    const b = browser({ schmal: false });
    zumSchrittScrollen();
    expect(b.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(b.querySelector).not.toHaveBeenCalled();
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
