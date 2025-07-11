import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-handler-icon',
  imports: [FormsModule, TriInputNumberModule, TriIconModule],
  template: `
    <tri-input-number [(ngModel)]="value">
      <tri-icon inputNumberUpIcon type="arrow-up" />
      <tri-icon inputNumberDownIcon type="arrow-down" />
    </tri-input-number>
  `
})
export class TriDemoInputNumberHandlerIconComponent {
  value = 3;
}
