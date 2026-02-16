import { Injectable } from '@angular/core';
import { supabase } from '../core/supabase.client';
import { EntryCreate } from './models';

@Injectable({ providedIn: 'root' })
export class EntriesApi {
  async create(entry: EntryCreate) {
    const { error } = await supabase.from('entries').insert(entry);
    if (error) throw error;
  }
}