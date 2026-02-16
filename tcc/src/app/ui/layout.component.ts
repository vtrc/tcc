import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `
    <div class="wrap">
      <ng-content />
    </div>
  `,
  styles: [`
    .wrap {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
  `],
})
export class LayoutComponent {}