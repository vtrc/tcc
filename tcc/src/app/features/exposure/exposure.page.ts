import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from '../../ui/layout.component';
import { CardComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';
import { SessionStore } from '../../core/session.store';
import { ActionsApi } from '../../data/actions.api';
import { ExposuresApi } from '../../data/exposures.api';
import { LookupsApi, LookupItem } from '../../data/lookups.api';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent, CardComponent, ButtonComponent],
  template: `
    <app-layout>
      <h1>Exposición</h1>

      <app-card>
        <div style="opacity:.7;">ActionId: {{ actionId() }}</div>

        <div style="display:grid; gap:10px; margin-top:12px;">
          <label>SUDS inicio <input class="inp" type="number" min="0" max="10" [(ngModel)]="sudsStart" /></label>
          <label>SUDS pico <input class="inp" type="number" min="0" max="10" [(ngModel)]="sudsPeak" /></label>
          <label>SUDS fin <input class="inp" type="number" min="0" max="10" [(ngModel)]="sudsEnd" /></label>

          <label style="display:flex; gap:10px; align-items:center;">
            <input type="checkbox" [(ngModel)]="escapedEarly" />
            ¿Escapé/evité a mitad?
          </label>

          <label>Aprendizaje (1 frase)
            <input class="inp" [(ngModel)]="learning" />
          </label>

          <details>
            <summary><b>Conductas de seguridad usadas</b> (si marcas alguna, esta exposición no contará para subir paso)</summary>
            <div style="display:grid; gap:8px; margin-top:10px;">
              @for (s of safety(); track s.code) {
                <label style="display:flex; gap:10px; align-items:center;">
                  <input type="checkbox"
                    [checked]="selectedSafety().has(s.code)"
                    (change)="toggleSafety(s.code, $event.target.checked)" />
                  {{ s.label }}
                </label>
              }
            </div>
          </details>

          <app-button (click)="save()" [disabled]="saving()">Guardar y cerrar</app-button>
          @if (error()) { <p style="color:#c00;">{{ error() }}</p> }
        </div>
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
export class ExposurePage {
  actionId = signal<string>('');
  safety = signal<LookupItem[]>([]);
  selectedSafety = signal<Set<string>>(new Set());

  sudsStart = 0;
  sudsPeak = 0;
  sudsEnd = 0;
  escapedEarly = false;
  learning = '';

  saving = signal(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionStore,
    private actionsApi: ActionsApi,
    private exposuresApi: ExposuresApi,
    private lookups: LookupsApi
  ) {}

  async ngOnInit() {
    this.actionId.set(this.route.snapshot.paramMap.get('actionId') ?? '');
    this.safety.set(await this.lookups.safetyBehaviors());
  }

  toggleSafety(code: string, checked: boolean) {
    const next = new Set(this.selectedSafety());
    if (checked) next.add(code);
    else next.delete(code);
    this.selectedSafety.set(next);
  }

  async save() {
    this.saving.set(true);
    this.error.set(null);

    try {
      const accountId = this.session.accountId() ?? (await this.session.bootstrapAccount());
      const userId = this.session.userId();
      if (!accountId || !userId) throw new Error('No session/account');

      const exposureId = await this.exposuresApi.createExposure({
        account_id: accountId,
        user_id: userId,
        suds_start: this.sudsStart,
        suds_peak: this.sudsPeak,
        suds_end: this.sudsEnd,
        escaped_early: this.escapedEarly,
        learning: this.learning || null,
      });

      await this.exposuresApi.setSafetyUsed(exposureId, [...this.selectedSafety()]);
      await this.actionsApi.markDone(this.actionId());

      this.router.navigateByUrl('/today');
    } catch (e: any) {
      this.error.set(e?.message ?? String(e));
    } finally {
      this.saving.set(false);
    }
  }
}