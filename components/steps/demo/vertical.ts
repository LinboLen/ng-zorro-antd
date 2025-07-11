import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-vertical',
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="1" direction="vertical">
      <tri-step title="Finished" description="This is a description."></tri-step>
      <tri-step title="In Progress" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsVerticalComponent {}
