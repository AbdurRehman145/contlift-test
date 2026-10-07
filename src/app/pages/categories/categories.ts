import { Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategorySummary, Loaded } from '../../core/models';
import { PageMeta } from '../../core/page-meta';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
})
export class Categories {
  /** From categoriesResolver (see app.routes.ts). */
  readonly categories = input.required<Loaded<CategorySummary[]>>();

  constructor() {
    const meta = inject(PageMeta);
    effect(() => {
      if (this.categories().value) {
        meta.set({ title: 'Categories', description: 'Browse every topic on the blog.' });
      } else {
        meta.failed();
      }
    });
  }
}
