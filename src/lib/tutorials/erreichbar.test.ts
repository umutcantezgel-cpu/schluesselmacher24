import { describe, expect, it } from 'vitest';

import { tutorialsVerlinkt } from './erreichbar';

/* Die Rubrik zählt erst als erreichbar, wenn Menü „Mehr“ oder der Fuß auf /tutorials verweisen (FA-INHALT-01). */

describe('tutorialsVerlinkt', () => {
  it('erkennt den Eintrag im Menü oder im Fuß', () => {
    expect(tutorialsVerlinkt([{ href: '/ratgeber', label: 'Ratgeber' }])).toBe(false);
    expect(tutorialsVerlinkt([{ href: '/tutorials', label: 'Tutorials' }])).toBe(true);
    // Eine Einzelseite im Menü macht die Übersicht nicht erreichbar.
    expect(tutorialsVerlinkt([{ href: '/tutorials/schluessel-richtig-fotografieren', label: 'Fotografieren' }])).toBe(false);
  });

  it('liest ohne Angabe Menü „Mehr“ und Fuß aus der Navigation', () => {
// Mit der echten Navigation: Die Rubrik ist verlinkt (Fuß). Fällt der Eintrag weg, wird dieser Test rot,
    // bevor die Rubrik still aus der Sitemap verschwindet.
    expect(tutorialsVerlinkt()).toBe(true);
  });
});
