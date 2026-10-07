import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryPageData, Loaded } from '../../core/models';
import { PageMeta } from '../../core/page-meta';
import { CategoryNav } from '../../shared/category-nav/category-nav';
import { PostCard } from '../../shared/post-card/post-card';

@Component({
  selector: 'app-category-page',
  imports: [RouterLink, PostCard, CategoryNav],
  templateUrl: './category.html',
})
export class CategoryPage {
  /** From categoryPageResolver (see app.routes.ts). */
  readonly page = input.required<Loaded<CategoryPageData>>();

  protected readonly data = computed(() => this.page().value);

  constructor() {
    const meta = inject(PageMeta);
    effect(() => {
      const data = this.data();
      if (data) {
        meta.set({
          title: data.category.name,
          description: data.category.description || `Posts filed under ${data.category.name}.`,
          image: data.category.coverImage,
        });
      } else if (this.page().status === 404) {
        meta.notFound('Category not found');
      } else {
        meta.failed();
      }
    });
  }
}
