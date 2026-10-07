import { Routes } from '@angular/router';
import {
  categoriesResolver,
  categoryPageResolver,
  postPageResolver,
  postsResolver,
  tagPageResolver,
} from './core/resolvers';

// Post URLs follow `postUrl: "/blog/{slug}"` in contlify.config.ts.
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    resolve: { posts: postsResolver, categories: categoriesResolver },
  },
  { path: 'blog', redirectTo: '', pathMatch: 'full' },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories').then((m) => m.Categories),
    resolve: { categories: categoriesResolver },
  },
  {
    path: 'blog/category/:slug',
    loadComponent: () => import('./pages/category/category').then((m) => m.CategoryPage),
    resolve: { page: categoryPageResolver },
  },
  {
    path: 'blog/tag/:slug',
    loadComponent: () => import('./pages/tag/tag').then((m) => m.TagPage),
    resolve: { page: tagPageResolver },
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/post/post').then((m) => m.PostPage),
    resolve: { page: postPageResolver },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
