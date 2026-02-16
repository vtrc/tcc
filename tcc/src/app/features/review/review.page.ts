import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../ui/layout.component';
import { CardComponent } from '../../ui/card.component';
import { SessionStore } from '../../core/session.store';
import { DashboardApi } from '../../data/dashboard.api';

@Component({
  standalone: true,
  imports: [CommonModule, LayoutComponent, CardComponent],
  template: `
    <app-layout>
      <h1>Revisión semanal</h1>

      <app-card>
        <button (click)="refresh()">Refrescar métricas</button>
        @if (error()) { <p style="color:#c00;">{{ error() }}</p> }
      </app-card>

      @if (dash(); as d) {
        <app-card>
          <div><b>Modo:</b> {{ d.mode }}</div>
          <div><b>Patrón:</b> {{ d.metrics.dominant_pattern || '—' }}</div>
          <div style="margin-top:10px; display:grid; gap:6px;">
            <div>Evitación: {{ d.metrics.avoidance_index }}/10</div>
            <div>Seguridad: {{ d.metrics.safety_behavior_count }}</div>
            <div>Valores: {{ d.metrics.values_actions_count }}</div>
            <div>Fallos: {{ d.metrics.missed_actions_count }}</div>
            <div>Expos limpias: {{ d.metrics.clean_exposures_count }}</div>
          </div>
        </app-card>
      }
    </app-layout>
  `,
})
export class ReviewPage {
  dash = signal<any | null>(null);
  error = signal<string | null>(null);

  constructor(private session: SessionStore, private dashboardApi: DashboardApi) {}

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    this.error.set(null);
    try {
      const accountId = this.session.accountId() ?? (await this.session.bootstrapAccount());
      if (!accountId) throw new Error('No account');
      this.dash.set(await this.dashboardApi.get(accountId));
    } catch (e: any) {
      this.error.set(e?.message ?? String(e));
    }
  }
}