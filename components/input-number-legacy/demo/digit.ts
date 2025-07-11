import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: 'tri-demo-input-number-legacy-digit',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number
      [(ngModel)]="value"
      [min]="1"
      [max]="10"
      [step]="0.1"
      [placeHolder]="'Digital'"
    ></tri-input-number>
  `
})
export class TriDemoInputNumberLegacyDigitComponent {
  value = 0;
}
