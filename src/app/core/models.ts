import type { Category, Post, Tag } from 'contlify';

export type { Author, MediaAsset, Post } from 'contlify';

/** Categories and tags as returned by the list endpoints, which add a post count. */
export type CategorySummary = Category & { postCount?: number };
export type TagSummary = Tag & { postCount?: number };

/**
 * Result of loading page data in a route resolver. Resolvers never throw, so a
 * failed request still renders the page (with an error or not-found state)
 * instead of aborting navigation.
 */
export interface Loaded<T> {
  value: T | null;
  /** 200 on success, otherwise the HTTP status of the failure (0 for network errors). */
  status: number;
}

export interface PostPageData {
  post: Post;
  related: Post[];
}

export interface CategoryPageData {
  category: CategorySummary;
  categories: CategorySummary[];
  posts: Post[];
}

export interface TagPageData {
  tag: TagSummary;
  posts: Post[];
}
