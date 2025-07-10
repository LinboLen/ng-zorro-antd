import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: '',
  imports: [TriBadgeModule],
  template: `
    <tri-badge size="default" [count]="5">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge size="small" [count]="5">
      <a class="head-example"></a>
    </tri-badge>
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
export class TriDemoBadgeSizeComponent {}
