import { Post } from './models';
import { coverUrl, excerptOf, readingMinutes, sortByDate } from './post-utils';

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post_1',
    slug: 'hello',
    title: 'Hello',
    content: '<h2>It works</h2><p>Published with <strong>curl</strong>.</p>',
    status: 'published',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('post-utils', () => {
  it('uses the explicit excerpt when there is one', () => {
    expect(excerptOf(makePost({ excerpt: 'Short summary' }))).toBe('Short summary');
  });

  it('derives an excerpt from HTML content without tags', () => {
    expect(excerptOf(makePost())).toBe('It works Published with curl.');
  });

  it('truncates long derived excerpts at a word boundary', () => {
    const excerpt = excerptOf(makePost({ content: 'word '.repeat(100) }));
    expect(excerpt.length).toBeLessThanOrEqual(161);
    expect(excerpt.endsWith('word…')).toBe(true);
  });

  it('estimates at least one minute of reading time', () => {
    expect(readingMinutes(makePost())).toBe(1);
    expect(readingMinutes(makePost({ content: 'word '.repeat(1100) }))).toBe(5);
    expect(readingMinutes(makePost({ readingTimeMinutes: 12 }))).toBe(12);
  });

  it('accepts cover images as a URL or a media asset', () => {
    expect(coverUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
    expect(coverUrl({ url: 'https://example.com/b.jpg' })).toBe('https://example.com/b.jpg');
    expect(coverUrl(undefined)).toBeNull();
  });

  it('sorts newest first, preferring publishedAt over createdAt', () => {
    const older = makePost({ id: 'a', publishedAt: '2026-01-01T00:00:00.000Z' });
    const newer = makePost({ id: 'b', createdAt: '2026-01-01T00:00:00.000Z', publishedAt: '2026-06-01T00:00:00.000Z' });
    expect(sortByDate([older, newer]).map((p) => p.id)).toEqual(['b', 'a']);
  });
});
