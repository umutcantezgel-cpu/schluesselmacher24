import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { tutorials } from '@/lib/data/defaults/tutorials';
import type { Tutorial } from '@/lib/types';

import { TutorialInhalt } from './tutorial-inhalt';
import { TRANSKRIPT_TITEL, VIDEO_HINWEIS_TEXT, VideoHinweis } from './video-hinweis';

/* Tutorial-Seite, Teil A (FA-INHALT-01): vollständig ohne Video; mit Video nur ein ruhiger Hinweis, der nichts
 * lädt und keine Adresse von YouTube oder Google enthält. Die Einbettung mit Einwilligung folgt in Teil B. */

const FREMDE_ADRESSEN = /youtube|youtu\.be|ytimg|googlevideo|google|gstatic|doubleclick/i;

const start = tutorials();
const fotografieren = start.find((t) => t.id === 'schluessel-richtig-fotografieren')!;
const mitVideo: Tutorial = {
  ...fotografieren,
  video: { youtubeId: 'aB3_dE-5gH7', title: 'Schlüssel fotografieren', duration: '3:05', transcript: 'Erst die Vorderseite.' },
};

describe('TutorialInhalt', () => {
  it('ist ohne Video vollständig: alle Schritte nummeriert, ohne Hinweis auf ein Video', () => {
    const html = renderToStaticMarkup(<TutorialInhalt tutorial={fotografieren} />);
    for (const schritt of fotografieren.steps) {
      expect(html).toContain(schritt.heading);
      expect(html).toContain(schritt.text);
    }
    expect(html).toContain('<ol');
    expect(html).toContain(`Schritt ${fotografieren.steps.length}: `);
    expect(html).not.toContain(VIDEO_HINWEIS_TEXT);
    expect(html).not.toContain('data-tutorial-video');
  });

  it('mit Video: oben der ruhige Hinweis, ohne jede Adresse von YouTube oder Google, ohne Rahmen und Skript', () => {
    const html = renderToStaticMarkup(<TutorialInhalt tutorial={mitVideo} />);
    expect(html).toContain(VIDEO_HINWEIS_TEXT);
    expect(html.indexOf(VIDEO_HINWEIS_TEXT)).toBeLessThan(html.indexOf(fotografieren.steps[0].text));
    expect(html).not.toMatch(FREMDE_ADRESSEN);
    expect(html).not.toContain('aB3_dE-5gH7');
    expect(html).not.toMatch(/<iframe|<script|<img[^>]+src="https?:/i);
  });

  it('jeder Eintrag des Startbestands, auch mit Video, kommt ohne fremde Adresse aus', () => {
    for (const t of start) {
      const html = renderToStaticMarkup(<TutorialInhalt tutorial={{ ...t, video: { youtubeId: 'aB3_dE-5gH7' } }} />);
      expect(html, t.id).not.toMatch(FREMDE_ADRESSEN);
    }
  });

  it('zeigt den Ratgeber, wenn er das Thema ausführlich trägt, und die gepflegten Links ohne Doppel', () => {
    const messen = start.find((t) => t.id === 'profilzylinder-messen')!;
    const html = renderToStaticMarkup(
      <TutorialInhalt tutorial={messen} ratgeber={{ href: '/ratgeber/zylinder-richtig-ausmessen', label: 'Zylinder richtig ausmessen' }} />,
    );
    expect(html).toContain('Ausführlich im Ratgeber');
    expect(html).toContain('href="/ratgeber/zylinder-richtig-ausmessen"');
    expect(html).toContain('href="/gleichschliessende-zylinder/konfigurator"');
    expect(html.split('href="/ratgeber/zylinder-richtig-ausmessen"')).toHaveLength(2);
  });
});

describe('VideoHinweis', () => {
  it('erscheint nur mit hinterlegtem Video', () => {
    expect(renderToStaticMarkup(<VideoHinweis />)).toBe('');
    expect(renderToStaticMarkup(<VideoHinweis video={{ youtubeId: '' }} />)).toBe('');
    expect(renderToStaticMarkup(<VideoHinweis video={{ youtubeId: 'aB3_dE-5gH7' }} />)).toContain(VIDEO_HINWEIS_TEXT);
  });

  it('zeigt ein gepflegtes Transkript zum Aufklappen, ohne Transkript nichts davon', () => {
    const mit = renderToStaticMarkup(<VideoHinweis video={{ youtubeId: 'aB3_dE-5gH7', transcript: 'Erst die Vorderseite.' }} />);
    expect(mit).toContain('<details');
    expect(mit).toContain(TRANSKRIPT_TITEL);
    expect(mit).toContain('Erst die Vorderseite.');
    expect(mit).not.toMatch(FREMDE_ADRESSEN);
    for (const transcript of [undefined, '  ']) {
      const ohne = renderToStaticMarkup(<VideoHinweis video={{ youtubeId: 'aB3_dE-5gH7', transcript }} />);
      expect(ohne).not.toContain('<details');
      expect(ohne).not.toContain(TRANSKRIPT_TITEL);
    }
  });
});
