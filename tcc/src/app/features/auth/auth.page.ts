import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '../../core/auth.api';
import { SessionStore } from '../../core/session.store';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../ui/layout.component';
import { CardComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, CardComponent, ButtonComponent],
  template: `
    <app-layout>
      <h1>Acceso</h1>

      <app-card>
        <p>Te enviamos un enlace de acceso al email.</p>
        <form (ngSubmit)="sendOtp()">
          <input class="inp" placeholder="tu@email.com" [(ngModel)]="email" name="email" />
          <div style="margin-top:12px;">
            <app-button type="submit" [disabled]="loading()">Enviar enlace</app-button>
          </div>
        </form>

        @if (msg()) { <p style="margin-top:12px;">{{ msg() }}</p> }
        @if (err()) { <p style="margin-top:12px; color:#c00;">{{ err() }}</p> }
      </app-card>
    </app-layout>
  `,
  styles: [`
    .inp{
      width:100%;
      padding:12px;
      border-radius:12px;
      border:1px solid rgba(0,0,0,.15);
    }
  `],
})
export class AuthPage {
  private authApi = inject(AuthApi);
  private session = inject(SessionStore);
  private router = inject(Router);

  email = '';
  loading = signal(false);
  msg = signal<string | null>(null);
  err = signal<string | null>(null);

  async sendOtp() {
    this.loading.set(true);
    this.err.set(null);
    this.msg.set(null);
    try {
      await this.authApi.signInWithOtp(this.email.trim());
      this.msg.set('Revisa tu email y abre el enlace. Cuando vuelvas aquí, se iniciará sesión.');
      // En iPad: al volver con el deep link, Supabase detecta sesión.
      setTimeout(async () => {
        await this.session.init();
        if (this.session.isAuthenticated()) {
          await this.session.bootstrapAccount();
          this.router.navigateByUrl('/today');
        }
      }, 2000);
    } catch (e: any) {
      this.err.set(e?.message ?? String(e));
    } finally {
      this.loading.set(false);
    }
  }
}