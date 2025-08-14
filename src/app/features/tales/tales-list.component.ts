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
          <div class="card tale-card">
            <a class="tale-link" [routerLink]="['/tale', t.id]">
              <div class="vstack" style="gap:4px;">
                <div class="muted" style="font-size:12px;">#{{t.id}}</div>
                <div class="tale-title">{{t.title}}</div>
                <div class="muted" style="font-size:13px;">{{t.author}}</div>
              </div>
            </a>
            <ng-container *ngIf="isLoggedIn()">
              <div class="status-section">
                <label class="status-label" for="status-{{t.id}}">My status</label>
                <select class="status-select" id="status-{{t.id}}"
                        [value]="statusOf(t.id) || ''"
                        (change)="onStatusChange(t.id, $any($event.target).value)">
                  <option value="">— Select —</option>
                  <option value="WANT_TO_READ">Want to read</option>
                  <option value="CURRENTLY_READING">Currently reading</option>
                  <option value="ALREADY_READ">Already read</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
                <button *ngIf="statusOf(t.id)" class="btn-clear" (click)="clear(t.id)">Clear</button>
              </div>
            </ng-container>
          </div>
        } @empty {
          <div class="muted">No tales found.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .tale-card {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }

    .tale-link {
      display: block;
      color: inherit;
      text-decoration: none;
      padding: 8px;
      margin: -8px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .tale-link:hover {
      background-color: rgba(85, 102, 27, 0.05);
    }

    .tale-title {
      font-weight: 600;
      font-size: 15px;
      line-height: 1.3;
      color: var(--ink-900);
    }

    .status-section {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;
      margin-top: auto;
    }

    .status-label {
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-select {
      width: 100%;
      padding: 8px 10px;
      font-size: 13px;
      border: 1px solid #e5e2da;
      background: #fff;
      border-radius: 8px;
      cursor: pointer;
      box-sizing: border-box;
    }

    .status-select:focus {
      outline: none;
      border-color: var(--brand-600);
      box-shadow: 0 0 0 2px rgba(85, 102, 27, 0.15);
    }

    .btn-clear {
      align-self: flex-start;
      padding: 5px 10px;
      font-size: 12px;
      background: transparent;
      border: 1px solid #e5e2da;
      border-radius: 6px;
      cursor: pointer;
      color: var(--muted);
      transition: all 0.2s;
    }

    .btn-clear:hover {
      border-color: var(--brand-600);
      color: var(--brand-600);
    }

    /* Ensure grid columns have minimum reasonable width */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }

    /* Make cards more compact on smaller screens */
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .tale-card {
        padding: 12px;
      }
    }
  `]
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
