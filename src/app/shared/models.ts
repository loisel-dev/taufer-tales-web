export interface AuthResponse {
  token: string;
  username: string
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface Tale {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  publishedYear?: number;
  tags?: string;
  avgRating?: number | null;
}

export interface Review {
  id: number;
  taleId: number;
  username: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  reviewId: number;
  parentId: number | null;
  username: string;
  content: string;
  createdAt: string;
}


export type TaleCreate = {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  coverUrl?: string;
  publishedYear?: number;
  tags?: string;
};


export type ReadingStatus = 'WANT_TO_READ' | 'ALREADY_READ' | 'CURRENTLY_READING' | 'DISCONTINUED';

export interface BookshelfItem {
  tale: Tale;
  status: ReadingStatus;
}
