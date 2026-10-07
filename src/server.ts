import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { mountContlify } from '../server.contlify';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Hostnames Angular will render for (SSRF protection), on top of
 * `security.allowedHosts` in angular.json: the domains Vercel assigns to this
 * deployment, plus any listed in NG_ALLOWED_HOSTS (comma-separated, e.g. a
 * custom domain). Passing `allowedHosts` here replaces Angular's own
 * NG_ALLOWED_HOSTS lookup, so it is read again below.
 */
function deploymentHosts(): string[] {
  const env = process.env;
  return [
    env['VERCEL_PROJECT_PRODUCTION_URL'],
    env['VERCEL_BRANCH_URL'],
    env['VERCEL_URL'],
    ...(env['NG_ALLOWED_HOSTS'] ?? '').split(','),
  ]
    .map((host) => host?.trim())
    .filter((host): host is string => !!host);
}

const app = express();
const angularApp = new AngularNodeAppEngine({ allowedHosts: deploymentHosts() });

/**
 * Contlify API: public read routes used by the blog pages, plus the
 * key-protected publishing API (POST /posts, PATCH /posts/:id, /validate, ...).
 * Must be mounted before Angular's catch-all rendering handler.
 */
mountContlify(app);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build),
 * Firebase Cloud Functions, and the Vercel function in api/index.mjs.
 */
export const reqHandler = createNodeRequestHandler(app);
