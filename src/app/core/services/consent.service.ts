import { Injectable, signal } from '@angular/core';
import { PRIVACY_POLICY_VERSION } from '../../../environments/environment';

export type ConsentCategory = 'essential' | 'analytics' | 'marketing';
export type ConsentState = {
  version: string;
  givenAt: string; // ISO timestamp
  choices: Record<ConsentCategory, boolean>;
};

const STORAGE_KEY = 'tt_consent_v1';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  openRequested = signal(false);
  private _state = signal<ConsentState | null>(null);

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ConsentState;
        // reset if version changed
        if (parsed.version === PRIVACY_POLICY_VERSION) {
          this._state.set(parsed);
        } else {
          this._state.set(null);
        }
      } catch {
        // ignore parse errors
      }
    }
  }

  get state() {
    return this._state.asReadonly();
  }

  hasConsented() {
    return !!this._state();
  }

  getChoice(cat: ConsentCategory) {
    return this._state()?.choices[cat] ?? false;
  }

  giveConsent(choices: Partial<Record<ConsentCategory, boolean>>) {
    const state: ConsentState = {
      version: PRIVACY_POLICY_VERSION,
      givenAt: new Date().toISOString(),
      choices: {
        essential: true, // always required
        analytics: !!choices.analytics,
        marketing: !!choices.marketing,
      },
    };
    this._state.set(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  revokeConsent() {
    this.openRequested.set(false);
    this._state.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  requestOpen() { this.openRequested.set(true); }
  close() { this.openRequested.set(false); }
}
