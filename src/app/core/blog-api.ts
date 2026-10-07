import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CategorySummary, Post, TagSummary } from './models';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

/**
 * Reads blog content from the public Contlify routes mounted in server.contlify.ts.
 * Those routes query Supabase on the server with the secret key, so no Supabase
 * credentials ever reach the browser.
 */
@Injectable({ providedIn: 'root' })
export class BlogApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contlify/v1';

  /** All published posts, newest first. */
  posts(): Observable<Post[]> {
    return this.get<Post[]>('/posts');
  }

  post(slug: string): Observable<Post> {
    return this.get<Post>(`/posts/${encodeURIComponent(slug)}`);
  }

  categories(): Observable<CategorySummary[]> {
    return this.get<CategorySummary[]>('/categories');
  }

  postsByCategory(slug: string): Observable<Post[]> {
    return this.get<Post[]>(`/categories/${encodeURIComponent(slug)}`);
  }

  tags(): Observable<TagSummary[]> {
    return this.get<TagSummary[]>('/tags');
  }

  postsByTag(slug: string): Observable<Post[]> {
    return this.get<Post[]>(`/tags/${encodeURIComponent(slug)}`);
  }

  private get<T>(path: string): Observable<T> {
    return this.http.get<ApiEnvelope<T>>(this.baseUrl + path).pipe(map((res) => res.data));
  }
}
