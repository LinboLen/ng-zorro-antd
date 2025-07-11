import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-out-of-range',
  imports: [FormsModule, TriInputNumberModule],
  template: `<tri-input-number [(ngModel)]="value" min="1" max="10" />`
})
export class TriDemoInputNumberOutOfRangeComponent {
  value = 99;
}
