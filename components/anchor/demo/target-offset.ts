import { afterNextRender, Component, signal } from '@angular/core';

import { TriAnchorModule } from 'ng-zorro-antd/anchor';

@Component({
  selector: 'tri-demo-anchor-target-offset',
  imports: [TriAnchorModule],
  template: `
    <tri-anchor [targetOffset]="targetOffset()">
      <tri-link href="#components-anchor-demo-basic" title="Basic demo" />
      <tri-link href="#components-anchor-demo-static" title="Static demo" />
      <tri-link href="#api" title="API">
        <tri-link href="#nz-anchor" title="nz-anchor" />
        <tri-link href="#nz-link" title="nz-link" />
      </tri-link>
    </tri-anchor>
  `
})
export class TriDemoAnchorTargetOffsetComponent {
  readonly targetOffset = signal(0);

  constructor() {
    afterNextRender(() => {
      this.targetOffset.set(window.innerHeight / 2);
    });
  }
}
