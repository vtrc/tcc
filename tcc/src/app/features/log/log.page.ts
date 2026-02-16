import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../ui/layout.component';
import { CardComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';
import { SessionStore } from '../../core/session.store';
import { EntriesApi } from '../../data/entries.api';
import { LookupsApi, LookupItem } from '../../data/lookups.api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, CardComponent, ButtonComponent],
  template: `
    <app-layout>
      <h1>Registro (60s)</h1>

      <app-card>
        <form (ngSubmit)="save()" style="display:grid; gap:10px;">
          <input class="inp" placeholder="Situación" [(ngModel)]="situation" name="situation" />
          <input class="inp" placeholder="Pensamiento automático" [(ngModel)]="thought" name="thought" />
          <input class="inp" placeholder="¿Qué quería evitar?" [(ngModel)]="avoidance" name="avoidance" />

          <label style="display:flex; gap:10px; align-items:center;">
            <input type="checkbox" [(ngModel)]="approached" name="approached" />
            Me acerqué (si no, es evitación)
          </label>

          <select class="inp" [(ngModel)]="distortion" name="distortion">
            <option value="">Distorsión (opcional)</option>
            @for (d of distortions(); track d.code) {
              <option [value]="d.code">{{ d.label }}</option>
            }
          </select>

          <div style="display:flex; gap:10px;">
            <select class="inp" [(ngModel)]="emotion" name="emotion">
              <option value="">Emoción (opcional)</option>
              @for (e of emotions(); track e.code) {
                <option [value]="e.code">{{ e.label }}</option>
              }
            </select>
            <input class="inp" type="number" min="0" max="10" placeholder="Intensidad 0-10"
              [(ngModel)]="intensity" name="intensity" />
          </div>

          <app-button type="submit" [disabled]="loading()">Guardar</app-button>
          <a href="/today">Volver</a>
        </form>

        @if (error()) { <p style="color:#c00; margin-top:10px;">{{ error() }}</p> }
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
export class LogPage {
  situation = '';
  thought = '';
  avoidance = '';
  approached = true;

  distortion = '';
  emotion = '';
  intensity: number | null = null;

  loading = signal(false);
  error = signal<string | null>(null);

  distortions = signal<LookupItem[]>([]);
  emotions = signal<LookupItem[]>([]);

  constructor(
    private session: SessionStore,
    private entriesApi: EntriesApi,
    private lookups: LookupsApi,
    private router: Router
  ) {}

  async ngOnInit() {
    this.distortions.set(await this.lookups.distortions());
    this.emotions.set(await this.lookups.emotions());
  }

  async save() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const accountId = this.session.accountId() ?? (await this.session.bootstrapAccount());
      const userId = this.session.userId();
      if (!accountId || !userId) throw new Error('No session/account');

      await this.entriesApi.create({
        account_id: accountId,
        user_id: userId,
        entry_type: 'thought_record',
        occurred_at: new Date().toISOString(),
        situation: this.situation || null,
        automatic_thought: this.thought || null,
        avoidance_target: this.avoidance || null,
        approached: this.approached,
        distortion_code: this.distortion || null,
        emotion1_code: this.emotion || null,
        emotion1_intensity: this.intensity ?? null,
      });

      // Trigger en DB crea acciones -> volvemos
      this.router.navigateByUrl('/today');
    } catch (e: any) {
      this.error.set(e?.message ?? String(e));
    } finally {
      this.loading.set(false);
    }
  }
}