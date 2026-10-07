import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SITE } from './core/site';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
  /** Resolvers fetch page data before a route activates; show progress meanwhile. */
  protected readonly navigating = computed(() => this.router.currentNavigation() !== null);
}
