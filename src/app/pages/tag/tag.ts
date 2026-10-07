import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loaded, TagPageData } from '../../core/models';
import { PageMeta } from '../../core/page-meta';
import { PostCard } from '../../shared/post-card/post-card';

@Component({
  selector: 'app-tag-page',
  imports: [RouterLink, PostCard],
  templateUrl: './tag.html',
})
export class TagPage {
  /** From tagPageResolver (see app.routes.ts). */
  readonly page = input.required<Loaded<TagPageData>>();

  protected readonly data = computed(() => this.page().value);

  constructor() {
    const meta = inject(PageMeta);
    effect(() => {
      const data = this.data();
      if (data) {
        meta.set({ title: `#${data.tag.name}`, description: `Posts tagged ${data.tag.name}.` });
      } else if (this.page().status === 404) {
        meta.notFound('Tag not found');
      } else {
        meta.failed();
      }
    });
  }
}
