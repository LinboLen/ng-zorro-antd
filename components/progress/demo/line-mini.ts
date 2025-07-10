import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: '',
  imports: [TriProgressModule],
  template: `
    <div style="width: 170px;">
      <tri-progress [percent]="30" size="small"></tri-progress>
      <tri-progress [percent]="50" size="small" status="active"></tri-progress>
      <tri-progress [percent]="70" size="small" status="exception"></tri-progress>
      <tri-progress [percent]="100" size="small"></tri-progress>
      <tri-progress [percent]="50" size="small" [showInfo]="false"></tri-progress>
    </div>
  `
})
export class TriDemoProgressLineMiniComponent {}
