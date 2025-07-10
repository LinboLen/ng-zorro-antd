import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `<tri-input-number borderless [(ngModel)]="value"></tri-input-number>`
})
export class TriDemoInputNumberLegacyBorderlessComponent {
  value = 3;
}
