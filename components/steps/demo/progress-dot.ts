import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-progress-dot',
  imports: [TriDividerModule, TriStepsModule],
  template: `
    <tri-steps [current]="1" progressDot>
      <tri-step title="Finished" description="This is a description." />
      <tri-step title="In Progress" description="This is a description." />
      <tri-step title="Waiting" description="This is a description." />
    </tri-steps>
    <tri-divider />
    <tri-steps [current]="1" progressDot direction="vertical">
      <tri-step title="Finished" description="This is a description. This is a description." />
      <tri-step title="Finished" description="This is a description. This is a description." />
      <tri-step title="In Progress" description="This is a description. This is a description." />
      <tri-step title="Waiting" description="This is a description." />
      <tri-step title="Waiting" description="This is a description." />
    </tri-steps>
  `
})
export class TriDemoStepsProgressDotComponent {}
