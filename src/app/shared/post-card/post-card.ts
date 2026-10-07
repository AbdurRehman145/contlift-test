import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../core/models';
import { coverUrl, excerptOf, postDate, readingMinutes } from '../../core/post-utils';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './post-card.html',
})
export class PostCard {
  readonly post = input.required<Post>();
  /** Larger, side-by-side layout used for the newest post on the home page. */
  readonly featured = input(false);

  protected readonly cover = computed(() => coverUrl(this.post().coverImage));
  protected readonly excerpt = computed(() => excerptOf(this.post()));
  protected readonly date = computed(() => postDate(this.post()));
  protected readonly minutes = computed(() => readingMinutes(this.post()));
  protected readonly placeholderLabel = computed(
    () => this.post().categories?.[0]?.name ?? this.post().title.charAt(0),
  );
}
