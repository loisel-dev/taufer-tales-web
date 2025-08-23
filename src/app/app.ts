import {Component, inject} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { CookieConsentComponent } from './core/components/cookie-consent.component';
import {RouterOutlet, RouterLink} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import { ConsentService } from './core/services/consent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgOptimizedImage, CookieConsentComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  auth = inject(AuthService);
  consent = inject(ConsentService);

  openConsent(){ this.consent.requestOpen(); }

  logout() {
    this.auth.logout();
  }
}
