import { Component } from '@angular/core';

import { TriAnchorModule } from 'ng-zorro-antd/anchor';

@Component({
  selector: '',
  imports: [TriAnchorModule],
  template: `
    <tri-anchor (click)="handleClick($event)">
      <tri-link href="#components-anchor-demo-basic" title="Basic demo"></tri-link>
      <tri-link href="#components-anchor-demo-static" title="Static demo"></tri-link>
      <tri-link href="#api" title="API">
        <tri-link href="#nz-anchor" title="nz-anchor"></tri-link>
        <tri-link href="#nz-link" title="nz-link"></tri-link>
      </tri-link>
    </tri-anchor>
  `
})
export class TriDemoAnchorOnClickComponent {
  handleClick(e: string): void {
    console.log(e);
  }
}
