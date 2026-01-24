import { Component } from '@angular/core';

import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-time-picker-prefix-suffix',
  imports: [TriTimePickerModule, TriIconModule, TriFlexModule],
  template: `
    <tri-flex vertical gap="small">
      <tri-time-picker prefix="smile" />
      <tri-time-picker [prefix]="smile" />
      <tri-time-picker suffixIcon="smile" />
      <tri-time-picker [suffixIcon]="smile" />
      <ng-template #smile><tri-icon type="smile" /></ng-template>
    </tri-flex>
  `
})
export class TriDemoTimePickerPrefixSuffixComponent {}
