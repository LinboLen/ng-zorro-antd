import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-small-size',
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="current" size="small">
      <tri-step title="Finished" />
      <tri-step title="In Progress" />
      <tri-step title="Waiting" />
    </tri-steps>
  `
})
export class TriDemoStepsSmallSizeComponent {
  current = 1;
}
