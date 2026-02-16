import { Injectable, signal, inject } from '@angular/core';
import { DashboardApi } from '../../data/dashboard.api';
import { Dashboard } from '../../data/models';
import { SessionStore } from '../../core/session.store';

@Injectable({ providedIn: 'root' })
export class TodayStore {
  private session = inject(SessionStore);
  private dashboardApi = inject(DashboardApi);

  dashboard = signal<Dashboard | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const accountId = this.session.accountId() ?? (await this.session.bootstrapAccount());
      if (!accountId) throw new Error('No account');

      const d = await this.dashboardApi.get(accountId);
      this.dashboard.set(d);
    } catch (e: any) {
      this.error.set(e?.message ?? String(e));
    } finally {
      this.loading.set(false);
    }
  }
}