import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HttpBackend } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ContlifyServerBackend } from './server/contlify-server-backend';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Read blog data in-process during SSR instead of calling our own URL over HTTP.
    { provide: HttpBackend, useClass: ContlifyServerBackend },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
