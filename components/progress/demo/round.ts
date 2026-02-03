import { Component } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'tri-demo-progress-round',
  imports: [TriProgressModule],
  template: `
    <tri-progress strokeLinecap="round" percent="75" />
    <tri-progress strokeLinecap="round" type="circle" percent="75" />
    <tri-progress strokeLinecap="square" type="dashboard" percent="75" />
  `
})
export class TriDemoProgressRoundComponent {}
