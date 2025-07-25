import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-progress-segment',
  imports: [TriProgressModule, TriTooltipModule],
  template: `
    <tri-progress
      tri-tooltip
      tooltipTitle="3 done / 3 in progress / 4 to do"
      [percent]="60"
      [successPercent]="30"
    ></tri-progress>
    <tri-progress
      tri-tooltip
      tooltipTitle="3 done / 3 in progress / 4 to do"
      type="circle"
      [percent]="60"
      [successPercent]="30"
    ></tri-progress>
    <tri-progress
      tri-tooltip
      tooltipTitle="3 done / 3 in progress / 4 to do"
      type="dashboard"
      [percent]="60"
      [successPercent]="30"
    ></tri-progress>
  `
})
export class TriDemoProgressSegmentComponent {}
