import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConsentService } from '../services/consent.service';

@Component({
  selector: 'tt-cookie-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <section *ngIf="!consent.hasConsented()" class="cookie-banner">
    <div class="cookie-banner__inner">
      <div class="cookie-banner__text">
        Wir verwenden Cookies und ähnliche Technologien, um diese Website bereitzustellen
        (essenziell) und – mit Ihrer Einwilligung – zur Reichweitenmessung und für optionale Funktionen.
        Mehr erfahren in der <a routerLink="/datenschutz">Datenschutzerklärung</a>.
      </div>
      <div class="cookie-banner__actions">
        <button class="btn btn-secondary" (click)="acceptOnlyEssential()">Nur essenzielle</button>
        <button class="btn btn-primary" (click)="openSettings()">Einstellungen</button>
        <button class="btn btn-primary" (click)="acceptAll()">Alle akzeptieren</button>
      </div>
    </div>
  </section>

  <dialog #dlg class="cookie-modal" [open]="settingsOpen() || consent.openRequested()">
    <div class="cookie-modal__inner">
      <h3>Datenschutzeinstellungen</h3>
      <p>Hier können Sie optionale Dienste ein- oder ausschalten. Essenzielle Cookies sind für den Betrieb erforderlich
      (z. B. Login, Sicherheit) und können nicht abgewählt werden. Ihre Auswahl können Sie jederzeit über den Link
      „Datenschutzeinstellungen“ im Footer ändern.</p>

      <div class="pref">
        <div class="pref__head">
          <strong>Essenzielle Cookies</strong>
          <span class="badge">immer aktiv</span>
        </div>
        <p>Speicherung Ihrer Session (JWT), CSRF-Schutz, Spracheinstellungen.</p>
      </div>

      <div class="pref">
        <div class="pref__head">
          <strong>Analyse (optional)</strong>
          <label class="switch">
            <input type="checkbox" [(ngModel)]="analytics">
            <span></span>
          </label>
        </div>
        <p>Anonyme Reichweitenmessung. Wird nur geladen, wenn Sie zustimmen.</p>
      </div>

      <div class="pref">
        <div class="pref__head">
          <strong>Marketing (optional)</strong>
          <label class="switch">
            <input type="checkbox" [(ngModel)]="marketing">
            <span></span>
          </label>
        </div>
        <p>Einbindung von externen Inhalten oder Werbenetzwerken. Wird nur geladen, wenn Sie zustimmen.</p>
      </div>

      <div class="cookie-modal__actions">
        <button class="btn btn-secondary" (click)="acceptOnlyEssential()">Nur essenzielle</button>
        <button class="btn btn-primary" (click)="save()">Speichern</button>
        <button class="btn" (click)="closeSettings()">Abbrechen</button>
      </div>
    </div>
  </dialog>
  `,
  styles: [`
    .cookie-banner{position:fixed;left:0;right:0;bottom:0;background:#111;color:#fff;padding:12px;z-index:9999}
    .cookie-banner__inner{width:min(1000px,94%);margin:0 auto;display:flex;gap:12px;align-items:center;justify-content:space-between}
    .cookie-banner a{color:#9fd0ff;text-decoration:underline}
    .cookie-banner__actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .cookie-modal{border:none;border-radius:12px;max-width:720px;width:min(92vw,720px);padding:0}
    .cookie-modal__inner{padding:16px 18px}
    .pref{border:1px solid #e5e5e5;border-radius:12px;padding:10px 12px;margin:12px 0}
    .pref__head{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
    .badge{background:#eee;border-radius:999px;padding:2px 8px;font-size:12px}
    .cookie-modal__actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
    .switch{position:relative;display:inline-block;width:46px;height:24px}
    .switch input{display:none}
    .switch span{position:absolute;cursor:pointer;background:#ccc;left:0;top:0;right:0;bottom:0;border-radius:999px;transition:all .2s}
    .switch span:before{content:'';position:absolute;background:#fff;width:20px;height:20px;border-radius:50%;left:2px;top:2px;transition:all .2s}
    .switch input:checked + span{background:#6aa9ff}
    .switch input:checked + span:before{transform:translateX(22px)}
  `]
})
export class CookieConsentComponent {
  consent = inject(ConsentService);
  settingsOpen = signal(false);
  analytics = false;
  marketing = false;

  openSettings(){ this.settingsOpen.set(true); }
  closeSettings(){ this.settingsOpen.set(false); this.consent.close(); }

  acceptAll(){
    this.consent.giveConsent({ analytics: true, marketing: true });
    this.closeSettings();
  }
  acceptOnlyEssential(){
    this.consent.giveConsent({ analytics: false, marketing: false });
    this.closeSettings();
  }
  save(){
    this.consent.giveConsent({ analytics: this.analytics, marketing: this.marketing });
    this.closeSettings();
  }
}
