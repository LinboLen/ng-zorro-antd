import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-number-legacy-prefix',
  imports: [FormsModule, TriInputNumberLegacyModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <tri-input-number-group *spaceItem prefix="￥" style="width: 100%">
        <tri-input-number [step]="1"></tri-input-number>
      </tri-input-number-group>
      <tri-input-number-group *spaceItem addOnBeforeIcon="user" prefix="￥" style="width: 100%">
        <tri-input-number [step]="1"></tri-input-number>
      </tri-input-number-group>
      <tri-input-number-group *spaceItem prefix="￥" style="width: 100%">
        <tri-input-number disabled [step]="1"></tri-input-number>
      </tri-input-number-group>
    </tri-space>
  `
})
export class TriDemoInputNumberLegacyPrefixComponent {}
