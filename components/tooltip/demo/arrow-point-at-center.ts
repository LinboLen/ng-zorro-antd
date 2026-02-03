import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-arrow-point-at-center',
  imports: [TriButtonModule, TriTooltipModule],
  template: `
    <button tri-button tooltipTitle="prompt text" tooltipPlacement="topLeft" tri-tooltip>
      Align edge / 边缘对齐
    </button>
    <button
      tri-button
      tri-tooltip
      tooltipTitle="prompt text"
      tooltipPlacement="bottomLeft"
      [tooltipArrowPointAtCenter]="true"
    >
      Arrow points to center / 箭头指向中心
    </button>
  `,
  styles: `
    button {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  `
})
export class TriDemoTooltipArrowPointAtCenterComponent {}
