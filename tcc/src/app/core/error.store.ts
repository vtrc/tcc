import { Injectable, signal, computed } from '@angular/core';

export type ErrorEventItem = {
  time: string;
  kind: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  extra?: any;
};

@Injectable({ providedIn: 'root' })
export class ErrorStore {
  private _items = signal<ErrorEventItem[]>([]);
  private _open = signal(false);

  readonly items = computed(() => this._items());
  readonly isOpen = computed(() => this._open());
  readonly last = computed(() => this._items()[0] ?? null);

  push(item: Omit<ErrorEventItem, 'time'>) {
    const next: ErrorEventItem = {
      time: new Date().toISOString(),
      ...item,
    };
    // prepend, cap size
    const updated = [next, ...this._items()].slice(0, 50);
    this._items.set(updated);
    this._open.set(true);
  }

  open() { this._open.set(true); }
  close() { this._open.set(false); }
  clear() { this._items.set([]); }
}