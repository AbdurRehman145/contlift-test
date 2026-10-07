import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Posts change whenever Contlify publishes, so render on each request
    // instead of prerendering at build time.
    path: '**',
    renderMode: RenderMode.Server,
  },
];
