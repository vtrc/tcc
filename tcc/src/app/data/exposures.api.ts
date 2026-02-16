import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';
import { ExposureCreate } from './models';

@Injectable({ providedIn: 'root' })
export class ExposuresApi {
  async createExposure(exposure: ExposureCreate) {
    const { data, error } = await supabase
      .from('exposures')
      .insert(exposure)
      .select('id')
      .single();
    if (error) throw error;
    return data.id as string;
  }

  async setSafetyUsed(exposureId: string, safetyCodes: string[]) {
    // Replace strategy: delete all then insert
    const { error: delErr } = await supabase
      .from('exposure_safety_used')
      .delete()
      .eq('exposure_id', exposureId);
    if (delErr) throw delErr;

    if (safetyCodes.length === 0) return;

    const rows = safetyCodes.map(code => ({ exposure_id: exposureId, safety_code: code }));
    const { error: insErr } = await supabase.from('exposure_safety_used').insert(rows);
    if (insErr) throw insErr;
  }
}