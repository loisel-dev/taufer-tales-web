import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="vstack" style="gap:12px; max-width:520px;">
      <h2 style="margin:0;">Create account</h2>
      <form class="card vstack" style="gap:8px;" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label>Username</label>
          <input class="input" [(ngModel)]="username" name="u" required>
        </div>
        <div class="form-field">
          <label>Email</label>
          <input class="input" [(ngModel)]="email" name="e" type="email" required>
        </div>
        <div class="form-field">\n          <label>Password</label>
          <input class="input" [(ngModel)]="password" name="p" type="password" required>
        </div>
        <div class="check-box">
          <input type="checkbox" [(ngModel)]="privacyAccepted" name="d">
          <label>Ich stimme der Datenschutzerklärung zu</label>
        </div>
        <div class="hstack" style="justify-content:flex-end;">
          <button class="btn btn-primary" type="submit">Register</button>
        </div>
        <p *ngIf="msg" class="subtle">{{msg}}</p>
      </form>
    </div>
  `
})
export class RegisterComponent {
  username = '';
  privacyAccepted = false;
  email = '';
  password = '';
  msg = '';

  constructor(private auth: AuthService, private router: Router) {
  }

  onSubmit() {
    if (!this.privacyAccepted) { this.msg = 'Bitte akzeptieren Sie die Datenschutzerklärung.'; return; }
    this.auth.register(this.username, this.email, this.password, true).subscribe({
      next: () => {
        this.msg = 'Registration successful. Please log in.';
        this.router.navigateByUrl('/login');
      },
      error: () => {
        this.msg = 'Registration failed.';
      }
    });
  }
}
