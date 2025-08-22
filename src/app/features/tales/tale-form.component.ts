import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TalesService} from '../../core/services/tales.service';
import {TaleCreate, Tale} from '../../shared/models';

@Component({
  standalone: true,
  selector: 'app-tale-form',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="card vstack">
      <h2>{{ editId ? 'Edit Tale' : 'Add Tale' }}</h2>
      <form (ngSubmit)="save()" #f="ngForm" class="vstack">
        <div class="form-field">
          <label for="title">Title</label>
          <input class="input" id="title" name="title" [(ngModel)]="model.title" required/>
        </div>

        <div class="form-field">
          <label for="author">Author</label>
          <input class="input" id="author" name="author" [(ngModel)]="model.author" required/>
        </div>

        <div class="form-field">
          <label for="isbn">ISBN</label>
          <input class="input" id="isbn" name="isbn" [(ngModel)]="model.isbn"/>
        </div>

        <div class="form-field">
          <label for="publishedYear">Published year</label>
          <input class="input" id="publishedYear" name="publishedYear" type="number" [(ngModel)]="model.publishedYear"/>
        </div>

        <div class="form-field">
          <label for="coverUrl">Cover URL</label>
          <input class="input" id="coverUrl" name="coverUrl" [(ngModel)]="model.coverUrl"/>
        </div>

        <div class="form-field">
          <label for="tags">Tags (comma separated)</label>
          <input class="input" id="tags" name="tags" [(ngModel)]="model.tags"/>
        </div>

        <div class="form-field">
          <label for="description">Description</label>
          <textarea id="description" name="description" rows="5" [(ngModel)]="model.description"></textarea>
        </div>

        <div class="hstack" style="gap:8px;">
          <button class="btn btn-primary" type="submit" [disabled]="saving || !f.form.valid">
            {{ saving ? (editId ? 'Updating…' : 'Saving…') : (editId ? 'Update' : 'Save') }}
          </button>
          <a class="btn" href="" (click)="$event.preventDefault(); goBack()">Cancel</a>
        </div>

        <p class="error" *ngIf="error">{{ error }}</p>
      </form>
    </section>
  `,
})
export class TaleFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tales = inject(TalesService);

  editId: number | null = null;
  saving = false;
  error: string | null = null;

  model: TaleCreate = {
    title: '',
    author: '',
    isbn: '',
    description: '',
    coverUrl: '',
    publishedYear: undefined,
    tags: ''
  };

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!Number.isNaN(id)) {
        this.editId = id;
        this.tales.get(id).subscribe({
          next: (t: Tale) => {
            this.model = {
              title: t.title ?? '',
              author: t.author ?? '',
              isbn: t.isbn ?? '',
              description: t.description ?? '',
              coverUrl: t.coverUrl ?? '',
              publishedYear: t.publishedYear,
              tags: t.tags ?? ''
            };
          },
          error: () => {
            this.error = 'Failed to load tale';
          }
        });
      }
    }
  }

  save() {
    if (this.saving) return;
    this.saving = true;
    this.error = null;

    const obs = this.editId
      ? this.tales.update(this.editId, this.model)
      : this.tales.create(this.model);

    obs.subscribe({
      next: (t: Tale) => {
        this.router.navigate(['/tale', t.id]);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.detail || 'Failed to save tale';
      }
    });
  }

  goBack() {
    if (this.editId) {
      this.router.navigate(['/tale', this.editId]);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
