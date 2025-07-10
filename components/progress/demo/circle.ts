import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: '',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="75" type="circle"></tri-progress>
    <tri-progress [percent]="70" type="circle" status="exception"></tri-progress>
    <tri-progress [percent]="100" type="circle"></tri-progress>
  `,
  styles: [
    `
      nz-progress {
        margin-right: 8px;
        margin-bottom: 8px;
        display: inline-block;
      }
    `
  ]
})
export class TriDemoProgressCircleComponent {}
