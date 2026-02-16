import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorStore } from '../core/error.store';

@Component({
  selector: 'app-error-hud',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (store.isOpen()) {
      <div class="backdrop" (click)="store.close()"></div>
      <div class="panel">
        <div class="head">
          <div><b>Errores</b> ({{ store.items().length }})</div>
          <div class="actions">
            <button (click)="copy()">Copiar</button>
            <button (click)="store.clear()">Vaciar</button>
            <button (click)="store.close()">Cerrar</button>
          </div>
        </div>

        <div class="list">
          @for (e of store.items(); track e.time) {
            <div class="item">
              <div class="meta">
                <span class="tag">{{ e.kind }}</span>
                <span class="time">{{ e.time }}</span>
              </div>
              <div class="msg">{{ e.message }}</div>
              @if (e.stack) {
                <pre class="stack">{{ e.stack }}</pre>
              }
            </div>
          }
        </div>
      </div>
    } @else {
      @if (store.last(); as last) {
        <button class="fab" (click)="store.open()">!</button>
      }
    }
  `,
  styles: [`
    .fab{
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 48px;
      height: 48px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,.2);
      background: #fff;
      font-weight: 800;
      font-size: 18px;
      box-shadow: 0 6px 20px rgba(0,0,0,.15);
      z-index: 9999;
    }
    .backdrop{
      position: fixed; inset: 0;
      background: rgba(0,0,0,.35);
      z-index: 9998;
    }
    .panel{
      position: fixed;
      left: 12px; right: 12px; top: 12px; bottom: 12px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,.12);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .head{
      padding: 12px 12px;
      border-bottom: 1px solid rgba(0,0,0,.08);
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }
    .actions{ display:flex; gap:8px; flex-wrap: wrap; }
    .actions button{
      border:1px solid rgba(0,0,0,.12);
      background:#fff; border-radius: 10px;
      padding: 8px 10px;
      font-weight: 600;
    }
    .list{ padding: 12px; overflow: auto; }
    .item{
      padding: 12px;
      border: 1px solid rgba(0,0,0,.08);
      border-radius: 12px;
      margin-bottom: 10px;
    }
    .meta{ display:flex; gap:10px; align-items:center; opacity:.75; font-size:12px; }
    .tag{ padding: 2px 8px; border:1px solid rgba(0,0,0,.12); border-radius: 999px; }
    .msg{ margin-top: 6px; font-weight: 700; }
    .stack{
      margin-top: 8px;
      padding: 10px;
      background: rgba(0,0,0,.04);
      border-radius: 10px;
      font-size: 12px;
      overflow:auto;
    }
  `],
})
export class ErrorHudComponent {
  store = inject(ErrorStore);

  async copy() {
    const text = this.store.items()
      .map(e => `[${e.time}] ${e.kind.toUpperCase()}: ${e.message}\n${e.stack ?? ''}`)
      .join('\n\n');

    await navigator.clipboard.writeText(text);
  }
}