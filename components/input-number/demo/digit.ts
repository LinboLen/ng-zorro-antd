import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-digit',
  imports: [FormsModule, TriInputNumberModule],
  template: `<tri-input-number [(ngModel)]="value" min="0" max="10" step="0.1" placeHolder="Digital" />`
})
export class TriDemoInputNumberDigitComponent {
  value = 0.1;
}
