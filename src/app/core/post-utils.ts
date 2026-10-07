import { MediaAsset, Post } from './models';

const WORDS_PER_MINUTE = 220;
const EXCERPT_LENGTH = 160;

export function postDate(post: Post): string | Date {
  return post.publishedAt ?? post.createdAt;
}

export function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime(),
  );
}

export function coverUrl(cover: MediaAsset | string | undefined | null): string | null {
  if (!cover) return null;
  return typeof cover === 'string' ? cover : cover.url || null;
}

/** Plain text of the post body, whether it was published as HTML or Markdown. */
function plainText(post: Post): string {
  return (post.content ?? '')
    .replace(/<br\s*\/?>|<\/(p|h[1-6]|li|div|blockquote|pre|tr|td|th)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/[#>*_`~[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerptOf(post: Post): string {
  if (post.excerpt) return post.excerpt;
  const text = plainText(post);
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${lastSpace > EXCERPT_LENGTH / 2 ? cut.slice(0, lastSpace) : cut}…`;
}

export function readingMinutes(post: Post): number {
  if (post.readingTimeMinutes) return post.readingTimeMinutes;
  const words = plainText(post).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
