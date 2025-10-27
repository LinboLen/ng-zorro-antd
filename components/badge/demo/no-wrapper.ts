import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-badge-no-wrapper',
  imports: [FormsModule, TriBadgeModule, TriFlexModule, TriIconModule, TriSwitchModule],
  template: `
    <tri-flex gap="small" align="center">
      <tri-switch [(ngModel)]="show" />
      <tri-badge standalone showZero [count]="show ? 11 : 0" [style]="{ backgroundColor: '#faad14' }" />
      <tri-badge standalone [count]="show ? 25 : 0" />
      <tri-badge standalone [count]="show ? iconTemplate : 0" />
      <tri-badge standalone [count]="show ? 109 : 0" [style]="{ backgroundColor: '#52c41a' }" />
    </tri-flex>

    <ng-template #iconTemplate>
      <tri-icon type="clock-circle" class="tri-scroll-number-custom-component" style="color: #f5222d" />
    </ng-template>
  `
})
export class TriDemoBadgeNoWrapperComponent {
  show = true;
}
