import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-badge-no-wrapper',
  imports: [FormsModule, TriBadgeModule, TriIconModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="show"></tri-switch>
    <tri-badge standalone [count]="show ? 25 : 0"></tri-badge>
    <tri-badge
      standalone
      [count]="show ? 4 : 0"
      [style]="{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }"
    ></tri-badge>
    <tri-badge [count]="show ? iconTemplate : 0" standalone>
      <a class="head-example"></a>
    </tri-badge>
    <ng-template #iconTemplate>
      <tri-icon type="clock-circle" class="tri-scroll-number-custom-component" style="color: #f5222d" />
    </ng-template>
    <tri-badge standalone [count]="show ? 109 : 0" [style]="{ backgroundColor: '#52c41a' }"></tri-badge>
  `,
  styles: [
    `
      nz-badge {
        margin-right: 20px;
      }
    `
  ]
})
export class TriDemoBadgeNoWrapperComponent {
  show = true;
}
