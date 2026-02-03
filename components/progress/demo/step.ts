import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-step',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="50" [steps]="3" strokeColor="#1890ff" />
    <tri-progress [percent]="30" [steps]="5" strokeColor="#1890ff" />
    <tri-progress [percent]="100" [steps]="5" strokeColor="#1890ff" size="small" />
  `
})
export class TriDemoProgressStepComponent {}
