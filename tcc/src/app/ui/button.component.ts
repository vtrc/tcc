import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  styles: [`
  .btn{
    appearance: none;
    -webkit-appearance: none;

    border: 1px solid rgba(0,0,0,.14);
    background: #ffffff;
    color: #111111;             /* <-- esto arregla lo blanco */
    border-radius: 12px;
    padding: 10px 14px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
  }

  .btn:hover{
    background: rgba(0,0,0,.03);
  }

  .btn:active{
    transform: translateY(1px);
  }

  .btn:focus-visible{
    outline: 3px solid rgba(0,0,0,.18);
    outline-offset: 2px;
  }

  .btn:disabled{
    opacity: .5;
    cursor: not-allowed;
  }
`],
  template: `
    <button class="btn" [disabled]="disabled" [type]="type">
      <ng-content />
    </button>
  `,
 
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
}