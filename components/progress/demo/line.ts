import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: '',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="30"></tri-progress>
    <tri-progress [percent]="50" status="active"></tri-progress>
    <tri-progress [percent]="70" status="exception"></tri-progress>
    <tri-progress [percent]="100"></tri-progress>
    <tri-progress [percent]="50" [showInfo]="false"></tri-progress>
  `
})
export class TriDemoProgressLineComponent {}
