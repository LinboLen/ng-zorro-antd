import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: '',
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="1">
      <tri-step title="Finished" description="This is a description."></tri-step>
      <tri-step title="In Progress" subtitle="Left 00:00:08" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsSimpleComponent {}
