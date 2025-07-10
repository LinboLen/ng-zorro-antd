import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: '',
  imports: [TriStepsModule],
  template: `
    <tri-steps [current]="current" size="small">
      <tri-step title="Finished"></tri-step>
      <tri-step title="In Progress"></tri-step>
      <tri-step title="Waiting"></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsSmallSizeComponent {
  current = 1;
}
