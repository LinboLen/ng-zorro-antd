import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-start-index',
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="current" [startIndex]="3" size="small">
      <tri-step title="Finished"></tri-step>
      <tri-step title="In Progress"></tri-step>
      <tri-step title="Waiting"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsStartIndexComponent {
  current = 3;
}
