import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-clickable',
  imports: [TriDividerModule, TriStepsModule],
  template: `
    <tri-steps [current]="index" (indexChange)="onIndexChange($event)">
      <tri-step title="Finished" [disabled]="disable" description="This is a description."></tri-step>
      <tri-step title="In Progress" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
    <tri-divider></tri-divider>
    <tri-steps direction="vertical" [current]="index" (indexChange)="onIndexChange($event)">
      <tri-step title="Finished" description="This is a description."></tri-step>
      <tri-step title="In Progress" description="This is a description."></tri-step>
      <tri-step title="Waiting" description="This is a description."></tri-step>
    </tri-steps>
  `
})
export class TriDemoStepsClickableComponent {
  index = 0;
  disable = false;
  onIndexChange(index: number): void {
    this.index = index;
  }
}
