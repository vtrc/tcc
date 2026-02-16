import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';

export interface LookupItem { code: string; label: string; }

@Injectable({ providedIn: 'root' })
export class LookupsApi {
  async safetyBehaviors(): Promise<LookupItem[]> {
    const { data, error } = await supabase
      .from('lookup_safety_behaviors')
      .select('code,label')
      .order('label');
    if (error) throw error;
    return data as LookupItem[];
  }

  async distortions(): Promise<LookupItem[]> {
    const { data, error } = await supabase
      .from('lookup_cognitive_distortions')
      .select('code,label')
      .order('label');
    if (error) throw error;
    return data as LookupItem[];
  }

  async emotions(): Promise<LookupItem[]> {
    const { data, error } = await supabase
      .from('lookup_emotions')
      .select('code,label')
      .order('label');
    if (error) throw error;
    return data as LookupItem[];
  }
}