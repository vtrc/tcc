import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';
import type { Dashboard } from './models';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  async get(accountId: string, day?: string): Promise<Dashboard> {
    const args: any = { p_account_id: accountId };
    if (day) args.p_day = day;

    const { data, error } = await supabase.rpc('get_dashboard', args);
    if (error) throw error;

    return data as Dashboard;
  }

  async getDashboard(accountId: string, day?: string): Promise<Dashboard> {
    return this.get(accountId, day);
  }
}