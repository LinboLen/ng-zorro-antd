import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriBadgeModule, TriIconModule],
  template: `
    <tri-badge [count]="5">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="0" showZero>
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="iconTemplate">
      <a class="head-example"></a>
    </tri-badge>
    <ng-template #iconTemplate>
      <tri-icon type="clock-circle" class="tri-scroll-number-custom-component" style="color: #f5222d" />
    </ng-template>
  `,
  styles: [
    `
      nz-badge {
        margin-right: 20px;
      }

      .head-example {
        width: 42px;
        height: 42px;
        border-radius: 4px;
        background: #eee;
        display: inline-block;
        vertical-align: middle;
      }
    `
  ]
})
export class TriDemoBadgeBasicComponent {}
