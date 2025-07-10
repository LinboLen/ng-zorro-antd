import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: '',
  imports: [TriDividerModule, TriStepsModule],
  template: `
    <tri-steps [current]="1" progressDot>
      <tri-step title="Finished" description="This is a description."></tri-step>
      <tri-step title="In Progress" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
    <tri-divider></tri-divider>
    <tri-steps [current]="1" progressDot direction="vertical">
      <tri-step title="Finished" description="This is a description. This is a description."></tri-step>
      <tri-step title="Finished" description="This is a description. This is a description."></tri-step>
      <tri-step title="In Progress" description="This is a description. This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsProgressDotComponent {}
