import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategorySummary } from '../../core/models';

/** Row of category pills with post counts; `activeSlug` highlights the current one. */
@Component({
  selector: 'app-category-nav',
  imports: [RouterLink],
  template: `
    <nav class="chips chips--nav" aria-label="Categories">
      <a class="chip" [class.chip--active]="!activeSlug()" routerLink="/">All posts</a>
      @for (category of categories(); track category.slug) {
        <a
          class="chip"
          [class.chip--active]="category.slug === activeSlug()"
          [attr.aria-current]="category.slug === activeSlug() ? 'page' : null"
          [routerLink]="['/blog/category', category.slug]"
        >
          {{ category.name }}
          <span class="chip__count">{{ category.postCount ?? 0 }}</span>
        </a>
      }
    </nav>
  `,
})
export class CategoryNav {
  readonly categories = input.required<CategorySummary[]>();
  readonly activeSlug = input<string>();
}
