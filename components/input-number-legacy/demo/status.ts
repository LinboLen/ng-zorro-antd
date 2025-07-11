import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-number-legacy-status',
  imports: [FormsModule, TriInputNumberLegacyModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-input-number *spaceItem [step]="1" status="error" style="width: 100%"></tri-input-number>
      <tri-input-number *spaceItem [step]="1" status="warning" style="width: 100%"></tri-input-number>
      <tri-input-number-group *spaceItem prefixIcon="clock-circle" status="error" style="width: 100%">
        <tri-input-number [step]="1"></tri-input-number>
      </tri-input-number-group>
      <tri-input-number-group *spaceItem prefixIcon="clock-circle" status="warning" style="width: 100%">
        <tri-input-number [step]="1"></tri-input-number>
      </tri-input-number-group>
    </tri-space>
  `
})
export class TriDemoInputNumberLegacyStatusComponent {}
