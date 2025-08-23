import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { PRIVACY_POLICY_VERSION } from '../../../environments/environment';

type Session = { username: string; token: string };
type AuthResponse = { token: string; username: string };

@Injectable({providedIn: 'root'})
export class AuthService {
  private _user = signal<Session | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('tt_token');
    const username = localStorage.getItem('tt_username');
    if (token && username) {
      this._user.set({username, token});
    }
  }

  /** Snapshot accessor for templates */
  user() {
    return this._user();
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {username, password}).pipe(
      tap(res => {
        localStorage.setItem('tt_token', res.token);
        localStorage.setItem('tt_username', res.username);
        this._user.set({username: res.username, token: res.token});
      })
    );
  }

  register(username: string, email: string, password: string, privacyAccepted: boolean) {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, {username, email, password, privacyAccepted, privacyVersion: PRIVACY_POLICY_VERSION});
  }

  logout() {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('tt_username');
    this._user.set(null);
  }
}
