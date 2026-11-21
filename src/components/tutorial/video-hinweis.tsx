import Image from 'next/image';

// Absoluter Pfad, damit ein Alias in next.config.ts ihn ohne Schalter durch `video-rahmen-aus.tsx` ersetzen kann (A-076).
import { VideoRahmen } from '@/components/tutorial/video-rahmen';
import { istYoutubeKennung, dauerZumVorlesen } from '@/lib/tutorials/youtube';
import type { TutorialVideo } from '@/lib/types';

/** Satz, solange die Einbettung nicht freigeschaltet ist (Teil A, ohne Schalter unverändert). */
export const VIDEO_HINWEIS_TEXT = 'Zu diesem Thema gibt es ein Video. Es erscheint hier, sobald die Einbettung freigeschaltet ist.';

/** Überschrift des aufklappbaren Transkripts unter dem Hinweis. */
export const TRANSKRIPT_TITEL = 'Was im Video gezeigt wird';

/** Satz unter der Fassade (FA-INHALT-01B): was der Klick auslöst. */
export const VIDEO_DATEN_SATZ = 'Mit dem Klick auf „Video laden“ wird das Video von YouTube geladen. Dabei gehen Daten an YouTube.';

/** Ziel des Verweises auf die Datenschutzerklärung (Abschnitt der Verarbeitung). */
export const VIDEO_DATENSCHUTZ_HREF = '/rechtliches/datenschutz#verarbeitung-videos';

/** Was die Fassade von einem Video braucht. */
type FassadenVideo = Pick<TutorialVideo, 'youtubeId' | 'duration' | 'thumbnail'>;

/** Das gepflegte eigene Vorschaubild (Pfad ab Wurzel), sonst `undefined`. Nie ein Bild von YouTube. */
export function eigenesVorschaubild(video: Pick<TutorialVideo, 'thumbnail'>) {
  return video.thumbnail?.url?.startsWith('/') ? video.thumbnail : undefined;
}

/** Fassade aus eigenen Mitteln: das gepflegte Vorschaubild, sonst eine helle Fläche mit Titel und Dauer. */
function Fassade({ video, titel, sizes }: { video: FassadenVideo; titel: string; sizes: string }) {
  const dauer = video.duration?.trim();
  const vorlesen = dauer ? dauerZumVorlesen(dauer) : null;
  const bild = eigenesVorschaubild(video);
  if (bild) {
    return <Image src={bild.url} alt={bild.alt || titel} fill sizes={sizes} className="object-cover" />;
  }
  return (
    <div className="absolute inset-0 flex flex-col items-start gap-1 p-4 pb-20 sm:p-6 sm:pb-24">
      <p className="font-mono text-caption uppercase tracking-label text-foreground-muted">Video</p>
      <p className="max-w-measure text-title-sm font-semibold text-foreground [overflow-wrap:anywhere]">{titel}</p>
      {dauer && (
        <p className="text-small text-foreground-muted">
          <span aria-hidden="true" className="font-mono tabular-nums">
            {dauer}
          </span>
          <span className="sr-only">Dauer: {vorlesen ?? dauer}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Die Einbettung selbst (FA-INHALT-01B, FA-INHALT-01C): Fassade im festen Rahmen 16 zu 9 mit dem Knopf
 * „Video laden“, darunter der Satz zur Datenübertragung mit Verweis auf die Datenschutzerklärung. Nur mit
 * Freigabe und geprüfter Kennung aufrufen. Dieselbe Einbettung steht auf der Tutorial-Seite und im Hinweis der
 * Leistungsseiten (`tutorial-hinweis-seite.tsx`).
 */
export function VideoEinbettung({
  video,
  titel,
  sizes = '(min-width: 1024px) 760px, 100vw',
}: {
  video: FassadenVideo;
  /** Titel des Players und der gezeichneten Fassade. */
  titel: string;
  /** `sizes` des eigenen Vorschaubilds, passend zur Breite der Stelle. */
  sizes?: string;
}) {
  return (
    <>
      <VideoRahmen kennung={video.youtubeId} titel={titel}>
        <Fassade video={video} titel={titel} sizes={sizes} />
      </VideoRahmen>
      <p className="mt-3 max-w-measure text-small text-foreground-muted">
        {VIDEO_DATEN_SATZ}{' '}
        <a href={VIDEO_DATENSCHUTZ_HREF} className="font-semibold text-primary underline">
          Mehr in der Datenschutzerklärung
        </a>
        .
      </p>
    </>
  );
}

/**
 * Video eines Tutorials (FA-INHALT-01, Teil A und B). Ohne Video erscheint nichts.
 *
 * - Ohne Freigabe (Teil A, Schalter `SM24_VIDEOS` nicht gesetzt): nur ein ruhiger Satz; nichts lädt, keine
 *   Adresse von YouTube oder Google.
 * - Mit Freigabe: die Fassade im festen Rahmen 16 zu 9 mit dem Knopf „Video laden“, darunter der Satz zur
 *   Datenübertragung mit Verweis auf die Datenschutzerklärung. Erst der Klick lädt den Player.
 *
 * - Mit Freigabe, aber ungültiger Kennung: nichts (wie ohne Video).
 *
 * Ein gepflegtes Transkript steht in beiden ersten Fällen darunter zum Aufklappen.
 */
export function VideoHinweis({
  video,
  className,
  freigegeben = false,
  titel,
}: {
  video?: TutorialVideo;
  className?: string;
  /** Einbettung freigeschaltet (Schalter auf dem Server gelesen, von der Seite übergeben). */
  freigegeben?: boolean;
  /** Ersatztitel des Videos (Titel des Tutorials), wenn das Video keinen eigenen hat. */
  titel?: string;
}) {
  if (!video?.youtubeId) return null;
  const einbetten = freigegeben && istYoutubeKennung(video.youtubeId);
  // Mit Freigabe, aber ungültiger Kennung (etwa ein ungeprüfter Eintrag im JSON-Fallback): nichts zeigen wie ohne
  // Video. Der Satz aus Teil A („sobald die Einbettung freigeschaltet ist“) wäre dann falsch.
  if (freigegeben && !einbetten) return null;
  const transkript = video.transcript?.trim();
  const videoTitel = video.title?.trim() || titel?.trim() || 'Video zum Tutorial';

  return (
    <div className={className} data-tutorial-video="">
      {einbetten ? (
        <VideoEinbettung video={video} titel={videoTitel} />
      ) : (
        <p className="max-w-measure rounded-lg border border-border bg-surface-muted p-5 text-small text-foreground-muted sm:p-6">
          {VIDEO_HINWEIS_TEXT}
        </p>
      )}
      {transkript && (
        <details className="mt-4 max-w-measure rounded-lg border border-border">
          <summary className="flex min-h-touch cursor-pointer items-center px-5 text-small font-semibold text-foreground">
            {TRANSKRIPT_TITEL}
          </summary>
          <p className="whitespace-pre-line px-5 pb-5 text-small text-foreground-muted [overflow-wrap:anywhere]">{transkript}</p>
        </details>
      )}
    </div>
  );
}
