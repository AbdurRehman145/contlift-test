import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageMeta } from '../../core/page-meta';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="container state state--page">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <a class="button" routerLink="/">Back to all posts</a>
    </div>
  `,
})
export class NotFound {
  constructor() {
    inject(PageMeta).notFound();
  }
}
