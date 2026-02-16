import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SessionStore } from './core/session.store';
import { ErrorStore } from './core/error.store';
import { installGlobalErrorCapture } from './core/error-capture';
import { ErrorHudComponent } from './ui/error-hud.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, ErrorHudComponent],
  selector: 'app-root',
  template: `
  hola
  <router-outlet />
  <app-error-hud />
  `,
})
export class App {
  private session = inject(SessionStore);
  private router = inject(Router);

  constructor() {

    const store = inject(ErrorStore);
    installGlobalErrorCapture(store)
    // Inicializa sesión al cargar la app
    this.session.init();

    // Si no hay sesión, manda a auth (sin bucles)
    effect(() => {
      const ready = this.session.isReady();
      const authed = this.session.isAuthenticated();
      if (!ready) return;
      const url = this.router.url;
      if (!authed && !url.startsWith('/auth')) {
        this.router.navigateByUrl('/auth');
      }
    });
  }
}