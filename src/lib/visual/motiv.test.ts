import { describe, expect, it } from 'vitest';

import { ablaufAusText, fachIconFuerMotiv, visualFuerMotiv } from './motiv';

describe('visualFuerMotiv', () => {
  it('zeigt für die Werkstatt den Profilschnitt ohne Beschriftung', () => {
    expect(visualFuerMotiv('Werkstattfoto: Schlüsselfräse mit Autoschlüssel in Bearbeitung')).toEqual({
      generator: 'profilschnitt',
      params: { beschriftung: false },
    });
  });

  it('erkennt Schließanlagen-Systeme', () => {
    expect(visualFuerMotiv('Schemazeichnung Zentralschlossanlage')?.params).toEqual({ system: 'zentral' });
    expect(visualFuerMotiv('Schemazeichnung Generalhauptschlüsselanlage')?.params).toEqual({ system: 'generalhaupt' });
    expect(visualFuerMotiv('Schließplan einer Hauptschlüsselanlage')?.params).toEqual({ system: 'haupt' });
  });

  it('erkennt Fundstellen der Schlüsselnummer', () => {
    expect(visualFuerMotiv('Beispielfoto Sicherungskarte')).toEqual({
      generator: 'code-fundstelle',
      params: { ort: 'sicherungskarte' },
    });
    expect(visualFuerMotiv('Schlüsselnummer auf der Zylinderstirn')?.params).toEqual({ ort: 'zylinderstirn' });
  });

  it('erkennt Zutritt, Zylinder, Tür und Schlüsselarten', () => {
    expect(visualFuerMotiv('Zutritt mit Smartphone am Leser')?.params).toEqual({ medium: 'smartphone' });
    expect(visualFuerMotiv('Messzeichnung Knaufzylinder')).toEqual({
      generator: 'zylinder-mass',
      params: { bauform: 'knauf' },
    });
    expect(visualFuerMotiv('Objektfoto Haustür mit Schutzbeschlag')?.generator).toBe('tuer-schutz');
    expect(visualFuerMotiv('Produktfoto Funkschlüssel')?.params).toEqual({ typ: 'funk' });
    expect(visualFuerMotiv('Smart Key in der Hand')?.params).toEqual({ typ: 'smart-key' });
    expect(visualFuerMotiv('Schlüsselkopie neben Original')?.params).toEqual({ typ: 'zylinder', anzahl: 2 });
  });

  it('liefert null, wenn nichts passt oder kein Text da ist', () => {
    expect(visualFuerMotiv('Teamfoto am Empfang')).toBeNull();
    expect(visualFuerMotiv('')).toBeNull();
    expect(visualFuerMotiv(undefined)).toBeNull();
  });
});

describe('fachIconFuerMotiv', () => {
  it('wählt ein Fach-Icon nach Stichwort und fällt auf die Werkstatt zurück', () => {
    expect(fachIconFuerMotiv('Kamera an der Fassade')).toBe('videoueberwachung');
    expect(fachIconFuerMotiv('Beispielfoto Fahrzeugschein')).toBe('foto-hochladen');
    expect(fachIconFuerMotiv('Produktfoto Zylinder')).toBe('profilzylinder');
    expect(fachIconFuerMotiv('Teamfoto')).toBe('foto-hochladen');
    expect(fachIconFuerMotiv('Empfang')).toBe('werkstatt');
    expect(fachIconFuerMotiv(null)).toBe('werkstatt');
  });

  it('entscheidet bei „Produktfoto …“ nach der Sache, erst danach nach dem Produkt', () => {
    expect(fachIconFuerMotiv('Produktfoto Schlüsselkasten, geöffnet, mit Haken')).toBe('schluessel-kopieren');
    expect(fachIconFuerMotiv('Produktfoto Schlüssel Serie MS-01')).toBe('schluessel-kopieren');
    expect(fachIconFuerMotiv('Produktfoto Funkschlüssel')).toBe('autoschluessel');
    expect(fachIconFuerMotiv('Produktfoto Möbelschloss mit zwei Schlüsseln')).toBe('tuer-und-schliesstechnik');
    expect(fachIconFuerMotiv('Produktfoto Pflegespray mit Sprühröhrchen')).toBe('versand-paket');
    expect(fachIconFuerMotiv('Werkstatt- oder Produktfoto: Montage und Anpassung')).toBe('versand-paket');
  });
});

describe('Motiv ohne Bildart', () => {
  it('entscheidet nach der Sache, nicht nach „Werkstattfoto:“ oder „Anwendungsfoto:“', () => {
    expect(visualFuerMotiv('Werkstattfoto: Schließplan auf dem Tisch neben sortierten Profilzylindern')?.generator).toBe(
      'schliessplan',
    );
    expect(
      visualFuerMotiv('Werkstattfoto: mechanischer Fahrzeugschlüssel neben aufgeklapptem Schlüsselkopf mit Transponder'),
    ).toEqual({ generator: 'schluessel', params: { typ: 'transponder' } });
    expect(visualFuerMotiv('Werkstattfoto: Regal mit Ordnern')).toEqual({
      generator: 'profilschnitt',
      params: { beschriftung: false },
    });
    expect(fachIconFuerMotiv('Anwendungsfoto: Sicherung der Außenhaut')).toBe('aussenhautsicherung');
    expect(fachIconFuerMotiv('Anwendungsfoto: Mechanischer Schutz')).toBe('mechanischer-schutz');
    expect(fachIconFuerMotiv('Anwendungsfoto: Kombinierte Sicherheitskonzepte')).toBe('kombinierte-konzepte');
    expect(fachIconFuerMotiv('Anwendungsfoto: Panik- und Alarmtaster')).toBe('panik-alarmtaster');
  });

  it('behält das Foto-Symbol für Beispielfotos und zeichnet keine Haustür für die Fahrertür', () => {
    expect(fachIconFuerMotiv('Beispielfoto: Zulassungsbescheinigung Teil I, vollständig im Bild und lesbar')).toBe(
      'foto-hochladen',
    );
    expect(visualFuerMotiv('Werkstattfoto: Öffnungswerkzeug an der Fahrertür, Lackschutz angelegt')?.generator).toBe(
      'profilschnitt',
    );
  });

  it('liest „Funktionen“ nicht als Funkschlüssel', () => {
    expect(visualFuerMotiv('Anwendungsfoto: Smarte Funktionen')).toBeNull();
    expect(fachIconFuerMotiv('Anwendungsfoto: Smarte Funktionen')).toBe('smarte-funktionen');
    expect(visualFuerMotiv('Produktfoto Funkschlüssel')?.params).toEqual({ typ: 'funk' });
  });

  it('zeigt Beispielbilder zu Prägungen als Fundstelle am Schlüsselkopf', () => {
    expect(visualFuerMotiv('Beispielfoto: Nahaufnahme der Prägung auf dem Schlüsselkopf')).toEqual({
      generator: 'code-fundstelle',
      params: { ort: 'schluesselkopf' },
    });
    expect(visualFuerMotiv('Beispielfoto: Schlüssel flach von oben, Kopf und Bart vollständig im Bild')?.generator).toBe('schluessel');
  });
});

describe('ablaufAusText', () => {
  it('liest den Dreischritt aus der Unterzeile des Ratgebers', () => {
    expect(
      ablaufAusText('Die richtige Reihenfolge spart Zeit und Geld: erst sichern, dann prüfen, dann bestellen.'),
    ).toEqual({ generator: 'ablauf', params: { schritte: 'sichern|prüfen|bestellen' } });
  });

  it('nimmt zwei Schritte und „und dann“', () => {
    expect(ablaufAusText('Erst messen und dann bestellen.')?.params).toEqual({ schritte: 'messen|bestellen' });
  });

  it('liefert null ohne Reihenfolge aus einzelnen Wörtern', () => {
    expect(ablaufAusText('Erst die erreichbaren Stellen, dann die Meldetechnik.')).toBeNull();
    expect(ablaufAusText('Beides hat seinen Platz.')).toBeNull();
    expect(ablaufAusText('')).toBeNull();
    expect(ablaufAusText(undefined)).toBeNull();
  });

  it('übernimmt höchstens vier Schritte und keine überlangen Wörter', () => {
    expect(ablaufAusText('erst a, dann b, dann c, dann d, dann e')?.params).toEqual({ schritte: 'a|b|c|d' });
    expect(ablaufAusText('erst sichern, dann Fahrzeugschlüsselnummer')).toBeNull();
  });
});
