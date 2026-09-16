import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-circle',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="75" type="circle" />
    <tri-progress [percent]="70" type="circle" status="exception" />
    <tri-progress [percent]="100" type="circle" />
  `,
  styles: `
    nz-progress {
      display: inline-block;
      margin-inline-end: 8px;
      margin-bottom: 8px;
    }
  `
})
export class TriDemoProgressCircleComponent {}
