import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { BlogApi } from './blog-api';
import {
  CategoryPageData,
  CategorySummary,
  Loaded,
  Post,
  PostPageData,
  TagPageData,
} from './models';
import { sortByDate } from './post-utils';

const RELATED_POST_LIMIT = 3;

function load<T>(source: Observable<T>): Observable<Loaded<T>> {
  return source.pipe(
    map((value) => ({ value, status: 200 })),
    catchError((error: unknown) => {
      const status = error instanceof HttpErrorResponse ? error.status : 500;
      if (status !== 404) console.error('[blog] failed to load page data', error);
      return of({ value: null, status });
    }),
  );
}

function notFound(): never {
  throw new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
}

export const postsResolver: ResolveFn<Loaded<Post[]>> = () =>
  load(inject(BlogApi).posts().pipe(map(sortByDate)));

export const categoriesResolver: ResolveFn<Loaded<CategorySummary[]>> = () =>
  load(inject(BlogApi).categories());

export const postPageResolver: ResolveFn<Loaded<PostPageData>> = (route) => {
  const api = inject(BlogApi);
  const slug = route.paramMap.get('slug') ?? '';

  return load(
    forkJoin({ post: api.post(slug), posts: api.posts() }).pipe(
      map(({ post, posts }) => {
        const categorySlugs = new Set(post.categories?.map((c) => c.slug));
        const related = sortByDate(posts)
          .filter((p) => p.id !== post.id && p.categories?.some((c) => categorySlugs.has(c.slug)))
          .slice(0, RELATED_POST_LIMIT);
        return { post, related };
      }),
    ),
  );
};

export const categoryPageResolver: ResolveFn<Loaded<CategoryPageData>> = (route) => {
  const api = inject(BlogApi);
  const slug = route.paramMap.get('slug') ?? '';

  return load(
    forkJoin({ categories: api.categories(), posts: api.postsByCategory(slug) }).pipe(
      map(({ categories, posts }) => {
        const category = categories.find((c) => c.slug === slug) ?? notFound();
        return { category, categories, posts: sortByDate(posts) };
      }),
    ),
  );
};

export const tagPageResolver: ResolveFn<Loaded<TagPageData>> = (route) => {
  const api = inject(BlogApi);
  const slug = route.paramMap.get('slug') ?? '';

  return load(
    forkJoin({ tags: api.tags(), posts: api.postsByTag(slug) }).pipe(
      map(({ tags, posts }) => {
        const tag = tags.find((t) => t.slug === slug) ?? notFound();
        return { tag, posts: sortByDate(posts) };
      }),
    ),
  );
};
