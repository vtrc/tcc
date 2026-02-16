import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="card"><ng-content /></div>`,
  styles: [`
    .card{
      background:#fff;
      border:1px solid rgba(0,0,0,.08);
      border-radius:16px;
      padding:16px;
      box-shadow:0 2px 12px rgba(0,0,0,.04);
      margin: 12px 0;
    }
  `],
})
export class CardComponent {}