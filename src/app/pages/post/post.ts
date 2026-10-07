import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loaded, PostPageData } from '../../core/models';
import { PageMeta } from '../../core/page-meta';
import { coverUrl, excerptOf, postDate, readingMinutes } from '../../core/post-utils';
import { PostCard } from '../../shared/post-card/post-card';
import { PostContentPipe } from '../../shared/post-content.pipe';

@Component({
  selector: 'app-post-page',
  imports: [RouterLink, DatePipe, PostCard, PostContentPipe],
  templateUrl: './post.html',
})
export class PostPage {
  /** From postPageResolver (see app.routes.ts). */
  readonly page = input.required<Loaded<PostPageData>>();

  protected readonly post = computed(() => this.page().value?.post ?? null);
  protected readonly cover = computed(() => coverUrl(this.post()?.coverImage));
  protected readonly date = computed(() => {
    const post = this.post();
    return post ? postDate(post) : null;
  });
  protected readonly minutes = computed(() => {
    const post = this.post();
    return post ? readingMinutes(post) : 0;
  });

  constructor() {
    const meta = inject(PageMeta);
    effect(() => {
      const post = this.post();
      if (post) {
        meta.set({
          title: post.seo?.title || post.title,
          description: post.seo?.description || excerptOf(post),
          image: post.seo?.ogImage || coverUrl(post.coverImage),
          type: 'article',
        });
      } else if (this.page().status === 404) {
        meta.notFound('Post not found');
      } else {
        meta.failed();
      }
    });
  }
}
