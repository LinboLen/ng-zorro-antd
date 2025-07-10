import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `<tri-input-number [(ngModel)]="value" [min]="1" [max]="10" [step]="1"></tri-input-number>`
})
export class TriDemoInputNumberLegacyBasicComponent {
  value = 3;
}
