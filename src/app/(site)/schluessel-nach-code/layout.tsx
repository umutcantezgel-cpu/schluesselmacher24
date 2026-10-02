import type { ReactNode } from 'react';
import { AreaScope } from '@/components/visual/area-scope';
import { TaktileKinetikLayout } from '@/components/kinetik/taktile-kinetik-layout';

interface Props {
  children: ReactNode;
  params: Promise<{ [key: string]: string | string[] | undefined }>;

}

export default async function BereichLayout({ children, params,  }: Props) {
  void (await params);


  return (
    <AreaScope area="schluessel-nach-code">
      <TaktileKinetikLayout>
        {children}
      </TaktileKinetikLayout>

      {/* Fachlicher Begleittext: Methodik & Systemarchitektur (> 800 Wörter) */}
      <section className="py-16 md:py-24 lg:py-32 bg-[oklch(0.988_0.002_260)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-[clamp(1.875rem,5vw,3rem)] font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-8">
            Hochpräzise Schlüsselfertigung nach Code: Systemarchitektur & Methodik
          </h1>

          <div className="prose prose-lg text-[oklch(0.32_0.02_260)] leading-relaxed max-w-none space-y-6">
            <p>
              In der modernen Schließtechnik stellt die Schlüsselanfertigung nach Code die fortschrittlichste und präziseste Methode zur Rekonstruktion von Schließmedien dar. Anders als bei der herkömmlichen mechanischen Kopie, bei der Toleranzen und Verschleiß des Originalschlüssels unweigerlich auf das Duplikat übertragen werden, basiert die Code-Fertigung auf der exakten algorithmischen Wiederherstellung der werksseitigen Originalparameter.
            </p>

            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              1. Institutionelle Leistungsübersicht und Systemarchitektur
            </h2>
            <p>
              Unsere Systemarchitektur für die Code-Fertigung integriert hochmoderne CNC-gesteuerte Frässysteme, die direkt mit den kryptografischen Datenbanken der führenden Hersteller kommunizieren. Dieser digitale Workflow eliminiert mechanische Übertragungsfehler vollständig. Sobald der physische oder digitale Code in unser System eingespeist wird, berechnet die Software die exakten Fräspfade unter Berücksichtigung der spezifischen Profiltoleranzen.
            </p>
            <p>
              Die Architektur ist modular aufgebaut und umfasst:
              <br/>- <strong>Datenschnittstellen:</strong> Direkte Anbindung an Hersteller-APIs für sofortige Code-Verifikation.
              <br/>- <strong>Kryptografische Absicherung:</strong> Ende-zu-Ende-Verschlüsselung sensibler Schlüsseldaten während des gesamten Prozesses.
              <br/>- <strong>Präzisions-Hardware:</strong> Mehrachsige CNC-Fräsmaschinen mit Lasermessung zur kontinuierlichen Qualitätskontrolle im laufenden Fräsprozess.
              <br/>- <strong>Materialwissenschaft:</strong> Verwendung von hochlegierten Rohlingen, die die werksseitigen Materialspezifikationen übertreffen.
            </p>

            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              2. Methodischer Transformationsprozess in vier auditierbaren Phasen
            </h2>
            <p>
              Unser Prozess ist in vier strikt auditierbare Phasen unterteilt, um maximale Sicherheit und Präzision zu gewährleisten:
            </p>
            <h3>Phase 1: Code-Verifikation und Authentifizierung</h3>
            <p>
              Zunächst wird die Berechtigung zur Schlüsselfertigung rigoros geprüft. Bei Sicherungskarten-basierten Systemen erfolgt eine kryptografische Validierung der Karte. Der Code selbst wird gegen die Herstellerdatenbank abgeglichen, um die Integrität des Schließsystems zu bestätigen.
            </p>
            <h3>Phase 2: Algorithmische Pfadberechnung</h3>
            <p>
              Der verifizierte Code wird in maschinenlesbare Fräsparameter übersetzt. Unsere proprietären Algorithmen optimieren die Anfahrtswege des Fräskopfes, um mikroskopische Grate zu vermeiden und eine Oberflächengüte zu erreichen, die dem Originalzustand entspricht.
            </p>
            <h3>Phase 3: CNC-gestützte Fertigung</h3>
            <p>
              Der eigentliche Fräsvorgang erfolgt unter strenger klimatischer Kontrolle. Eine konstante Lasermessung überwacht die Schnitttiefe und -breite in Echtzeit (Closed-Loop-System), um Abweichungen sofort zu korrigieren. Die Toleranzen liegen hierbei im Mikrometerbereich.
            </p>
            <h3>Phase 4: Digitale und physische Endkontrolle</h3>
            <p>
              Jeder gefertigte Schlüssel durchläuft eine finale optische Vermessung. Das Profil wird digital gescannt und mit der theoretischen CAD-Blaupause verglichen. Erst bei 100%iger Übereinstimmung wird der Schlüssel für den Versand freigegeben.
            </p>

            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              3. Technologischer Vergleich: Code-Fertigung vs. Mechanische Kopie
            </h2>
            <p>
              Der paradigmatische Unterschied zwischen diesen beiden Verfahren lässt sich am besten anhand der Fehlerfortpflanzung erklären. Bei der mechanischen Kopie fungiert der existierende, oft abgenutzte Schlüssel als physische Schablone. Jeglicher Verschleiß (z.B. abgerundete Zähne, reduzierte Einschnitte) wird nicht nur kopiert, sondern durch die Toleranzen der Kopiermaschine noch verstärkt. Das Ergebnis ist eine &quot;Kopie der Kopie&quot;, die im Schließzylinder zu erhöhtem Verschleiß der Stiftzuhaltungen führt.
            </p>
            <p>
              Die Code-Fertigung hingegen ist ein regenerativer Prozess. Da sie rein datenbasiert ist, entsteht bei jedem Vorgang ein vollkommen neuwertiger Schlüssel (&quot;Generation Zero&quot;). Dies ist besonders kritisch bei komplexen Wendeschlüsselsystemen oder Profilen mit aktiven Kopierschutz-Elementen (wie beweglichen Elementen in der Schlüsselreide), bei denen kleinste mechanische Abweichungen zum Blockieren des Zylinders führen.
            </p>

            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              4. Detaillierte Fach-FAQ (Häufig gestellte Fragen)
            </h2>

            <div className="space-y-8 mt-8">
              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">
                  Warum ist die Vorlage der Sicherungskarte bei bestimmten Profilen zwingend erforderlich?
                </h3>
                <p>
                  Die Sicherungskarte fungiert als physisches kryptografisches Token. Sie schützt das Schließsystem vor unautorisierter Duplizierung und stellt sicher, dass die Kontrollkette (Chain of Custody) über die Schließanlage intakt bleibt. Ohne diese Authentifizierung ist die Fertigung rechtlich und technisch bei geschützten Profilen untersagt.
                </p>
              </div>

              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">
                  Können auch beschädigte oder gebrochene Schlüssel nach Code gefertigt werden?
                </h3>
                <p>
                  Ja, das ist einer der Hauptvorteile der Code-Fertigung. Solange der Code (oft auf dem Schlüsselkopf oder in den Fahrzeugunterlagen eingraviert) lesbar ist, können wir einen perfekten Originalschlüssel rekonstruieren, völlig unabhängig vom physischen Zustand des defekten Exemplars.
                </p>
              </div>

              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">
                  Wie genau ist die Passgenauigkeit im Vergleich zum Original?
                </h3>
                <p>
                  Die Passgenauigkeit entspricht zu 100% dem Original bei Auslieferung. Da wir dieselben Datensätze und Toleranzvorgaben (oft im Bereich von ±0,02 mm) wie der Ersthersteller verwenden, ist der nach Code gefertigte Schlüssel funktionell und maßlich identisch mit dem Werksoriginal.
                </p>
              </div>

              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">
                  Gibt es Einschränkungen bei historischen oder sehr alten Schließsystemen?
                </h3>
                <p>
                  Bei sehr alten Systemen kann es vorkommen, dass die Codes nicht mehr in digitalen Datenbanken existieren. In solchen Fällen greifen wir auf historische Code-Bücher und semi-automatisierte Decodierungsverfahren zurück, um den Code auszugewerten und anschließend dennoch eine präzise CNC-Fertigung durchzuführen.
                </p>
              </div>

              <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
                <h3 className="text-lg font-semibold text-[oklch(0.16_0.02_260)] mb-3">
                  Wie sicher ist die Datenübertragung bei der Online-Bestellung nach Code?
                </h3>
                <p>
                  Die Datenübertragung erfolgt ausschließlich über modernste Transport Layer Security (TLS 1.3) Protokolle. Die Codes werden in unserer Architektur nicht im Klartext gespeichert, sondern durchgehend verschlüsselt verarbeitet. Nach erfolgreicher Fertigung und Lieferung werden die sensiblen Fräsdaten gemäß unseren strengen Datenschutzrichtlinien unwiderruflich aus dem operativen System gelöscht.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] mt-12 mb-6">
              5. Zusammenfassung der systemischen Vorteile
            </h2>
            <p>
              Die Entscheidung für die Code-Fertigung ist eine Entscheidung für kompromisslose Qualität und Langlebigkeit des gesamten Schließsystems. Durch die Vermeidung von mechanischen Toleranzadditionen schützen Sie Ihre Zylinder vor vorzeitigem Verschleiß und gewährleisten eine dauerhaft reibungslose Funktion. Unsere Infrastruktur garantiert dabei höchste Präzision, Schnelligkeit und absolute Datensicherheit in jeder Phase des Prozesses. Diese Methodik repräsentiert den State-of-the-Art der modernen Schließtechnik und bietet sowohl für private als auch für komplexe industrielle Anwendungen die einzig vertretbare Lösung zur Schlüsselreproduktion.
            </p>
          </div>
        </div>
      </section>
    </AreaScope>
  );
}
