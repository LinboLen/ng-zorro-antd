import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-icon',
  imports: [TriIconModule, TriStepsModule],
  template: `
    <tri-steps>
      <tri-step title="Login" status="finish" icon="user"></tri-step>
      <tri-step title="Verification" status="finish" icon="solution"></tri-step>
      <tri-step title="Pay" status="process" icon="loading"></tri-step>
      <tri-step title="Done" status="wait" [icon]="iconTemplate"></tri-step>
      <ng-template #iconTemplate><tri-icon type="smile" /></ng-template>
    </tri-steps>
  `
})
export class TriDemoStepsIconComponent {}
