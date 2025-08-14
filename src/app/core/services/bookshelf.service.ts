import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BookshelfItem, ReadingStatus } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class BookshelfService {
  private base = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  list(status?: ReadingStatus) {
    const params: any = {};
    if (status) params.status = status;
    return this.http.get<BookshelfItem[]>(`${this.base}/bookshelf`, { params });
  }

  myForTale(taleId: number) {
    return this.http.get<BookshelfItem>(`${this.base}/bookshelf/my`, { params: { taleId } });
  }

  setStatus(taleId: number, status: ReadingStatus) {
    return this.http.put<BookshelfItem>(`${this.base}/tales/${taleId}/status`, { status });
  }

  clearStatus(taleId: number) {
    return this.http.delete<void>(`${this.base}/tales/${taleId}/status`);
  }
}
