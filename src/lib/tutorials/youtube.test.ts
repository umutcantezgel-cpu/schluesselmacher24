import { describe, expect, it } from 'vitest';

import { dauerSekunden, dauerZumVorlesen, istYoutubeKennung, youtubeKennung } from './youtube';

/* YouTube-Kennung aus Link oder Kennung (FA-INHALT-01, FA-21-14): alle üblichen Linkformen ergeben die
 * Kennung, fremde Adressen und kaputte Kennungen werden abgelehnt. Erfundene Kennungen, keine echten Videos. */

const ID = 'aB3_dE-5gH7';

describe('youtubeKennung', () => {
  it.each([
    [ID],
    [` ${ID} `],
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://youtube.com/watch?v=${ID}`],
    [`http://www.youtube.com/watch?v=${ID}`],
    [`https://m.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/watch?v=${ID}&t=42s`],
    [`https://www.youtube.com/watch?feature=share&v=${ID}`],
    [`www.youtube.com/watch?v=${ID}`],
    [`youtube.com/watch?v=${ID}`],
    [`https://youtu.be/${ID}`],
    [`https://youtu.be/${ID}?si=AbCdEf123&t=10`],
    [`youtu.be/${ID}`],
    [`https://www.youtube.com/embed/${ID}`],
    [`https://www.youtube.com/embed/${ID}?start=5`],
    [`https://www.youtube.com/shorts/${ID}`],
    [`https://www.youtube.com/live/${ID}?feature=share`],
    [`https://www.youtube.com/v/${ID}`],
    [`https://www.youtube-nocookie.com/embed/${ID}`],
    [`https://youtube-nocookie.com/embed/${ID}?rel=0`],
    [`https://WWW.YOUTUBE.COM/watch?v=${ID}`],
    [`https://www.youtube.com/watch?v=${ID}#kommentare`],
  ])('zieht die Kennung aus %s', (eingabe) => {
    expect(youtubeKennung(eingabe)).toBe(ID);
  });

  it.each([
    [''],
    ['   '],
    [null],
    [42],
    ['zu-kurz'],
    [`${ID}x`],
    ['aB3_dE-5gH!'],
    [`https://vimeo.com/${ID}`],
    [`https://example.org/watch?v=${ID}`],
    [`https://youtube.com.example.org/watch?v=${ID}`],
    [`https://example.org/youtube.com/watch?v=${ID}`],
    [`https://notyoutube.com/watch?v=${ID}`],
    [`https://evil.youtube.com/watch?v=${ID}`],
    [`https://youtube.com@example.org/watch?v=${ID}`],
    [`https://user:pass@www.youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com:8080/watch?v=${ID}`],
    [`javascript:alert('${ID}')`],
    [`data:text/html,${ID}`],
    [`ftp://youtube.com/watch?v=${ID}`],
    [`https://www.youtube.com/watch?v=${ID.slice(0, 10)}`],
    [`https://www.youtube.com/playlist?list=PL${ID}`],
    [`https://www.youtube.com/@kanal`],
    [`https://www.youtube.com/channel/${ID}`],
    [`https://youtu.be/${ID}/mehr`],
    [`https://www.youtube-nocookie.com/watch?v=${ID}`],
    [`https://www.youtube.com/watch?v=${ID} extra`],
    [`https://www.youtube.com\\@example.org/watch?v=${ID}`],
  ])('lehnt %s ab', (eingabe) => {
    expect(youtubeKennung(eingabe)).toBeNull();
  });

  it('erkennt nur elfstellige Kennungen als gespeicherten Wert', () => {
    expect(istYoutubeKennung(ID)).toBe(true);
    expect(istYoutubeKennung(`https://youtu.be/${ID}`)).toBe(false);
    expect(istYoutubeKennung(undefined)).toBe(false);
  });
});

describe('Dauer', () => {
  it.each([
    ['4:32', 272],
    ['0:59', 59],
    ['12:05', 725],
    ['1:02:15', 3735],
    [' 3:00 ', 180],
  ])('%s ergibt %i Sekunden', (text, sekunden) => {
    expect(dauerSekunden(text)).toBe(sekunden);
  });

  it.each([['0:00'], ['4:60'], ['432'], ['1:2:15'], ['vier Minuten'], [''], [null]])('lehnt %s ab', (text) => {
    expect(dauerSekunden(text)).toBeNull();
  });

  it('liest die Dauer in Worten vor', () => {
    expect(dauerZumVorlesen('4:32')).toBe('4 Minuten 32 Sekunden');
    expect(dauerZumVorlesen('1:01:00')).toBe('1 Stunde 1 Minute');
    expect(dauerZumVorlesen('kaputt')).toBeNull();
  });
});
