import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'tri-demo-badge-link',
  imports: [TriBadgeModule],
  template: `
    <a>
      <tri-badge [count]="5">
        <a class="head-example"></a>
      </tri-badge>
    </a>
  `,
  styles: [
    `
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
export class TriDemoBadgeLinkComponent {}
