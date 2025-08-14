import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TalesService } from '../../core/services/tales.service';
import { ReviewsService, Review } from '../../core/services/reviews.service';
import { AuthService } from '../../core/services/auth.service';
import { BookshelfService } from '../../core/services/bookshelf.service';
import { ReadingStatus } from '../../shared/models';

interface Tale {
  id: number;
  title: string;
  author: string;
  description?: string;
  avgRating?: number | null;
}

@Component({
  standalone: true,
  selector: 'tt-tale-detail',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="vstack" style="gap:18px;">
      <a routerLink="/" class="btn">← Back</a>
      <h2 style="margin:0;">{{ tale()?.title }}</h2>
      <div class="muted">{{ tale()?.author }}</div>

      <div *ngIf="auth.user()" class="card">
        <div class="vstack" style="gap:8px;">
          <div class="muted">My status</div>
          <div class="hstack" style="gap:8px; align-items:center;">
            <select class="input" [value]="myStatus() || ''" (change)="onStatusChange($any($event.target).value)">
              <option value="">— Set status —</option>
              <option value="WANT_TO_READ">Want to read</option>
              <option value="CURRENTLY_READING">Currently reading</option>
              <option value="ALREADY_READ">Already read</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
            <button *ngIf="myStatus()" class="btn" (click)="clear()">Clear</button>
          </div>
        </div>
      </div>

      <div class="card" *ngIf="tale()?.description">
        <div class="muted">Description</div>
        <p>{{ tale()?.description }}</p>
      </div>

      <div class="card">
        <div class="muted">Reviews ({{ reviews().length }})</div>
        <div class="vstack" style="gap:12px;">
          @for (r of reviews(); track r.id) {
            <div class="card" style="border:1px solid #eee;">
              <div class="hstack" style="justify-content:space-between;">
                <strong>{{ r.title }}</strong>
                <span class="rating">{{ r.rating }}</span>
              </div>
              <div class="muted">by {{ r.username }}</div>
              <p>{{ r.body }}</p>
            </div>
          } @empty {
            <div class="muted">No reviews yet.</div>
          }
        </div>
      </div>
    </div>
  `
})
export class TaleDetailComponent {
  private route = inject(ActivatedRoute);
  private api = inject(TalesService);
  private reviewsApi = inject(ReviewsService);
  auth = inject(AuthService);
  private shelf = inject(BookshelfService);

  tale = signal<Tale | null>(null);
  reviews = signal<Review[]>([]);
  myReview = signal<Review | null>(null);
  myStatus = signal<ReadingStatus | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.load(id);
    });
  }

  private load(id: number) {
    this.api.get(id).subscribe(t => this.tale.set(t as any));
    this.reviewsApi.forTale(id).subscribe(rs => this.reviews.set(rs));
    this.reviewsApi.myForTale(id).subscribe({
      next: r => this.myReview.set(r),
      error: () => this.myReview.set(null),
    });
    // fetch current status
    this.shelf.myForTale(id).subscribe({
      next: it => this.myStatus.set(it.status),
      error: () => this.myStatus.set(null)
    });
  }

  onStatusChange(val: string) {
    const id = this.tale()?.id;
    if (!id || !val) return;
    this.shelf.setStatus(id, val as ReadingStatus).subscribe(it => this.myStatus.set(it.status));
  }

  clear() {
    const id = this.tale()?.id;
    if (!id) return;
    this.shelf.clearStatus(id).subscribe(() => this.myStatus.set(null));
  }
}
