import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: 'tri-demo-input-number-legacy-size',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number [(ngModel)]="value" [size]="'large'" [min]="1" [max]="10" [step]="1"></tri-input-number>
    <tri-input-number [(ngModel)]="value" [min]="1" [max]="10" [step]="1"></tri-input-number>
    <tri-input-number [(ngModel)]="value" [size]="'small'" [min]="1" [max]="10" [step]="1"></tri-input-number>
  `,
  styles: [
    `
      nz-input-number {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberLegacySizeComponent {
  value = 3;
}
