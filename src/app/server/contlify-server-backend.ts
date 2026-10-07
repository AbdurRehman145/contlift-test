import {
  FetchBackend,
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getAllPosts,
  getCategories,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getTags,
} from 'contlify';
import { Observable } from 'rxjs';
import '../../../contlify.config';

const API_PREFIX = '/api/contlify/v1';

/** Mirrors the public read routes in server.contlify.ts. A `null` result means not found. */
const READ_ROUTES: ReadonlyArray<[RegExp, (slug: string) => Promise<unknown>]> = [
  [/^\/posts$/, () => getAllPosts()],
  [/^\/posts\/([^/]+)$/, (slug) => getPostBySlug(slug)],
  [/^\/categories$/, () => getCategories()],
  [/^\/categories\/([^/]+)$/, (slug) => getPostsByCategory(slug)],
  [/^\/tags$/, () => getTags()],
  [/^\/tags\/([^/]+)$/, (slug) => getPostsByTag(slug)],
];

/**
 * Server-only HttpBackend: during SSR, GET requests for the public Contlify read
 * routes are answered in-process instead of over HTTP.
 *
 * Calling the site's own URL from inside a serverless function costs a second
 * invocation, and on protected Vercel preview deployments it is rejected (the
 * server-side request carries no Vercel auth cookie). Responses still pass
 * through HttpClient's interceptors, so they are embedded in the page and the
 * browser reuses them instead of fetching again.
 */
@Injectable()
export class ContlifyServerBackend extends FetchBackend {
  override handle(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const load = request.method === 'GET' ? matchReadRoute(request.url) : null;
    if (!load) return super.handle(request);

    return new Observable((observer) => {
      load().then(
        (data) => {
          if (data === null) {
            observer.error(
              new HttpErrorResponse({
                status: 404,
                statusText: 'Not Found',
                url: request.url,
                error: { success: false, error: 'Not found' },
              }),
            );
            return;
          }
          observer.next(
            new HttpResponse({
              status: 200,
              statusText: 'OK',
              url: request.url,
              body: { success: true, data },
            }),
          );
          observer.complete();
        },
        (error: unknown) => {
          console.error('[contlify] SSR read failed:', error);
          observer.error(
            new HttpErrorResponse({
              status: 500,
              statusText: 'Internal Server Error',
              url: request.url,
              error: { success: false, error: error instanceof Error ? error.message : String(error) },
            }),
          );
        },
      );
    });
  }
}

function matchReadRoute(url: string): (() => Promise<unknown>) | null {
  const { pathname } = new URL(url, 'http://localhost');
  if (!pathname.startsWith(`${API_PREFIX}/`)) return null;

  const path = pathname.slice(API_PREFIX.length);
  for (const [pattern, load] of READ_ROUTES) {
    const match = pattern.exec(path);
    if (match) return () => load(decodeURIComponent(match[1] ?? ''));
  }
  return null;
}
