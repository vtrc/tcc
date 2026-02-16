import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../core/supabase.client';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  template: `<p style="padding:16px">Procesando login...</p>`,
})
export class AuthCallbackPage {
  private router = inject(Router);
  private session = inject(SessionStore);

  async ngOnInit() {
    // Supabase detecta el token en la URL y establece sesión automáticamente
    await this.session.init();
    if (!this.session.accountId()) await this.session.bootstrapAccount();
    this.router.navigateByUrl('/today');
  }
}