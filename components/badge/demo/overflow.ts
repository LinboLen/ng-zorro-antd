import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: '',
  imports: [TriBadgeModule],
  template: `
    <tri-badge [count]="99">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="200">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="200" [overflowCount]="10">
      <a class="head-example"></a>
    </tri-badge>
    <tri-badge [count]="10000" [overflowCount]="999">
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
export class TriDemoBadgeOverflowComponent {}
