import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookshelfService } from '../../core/services/bookshelf.service';
import { BookshelfItem, ReadingStatus } from '../../shared/models';

@Component({
  standalone: true,
  selector: 'tt-bookshelf',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="vstack" style="gap:14px;">
      <div class="hstack" style="justify-content: space-between; align-items: center;">
        <h2 style="margin:0;">My Bookshelf</h2>
        <div class="hstack" style="gap:8px;">
          <button class="btn" [class.btn-primary]="filter()===null" (click)="applyFilter(null)">All</button>
          <button class="btn" [class.btn-primary]="filter()==='WANT_TO_READ'" (click)="applyFilter('WANT_TO_READ')">Want to read</button>
          <button class="btn" [class.btn-primary]="filter()==='CURRENTLY_READING'" (click)="applyFilter('CURRENTLY_READING')">Currently reading</button>
          <button class="btn" [class.btn-primary]="filter()==='ALREADY_READ'" (click)="applyFilter('ALREADY_READ')">Already read</button>
          <button class="btn" [class.btn-primary]="filter()==='DISCONTINUED'" (click)="applyFilter('DISCONTINUED')">Discontinued</button>
        </div>
      </div>

      <div class="grid">
        @for (it of items(); track it.tale.id) {
          <a class="card tale-item" [routerLink]="['/tale', it.tale.id]" style="padding:0;">
            <div class="hstack" style="gap:14px;padding:14px;">
              <img *ngIf="it.tale.coverUrl" [src]="it.tale.coverUrl" alt="" style="width:64px;height:96px;object-fit:cover;border-radius:var(--radius);" />
              <div class="vstack" style="gap:6px; flex:1;">
                <div class="hstack" style="justify-content:space-between;">
                  <div>
                    <div class="muted">#{{it.tale.id}}</div>
                    <div class="title">{{it.tale.title}}</div>
                    <div class="muted">{{it.tale.author}}</div>
                  </div>
                  <div class="rating" *ngIf="it.tale.avgRating as r">{{ r ? (r | number:'1.1-1') : '—' }}</div>
                </div>
                <div class="muted">Status: {{ pretty(it.status) }}</div>
              </div>
            </div>
          </a>
        } @empty {
          <div class="muted">No items found for this filter.</div>
        }
      </div>
    </div>
  `
})
export class BookshelfComponent implements OnInit {
  private api = inject(BookshelfService);

  items = signal<BookshelfItem[]>([]);
  filter = signal<ReadingStatus | null>(null);

  ngOnInit() {
    this.fetch();
  }

  applyFilter(f: ReadingStatus | null) {
    this.filter.set(f);
    this.fetch();
  }

  fetch() {
    this.api.list(this.filter() ?? undefined).subscribe(list => this.items.set(list));
  }

  pretty(s: ReadingStatus) {
    switch (s) {
      case 'WANT_TO_READ': return 'Want to read';
      case 'ALREADY_READ': return 'Already read';
      case 'CURRENTLY_READING': return 'Currently reading';
      case 'DISCONTINUED': return 'Discontinued';
    }
  }
}
