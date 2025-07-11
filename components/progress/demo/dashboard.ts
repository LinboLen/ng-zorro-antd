import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-dashboard',
  imports: [TriProgressModule],
  template: `<tri-progress [percent]="75" type="dashboard"></tri-progress>`
})
export class TriDemoProgressDashboardComponent {}
