import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-line',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="30" />
    <tri-progress [percent]="50" status="active" />
    <tri-progress [percent]="70" status="exception" />
    <tri-progress [percent]="100" />
    <tri-progress [percent]="50" [showInfo]="false" />
  `
})
export class TriDemoProgressLineComponent {}
