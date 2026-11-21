import { istYoutubeKennung } from '@/lib/tutorials/youtube';
import type { TutorialVerweis } from '@/lib/tutorials/tutorials';

import { TutorialHinweis, type TutorialHinweisProps } from './tutorial-hinweis';
import { eigenesVorschaubild, VideoEinbettung } from './video-hinweis';

/* ==========================================================================
   Tutorial-Hinweis auf Leistungsseiten (FA-INHALT-01C, FA-21-02)

   Wie `TutorialHinweis`, dazu mit Schalter für jedes Tutorial mit sichtbarem
   Video die Fassade mit „Video laden“ direkt im Hinweis: derselbe Baustein und
   dieselben Regeln wie auf der Tutorial-Seite (nichts lädt vor dem Klick, keine
   Adresse von YouTube im HTML, Rahmen 16 zu 9, Fokus auf dem Player, nichts
   gespeichert, Satz zur Datenübertragung). Darunter bleibt der Verweis auf die
   Schrittfolge. Kein `VideoObject` hier, der Eintrag gehört zur Tutorial-Seite.

   Ohne Schalter oder ohne Video trägt kein Verweis ein `video`, und das HTML
   ist Zeichen für Zeichen das von `TutorialHinweis`. Ohne Schalter ersetzt der
   Alias in next.config.ts den Client-Baustein, so lädt die Seite kein Skript
   der Einbettung. Nur für Leistungsseiten; Formulare nehmen `TutorialHinweis`.
   ========================================================================== */

/** Kennung des Videos im Hinweis, für Tests und Browserproben. */
export const HINWEIS_VIDEO = 'data-hinweis-video';

/** Breite des eigenen Vorschaubilds: höchstens die Lesespalte (40rem), am Telefon volle Breite. */
const VORSCHAU_SIZES = '(min-width: 640px) 640px, 100vw';

function HinweisVideo({ verweis }: { verweis: TutorialVerweis }) {
  const video = verweis.video;
  if (!video || !istYoutubeKennung(video.youtubeId)) return null;
  const titel = video.title?.trim() || verweis.titel;
  return (
    <div {...{ [HINWEIS_VIDEO]: '' }} className="mb-3 mt-1 w-full max-w-[40rem]">
      {/* Mit eigenem Vorschaubild steht der Titel darüber; die gezeichnete Fläche trägt ihn selbst. */}
      {eigenesVorschaubild(video) && (
        <p className="mb-2 text-small font-semibold text-foreground [overflow-wrap:anywhere]">{titel}</p>
      )}
      <VideoEinbettung video={video} titel={titel} sizes={VORSCHAU_SIZES} />
    </div>
  );
}

/** Hinweis für Leistungsseiten: mit Schalter und sichtbarem Video die Einbettung über dem Verweis. */
export function TutorialHinweisSeite(props: Omit<TutorialHinweisProps, 'videoBlock' | 'neuesFenster'>) {
  return <TutorialHinweis {...props} videoBlock={(verweis) => <HinweisVideo verweis={verweis} />} />;
}
