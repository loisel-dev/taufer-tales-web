import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TalesService} from '../../core/services/tales.service';
import {Tale} from '../../shared/models';
import {AuthService} from '../../core/services/auth.service';
import {BookshelfService} from '../../core/services/bookshelf.service';
import {ReadingStatus} from '../../shared/models';

@Component({
  standalone: true,
  selector: 'tt-tales',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="vstack" style="gap:14px;">
      <div class="hstack" style="justify-content:space-between; align-items:center;">
        <h2 style="margin:0;">Tales</h2>
        <input class="input" style="max-width:320px;" #q placeholder="Search" (input)="search(q.value)" />
      </div>

      <div class="grid">
        @for (t of tales(); track t.id) {
          <div class="card" style="padding:0;">
            <div class="hstack" style="gap:14px;padding:14px;">
              <a class="tale-item" [routerLink]="['/tale', t.id]" style="flex:1;">
                <div class="vstack" style="gap:6px;">
                  <div class="muted">#{{t.id}}</div>
                  <div class="title">{{t.title}}</div>
                  <div class="muted">{{t.author}}</div>
                </div>
              </a>
              <ng-container *ngIf="isLoggedIn()">
                <div class="vstack" style="gap:6px; min-width:220px;">
                  <label class="muted" for="status-{{t.id}}">My status</label>
                  <select class="input" id="status-{{t.id}}" [value]="statusOf(t.id) || ''" (change)="onStatusChange(t.id, $any($event.target).value)">
                    <option value="">— Set status —</option>
                    <option value="WANT_TO_READ">Want to read</option>
                    <option value="CURRENTLY_READING">Currently reading</option>
                    <option value="ALREADY_READ">Already read</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                  <button *ngIf="statusOf(t.id)" class="btn" (click)="clear(t.id)">Clear</button>
                </div>
              </ng-container>
            </div>
          </div>
        } @empty {
          <div class="muted">No tales found.</div>
        }
      </div>
    </div>
  `
})
export class TalesListComponent {
  private svc = inject(TalesService);
  private shelf = inject(BookshelfService);
  auth = inject(AuthService);

  tales = signal<Tale[]>([]);
  private lastQuery = '';
  // map of taleId -> status
  private myMap = new Map<number, ReadingStatus>();

  ngOnInit() {
    this.fetch();
    if (this.isLoggedIn()) {
      this.refreshMyStatuses();
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('tt_token');
  }

  statusOf(taleId: number): ReadingStatus | undefined {
    return this.myMap.get(taleId);
  }

  search(q: string) {
    this.lastQuery = q ?? '';
    this.fetch();
  }

  private fetch() {
    this.svc.list(this.lastQuery).subscribe(p => this.tales.set(p.content));
  }

  private refreshMyStatuses() {
    this.shelf.list().subscribe(items => {
      this.myMap.clear();
      for (const it of items) this.myMap.set(it.tale.id, it.status);
    });
  }

  onStatusChange(taleId: number, val: string) {
    if (!val) return;
    this.shelf.setStatus(taleId, val as ReadingStatus).subscribe(() => this.refreshMyStatuses());
  }

  clear(taleId: number) {
    this.shelf.clearStatus(taleId).subscribe(() => this.refreshMyStatuses());
  }
}
