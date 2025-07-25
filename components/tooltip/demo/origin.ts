import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriElementPatchDirective } from 'ng-zorro-antd/core/element-patch';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-origin',
  imports: [TriButtonModule, TriTooltipModule, TriElementPatchDirective],
  template: `
    <button tri-button tri-element #button="nzElement">Action</button>
    <a tri-tooltip tooltipTitle="This action could not be revoked!" [tooltipOrigin]="button.elementRef">Notice</a>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoTooltipOriginComponent {}
