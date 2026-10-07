import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { Post } from '../core/models';

/**
 * Turns a post body into HTML for an [innerHTML] binding.
 *
 * Contlify stores `contentType: "markdown"` by default even when the publisher
 * sends HTML, so bodies that already look like HTML are passed through as-is
 * rather than parsed as Markdown (which would turn indented HTML into code
 * blocks). Angular's sanitizer still strips scripts and unsafe attributes.
 */
@Pipe({ name: 'postContent' })
export class PostContentPipe implements PipeTransform {
  transform(post: Pick<Post, 'content' | 'contentType'>): string {
    const content = post.content ?? '';
    if (post.contentType === 'html' || /^\s*</.test(content)) return content;
    return marked.parse(content, { async: false, gfm: true });
  }
}
