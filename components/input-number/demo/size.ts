import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-size',
  imports: [FormsModule, TriInputNumberModule],
  template: `
    <tri-input-number [(ngModel)]="value" size="large" min="1" max="10" />
    <tri-input-number [(ngModel)]="value" min="1" max="10" />
    <tri-input-number [(ngModel)]="value" size="small" min="1" max="10" />
  `,
  styles: `
    nz-input-number {
      margin-right: 8px;
    }
  `
})
export class TriDemoInputNumberSizeComponent {
  value = 3;
}
