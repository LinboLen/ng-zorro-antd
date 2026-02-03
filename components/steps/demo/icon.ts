import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-icon',
  imports: [TriIconModule, TriStepsModule],
  template: `
    <tri-steps>
      <tri-step title="Login" status="finish" icon="user" />
      <tri-step title="Verification" status="finish" icon="solution" />
      <tri-step title="Pay" status="process" icon="loading" />
      <tri-step title="Done" status="wait" [icon]="iconTemplate" />
      <ng-template #iconTemplate><tri-icon type="smile" /></ng-template>
    </tri-steps>
  `
})
export class TriDemoStepsIconComponent {}
