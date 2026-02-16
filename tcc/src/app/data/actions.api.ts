import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

@Injectable({ providedIn: 'root' })
export class ActionsApi {
  async markDone(actionId: string) {
    const { error } = await supabase
      .from('actions')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', actionId);
    if (error) throw error;
  }

  async reschedule(actionId: string, yyyyMmDd: string) {
    const { error } = await supabase
      .from('actions')
      .update({ status: 'rescheduled', scheduled_for: yyyyMmDd })
      .eq('id', actionId);
    if (error) throw error;
  }
}