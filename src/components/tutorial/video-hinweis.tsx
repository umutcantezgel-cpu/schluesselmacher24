import type { TutorialVideo } from '@/lib/types';

/** Satz, solange die Einbettung mit Einwilligung (Teil B) noch nicht freigeschaltet ist. */
export const VIDEO_HINWEIS_TEXT = 'Zu diesem Thema gibt es ein Video. Es erscheint hier, sobald die Einbettung freigeschaltet ist.';

/** Überschrift des aufklappbaren Transkripts unter dem Hinweis. */
export const TRANSKRIPT_TITEL = 'Was im Video gezeigt wird';

/**
 * Ruhiger Hinweis auf ein hinterlegtes Video (FA-INHALT-01, Teil A). Lädt nichts und nennt keine Adresse:
 * weder YouTube noch Google erfahren vom Besuch. Ohne Video erscheint nichts. Ist ein Transkript gepflegt,
 * steht es darunter zum Aufklappen. Die Einbettung mit
 * Einwilligung baut Teil B (FA-INHALT-01B) an dieser Stelle ein.
 */
export function VideoHinweis({ video, className }: { video?: TutorialVideo; className?: string }) {
  if (!video?.youtubeId) return null;
  const transkript = video.transcript?.trim();
  return (
    <div className={className} data-tutorial-video="">
      <p className="max-w-measure rounded-lg border border-border bg-surface-muted p-5 text-small text-foreground-muted sm:p-6">
        {VIDEO_HINWEIS_TEXT}
      </p>
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
