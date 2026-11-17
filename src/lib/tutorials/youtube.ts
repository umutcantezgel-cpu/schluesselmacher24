/* ==========================================================================
   YouTube-Kennung aus Link oder Kennung (FA-INHALT-01, FA-21-14)

   Der Betreiber fügt im Admin einen YouTube-Link ein (oder nur die Kennung).
   Der Server zieht daraus die elfstellige Kennung und speichert nur sie. Andere
   Adressen als youtube.com, youtu.be und youtube-nocookie.com lehnt er ab, damit
   keine fremde Seite eingebettet werden kann. Reine Funktionen, ohne Netz.
   ========================================================================== */

/** Elf Zeichen aus Buchstaben, Ziffern, Bindestrich und Unterstrich. */
const KENNUNG = /^[A-Za-z0-9_-]{11}$/;

/** Erlaubte Hosts, ohne Unterseiten anderer Anbieter. */
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);
const KURZ_HOSTS = new Set(['youtu.be', 'www.youtu.be']);
const NOCOOKIE_HOSTS = new Set(['youtube-nocookie.com', 'www.youtube-nocookie.com']);

/** Pfade mit der Kennung als zweitem Abschnitt, etwa `/embed/<kennung>` oder `/shorts/<kennung>`. */
const PFAD_ARTEN = new Set(['embed', 'shorts', 'live', 'v', 'e']);

/** Ist der Text eine gültige Kennung? */
export function istYoutubeKennung(wert: unknown): wert is string {
  return typeof wert === 'string' && KENNUNG.test(wert);
}

function kennungOderNull(wert: string | null | undefined): string | null {
  return wert && KENNUNG.test(wert) ? wert : null;
}

/**
 * Zieht die YouTube-Kennung aus einem Link oder nimmt eine reine Kennung an. Gibt `null` zurück,
 * wenn die Eingabe keine YouTube-Adresse ist oder keine gültige Kennung enthält.
 *
 * Erkannt werden unter anderem `youtube.com/watch?v=…`, `m.youtube.com/watch?v=…`, `youtu.be/…`,
 * `youtube.com/embed/…`, `youtube.com/shorts/…`, `youtube.com/live/…` und `youtube-nocookie.com/embed/…`,
 * mit oder ohne `https://` und `www.`, mit Zusätzen wie `&t=30s` oder `?si=…`.
 */
export function youtubeKennung(eingabe: unknown): string | null {
  if (typeof eingabe !== 'string') return null;
  const text = eingabe.trim();
  if (!text) return null;
  if (KENNUNG.test(text)) return text;
  // Leerzeichen, Steuerzeichen und Rückstriche gehören in keinen Link.
  if (/[\s\\]/.test(text)) return null;

  const mitSchema = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text.replace(/^\/\//, '')}`;
  let url: URL;
  try {
    url = new URL(mitSchema);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password || url.port) return null;

  const host = url.hostname.toLowerCase();
  const abschnitte = url.pathname.split('/').filter(Boolean);

  if (KURZ_HOSTS.has(host)) return abschnitte.length === 1 ? kennungOderNull(abschnitte[0]) : null;

  if (NOCOOKIE_HOSTS.has(host)) {
    return abschnitte.length === 2 && abschnitte[0] === 'embed' ? kennungOderNull(abschnitte[1]) : null;
  }

  if (YOUTUBE_HOSTS.has(host)) {
    if (abschnitte.length === 1 && abschnitte[0] === 'watch') return kennungOderNull(url.searchParams.get('v'));
    if (abschnitte.length === 2 && PFAD_ARTEN.has(abschnitte[0])) return kennungOderNull(abschnitte[1]);
    return null;
  }

  return null;
}

/** Meldung im Admin, wenn sich aus der Eingabe keine Kennung ziehen lässt. */
export const YOUTUBE_MELDUNG =
  'Bitte einen Link von YouTube einfügen, etwa aus „Teilen“, oder nur die elfstellige Kennung des Videos. Andere Seiten sind nicht erlaubt.';

/* ---------- Dauer ------------------------------------------------------- */

const DAUER = /^(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)$/;

/** Dauer „m:ss“ oder „h:mm:ss“ in Sekunden; `null`, wenn die Angabe nicht passt oder 0 ist. */
export function dauerSekunden(text: unknown): number | null {
  if (typeof text !== 'string') return null;
  const treffer = DAUER.exec(text.trim());
  if (!treffer) return null;
  const [, stunden, minuten, sekunden] = treffer;
  if (stunden !== undefined && minuten.length !== 2) return null;
  const summe = Number(stunden ?? 0) * 3600 + Number(minuten) * 60 + Number(sekunden);
  return summe > 0 ? summe : null;
}

/** Dauer zum Vorlesen, etwa „4 Minuten 32 Sekunden“. */
export function dauerZumVorlesen(text: string): string | null {
  const gesamt = dauerSekunden(text);
  if (gesamt === null) return null;
  const stunden = Math.floor(gesamt / 3600);
  const minuten = Math.floor((gesamt % 3600) / 60);
  const sekunden = gesamt % 60;
  const teile = [
    stunden ? `${stunden} ${stunden === 1 ? 'Stunde' : 'Stunden'}` : '',
    minuten ? `${minuten} ${minuten === 1 ? 'Minute' : 'Minuten'}` : '',
    sekunden ? `${sekunden} ${sekunden === 1 ? 'Sekunde' : 'Sekunden'}` : '',
  ].filter(Boolean);
  return teile.join(' ');
}
