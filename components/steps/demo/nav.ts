import { Component } from '@angular/core';

import { TriStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'tri-demo-steps-nav',
  imports: [TriStepsModule],
  template: `
    <tri-steps type="navigation" size="small" [current]="index" (indexChange)="onIndexChange($event)">
      <tri-step
        title="Step 1"
        subtitle="00:00:05"
        status="finish"
        description="This is a description."
      ></tri-step>
      <tri-step
        title="Step 2"
        subtitle="00:01:02"
        status="process"
        description="This is a description."
      ></tri-step>
      <tri-step
        title="Step 3"
        subtitle="waiting for long long time"
        status="wait"
        description="This is a description."
      ></tri-step>
    </tri-steps>
    <tri-steps type="navigation" [current]="index" (indexChange)="onIndexChange($event)">
      <tri-step title="Step 1" status="finish"></tri-step>
      <tri-step title="Step 2" status="process"></tri-step>
      <tri-step title="Step 3" status="wait"></tri-step>
      <tri-step title="Step 4" status="wait"></tri-step>
    </tri-steps>
    <tri-steps type="navigation" size="small" [current]="index" (indexChange)="onIndexChange($event)">
      <tri-step title="finish 1" status="finish"></tri-step>
      <tri-step title="finish 2" status="finish"></tri-step>
      <tri-step title="current process" status="process"></tri-step>
      <tri-step title="wait" status="wait" disabled></tri-step>
    </tri-steps>
  `,
  styles: [
    `
      nz-steps {
        margin-bottom: 60px;
        box-shadow: rgb(232, 232, 232) 0 -1px 0 0 inset;
      }
    `
  ]
})
export class TriDemoStepsNavComponent {
  index = 0;

  onIndexChange(event: number): void {
    this.index = event;
  }
}
