import { describe, expect, it } from 'vitest';

import { fachIconFuerMotiv, visualFuerMotiv } from './motiv';

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
});

