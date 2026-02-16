import { Injectable, computed, signal } from '@angular/core';
import { supabase } from './supabase.client';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private _ready = signal(false);
  private _userId = signal<string | null>(null);
  private _accountId = signal<string | null>(null);

  readonly isReady = computed(() => this._ready());
  readonly userId = computed(() => this._userId());
  readonly accountId = computed(() => this._accountId());
  readonly isAuthenticated = computed(() => !!this._userId());

  async init() {
    if (this._ready()) return;
    const { data } = await supabase.auth.getSession();
    this._userId.set(data.session?.user?.id ?? null);

    // keep in sync
    supabase.auth.onAuthStateChange((_event, session) => {
      this._userId.set(session?.user?.id ?? null);
      if (!session) this._accountId.set(null);
    });

    this._ready.set(true);
  }

  async bootstrapAccount() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return null;

    const { data, error } = await supabase.rpc('bootstrap_user', {
      account_name: 'Personal',
    });
    if (error) throw error;

    this._accountId.set(data as string);
    return data as string;
  }

  async signOut() {
    await supabase.auth.signOut();
    this._userId.set(null);
    this._accountId.set(null);
  }
}