import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIVACY_CONTROLLER, PRIVACY_POLICY_VERSION } from '../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <article class="prose">
    <h1>Datenschutzerklärung</h1>
    <p><em>Stand: {{ version }}</em></p>

    <h2>1. Verantwortlicher</h2>
    <p>
      {{ controller.name }}<br/>
      {{ controller.address }}<br/>
      E-Mail: {{ controller.email }}
    </p>

    <h2>2. Zweck und Rechtsgrundlagen der Verarbeitung</h2>
    <p>Wir verarbeiten personenbezogene Daten, um die Plattform „Taufer Tales“ bereitzustellen,
    auf der Sie Bücher („Tales“) verwalten, bewerten und kommentieren können.</p>
    <ul>
      <li>Registrierung und Nutzung eines Benutzerkontos (Art. 6 Abs. 1 lit. b DSGVO)</li>
      <li>Technisch notwendige Cookies / Speicherung (Art. 6 Abs. 1 lit. f DSGVO i. V. m. § 25 Abs. 2 TTDSG)</li>
      <li>Optionale Analyse / Marketing nur mit Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TTDSG)</li>
      <li>Kommunikation bei Support-Anfragen (Art. 6 Abs. 1 lit. b/f DSGVO)</li>
    </ul>

    <h2>3. Kategorien verarbeiteter Daten</h2>
    <ul>
      <li>Stammdaten: Benutzername, E-Mail (bei Registrierung)</li>
      <li>Nutzungsdaten: Logins, Bewertungen, Kommentare, Bücherlisten</li>
      <li>Technische Daten: IP-Adresse, Browserinformationen, Zeitstempel</li>
      <li>Cookie-/Speicher-Informationen: Session-Token (JWT), Einwilligungsstatus</li>
    </ul>

    <h2>4. Cookies und lokale Speicherung</h2>
    <p>Wir setzen essenzielle Cookies/Speichertechnologien ein, um Logins zu ermöglichen und die Website zu sichern.
    Optionale Dienste (Analyse/Marketing) werden nur nach Ihrer ausdrücklichen Einwilligung geladen.
    Sie können Ihre Auswahl jederzeit über „Datenschutzeinstellungen“ ändern.</p>

    <h2>5. Empfänger</h2>
    <p>Eine Weitergabe an Dritte erfolgt nur, soweit dies für den Betrieb erforderlich ist (z.&nbsp;B. Hosting) oder
    wenn Sie eingewilligt haben. Sofern Dienstleister eingesetzt werden, erfolgt dies auf Grundlage von
    Auftragsverarbeitungsverträgen gemäß Art. 28 DSGVO.</p>

    <h2>6. Drittlandtransfer</h2>
    <p>Ein Transfer in Drittländer findet nur statt, wenn die Vorgaben der Art. 44 ff. DSGVO erfüllt sind
    (z.&nbsp;B. Angemessenheitsbeschluss, Standardvertragsklauseln).</p>

    <h2>7. Speicherdauer</h2>
    <p>Wir speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist.
    Kontodaten werden bis zur Löschung des Kontos gespeichert, gesetzliche Aufbewahrungsfristen bleiben unberührt.</p>

    <h2>8. Pflicht zur Bereitstellung</h2>
    <p>Die Bereitstellung Ihrer Stammdaten ist für die Registrierung erforderlich. Ohne diese Angaben kann
    kein Konto angelegt werden.</p>

    <h2>9. Ihre Rechte</h2>
    <ul>
      <li>Auskunft (Art. 15 DSGVO)</li>
      <li>Berichtigung (Art. 16 DSGVO)</li>
      <li>Löschung (Art. 17 DSGVO)</li>
      <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
      <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
      <li>Widerspruch (Art. 21 DSGVO)</li>
      <li>Widerruf von Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
    </ul>
    <p>Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter der oben genannten E‑Mail-Adresse.</p>

    <h2>10. Beschwerderecht</h2>
    <p>Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat
    Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.</p>

    <h2>11. Sicherheit</h2>
    <p>Wir treffen angemessene technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes
    Schutzniveau zu gewährleisten (Art. 32 DSGVO).</p>

    <h2>12. Kontakt</h2>
    <p>Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich an den Verantwortlichen.</p>

    <hr/>
    <p style="font-size:12px;color:#666">Hinweis: Dieser Text ist ein sorgfältig erstelltes Muster nach DSGVO/TTDSG.
    Prüfen Sie die Angaben und passen Sie sie an Ihre tatsächlichen Prozesse an. Eine Rechtsberatung findet nicht statt.</p>
  </article>
  `,
  styles: [`
    .prose { max-width: 900px; }
  `]
})
export class DatenschutzComponent {
  controller = PRIVACY_CONTROLLER;
  version = PRIVACY_POLICY_VERSION;
}    
