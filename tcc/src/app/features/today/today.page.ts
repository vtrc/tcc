import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodayStore } from './today.store';
import { ActionsApi } from '../../data/actions.api';
import { LayoutComponent } from '../../ui/layout.component';
import { CardComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent, CardComponent, ButtonComponent],
  template: `
    <app-layout>
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
        <h1>Hoy</h1>
        <a routerLink="/log">+ Registrar (60s)</a>
      </div>

      @if (store.loading()) { <p>Cargando…</p> }
      @if (store.error()) { <p style="color:#c00;">{{ store.error() }}</p> }

      @if (store.dashboard(); as d) {
        <app-card>
          <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
            <div><b>Modo:</b> {{ d.mode }}</div>
            <div><b>Patrón:</b> {{ d.metrics.dominant_pattern || '—' }}</div>
          </div>
          <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px;">
            <div><b>Evitación:</b> {{ d.metrics.avoidance_index }}/10</div>
            <div><b>Seguridad:</b> {{ d.metrics.safety_behavior_count }}</div>
            <div><b>Valores:</b> {{ d.metrics.values_actions_count }}</div>
            <div><b>Fallos:</b> {{ d.metrics.missed_actions_count }}</div>
            <div><b>Expos limpias:</b> {{ d.metrics.clean_exposures_count }}</div>
          </div>
          <div style="margin-top:10px;">
            <a routerLink="/review">Revisión semanal</a>
          </div>
        </app-card>

        <app-card>
          <h3 style="margin-top:0;">Acciones de hoy</h3>

          @if (d.actions_today.length === 0) {
            <p>Nada planificado para hoy.</p>
          }

          @for (a of d.actions_today; track a.id) {
            <div style="padding:12px 0; border-top:1px solid rgba(0,0,0,.06);">
              <div style="display:flex; justify-content:space-between; gap:12px;">
                <div>
                  <div><b>{{ a.title }}</b> <span style="opacity:.6">({{ a.action_type }})</span></div>
                  <div style="opacity:.8; margin-top:6px;">{{ a.details }}</div>
                </div>
                <div style="display:flex; gap:8px; align-items:flex-start; flex-wrap:wrap;">
                  <app-button (click)="done(a.id)">Done</app-button>
                  <app-button (click)="tomorrow(a.id)">Mañana</app-button>
                  @if (a.action_type === 'exposure') {
                    <a [routerLink]="['/exposure', a.id]">Abrir</a>
                  }
                </div>
              </div>
            </div>
          }
        </app-card>

        <app-card>
          <h3 style="margin-top:0;">Atrasadas</h3>
          @if (d.actions_overdue.length === 0) { <p>Nada atrasado.</p> }
          @for (a of d.actions_overdue; track a.id) {
            <div style="padding:10px 0; border-top:1px dashed rgba(0,0,0,.12);">
              <div><b>{{ a.title }}</b> — {{ a.scheduled_for }}</div>
              <div style="margin-top:8px;">
                <app-button (click)="tomorrow(a.id)">Reprogramar mañana</app-button>
              </div>
            </div>
          }
        </app-card>
      }
    </app-layout>
  `,
})
export class TodayPage {
  store = inject(TodayStore);
  private actionsApi = inject(ActionsApi);

  ngOnInit() { this.store.load(); }

  async done(id: string) {
    await this.actionsApi.markDone(id);
    await this.store.load();
  }

  async tomorrow(id: string) {
    const t = new Date(); t.setDate(t.getDate() + 1);
    const yyyyMmDd = t.toISOString().slice(0, 10);
    await this.actionsApi.reschedule(id, yyyyMmDd);
    await this.store.load();
  }
}