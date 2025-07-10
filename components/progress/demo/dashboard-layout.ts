import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: '',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="1" type="dashboard" [gapDegree]="90"></tri-progress>
    <tri-progress [percent]="75" type="dashboard" [gapDegree]="180"></tri-progress>
    <tri-progress [percent]="75" type="dashboard" [gapDegree]="295"></tri-progress>
    <tri-progress [percent]="1" type="dashboard" [gapDegree]="340"></tri-progress>
  `
})
export class TriDemoProgressDashboardLayoutComponent {}
