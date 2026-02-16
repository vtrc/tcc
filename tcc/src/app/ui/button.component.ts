import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button class="btn" [disabled]="disabled" [type]="type">
      <ng-content />
    </button>
  `,
  styles: [`
    .btn{
      border:1px solid rgba(0,0,0,.12);
      background:#fff;
      border-radius:12px;
      padding:10px 14px;
      font-weight:600;
    }
    .btn:disabled{ opacity:.5; }
  `],
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
}