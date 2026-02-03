import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-line-mini',
  imports: [TriProgressModule],
  template: `
    <div style="width: 170px;">
      <tri-progress [percent]="30" size="small" />
      <tri-progress [percent]="50" size="small" status="active" />
      <tri-progress [percent]="70" size="small" status="exception" />
      <tri-progress [percent]="100" size="small" />
      <tri-progress [percent]="50" size="small" [showInfo]="false" />
    </div>
  `
})
export class TriDemoProgressLineMiniComponent {}
