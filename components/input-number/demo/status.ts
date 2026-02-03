import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-status',
  imports: [FormsModule, TriInputNumberModule, TriIconModule],
  template: `
    <tri-input-number status="error" [style.width.%]="100" />
    <tri-input-number status="warning" [style.width.%]="100" />
    <tri-input-number status="error" [style.width.%]="100">
      <tri-icon inputPrefix type="clock-circle" />
    </tri-input-number>
    <tri-input-number status="warning" [style.width.%]="100">
      <tri-icon inputPrefix type="clock-circle" />
    </tri-input-number>
  `,
  styles: `
    nz-input-number {
      margin-bottom: 8px;
    }
  `
})
export class TriDemoInputNumberStatusComponent {}
