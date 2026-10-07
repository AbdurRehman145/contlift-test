import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CategorySummary, Loaded, Post } from '../../core/models';
import { PageMeta } from '../../core/page-meta';
import { excerptOf } from '../../core/post-utils';
import { SITE } from '../../core/site';
import { CategoryNav } from '../../shared/category-nav/category-nav';
import { PostCard } from '../../shared/post-card/post-card';

@Component({
  selector: 'app-home',
  imports: [PostCard, CategoryNav],
  templateUrl: './home.html',
})
export class Home {
  /** From postsResolver / categoriesResolver (see app.routes.ts). */
  readonly posts = input.required<Loaded<Post[]>>();
  readonly categories = input.required<Loaded<CategorySummary[]>>();

  protected readonly site = SITE;
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const posts = this.posts().value ?? [];
    const query = this.query().trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) =>
      [
        post.title,
        post.subtitle,
        excerptOf(post),
        post.author?.name,
        ...(post.categories ?? []).map((c) => c.name),
        ...(post.tags ?? []).map((t) => t.name),
      ].some((text) => text?.toLowerCase().includes(query)),
    );
  });

  /** The newest post gets the large card, except while searching. */
  protected readonly featured = computed(() => (this.query() ? null : (this.filtered()[0] ?? null)));
  protected readonly rest = computed(() =>
    this.featured() ? this.filtered().slice(1) : this.filtered(),
  );

  constructor() {
    const meta = inject(PageMeta);
    effect(() => {
      if (this.posts().value) meta.set({});
      else meta.failed();
    });
  }
}
