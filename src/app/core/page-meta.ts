import { inject, Injectable, RESPONSE_INIT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from './site';

export interface PageMetaOptions {
  /** Page title; the site name is appended. Omit for the home page. */
  title?: string;
  description?: string;
  image?: string | null;
  type?: 'website' | 'article';
}

/** Sets the document title, SEO/Open Graph tags and (during SSR) the HTTP status. */
@Injectable({ providedIn: 'root' })
export class PageMeta {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  set({ title, description = SITE.description, image, type = 'website' }: PageMetaOptions): void {
    const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title ?? SITE.name });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.meta.updateTag({ name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' });
    this.meta.removeTag("name='robots'");
    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
    } else {
      this.meta.removeTag("property='og:image'");
    }
  }

  /** Marks the server-rendered response as 404 so search engines don't index it. */
  notFound(title = 'Page not found'): void {
    this.setErrorStatus(404, title);
  }

  /** Data for the page couldn't be loaded (e.g. Supabase unreachable). */
  failed(): void {
    this.setErrorStatus(503, 'Something went wrong');
  }

  private setErrorStatus(status: number, title: string): void {
    if (this.responseInit) this.responseInit.status = status;
    this.set({ title });
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
  }
}
