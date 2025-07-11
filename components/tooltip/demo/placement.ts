import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-placement',
  imports: [TriButtonModule, TriToolTipModule],
  template: `
    <div style="margin-left:60px;">
      <button tooltipTitle="prompt text" [tooltipPlacement]="['topLeft', 'leftTop']" tri-button tri-tooltip>
        TL
      </button>
      <button tooltipTitle="prompt text" tooltipPlacement="top" tri-button tri-tooltip>Top</button>
      <button tooltipTitle="prompt text" tooltipPlacement="topRight" tri-button tri-tooltip>TR</button>
    </div>
    <div style="float:left;width: 60px;">
      <button tooltipTitle="prompt text" tooltipPlacement="leftTop" tri-button tri-tooltip>LT</button>
      <button tooltipTitle="prompt text" tooltipPlacement="left" tri-button tri-tooltip>Left</button>
      <button tooltipTitle="prompt text" tooltipPlacement="leftBottom" tri-button tri-tooltip>LB</button>
    </div>
    <div style="margin-left:270px;width: 60px;">
      <button tooltipTitle="prompt text" tooltipPlacement="rightTop" tri-button tri-tooltip>RT</button>
      <button tooltipTitle="prompt text" tooltipPlacement="right" tri-button tri-tooltip>Right</button>
      <button tooltipTitle="prompt text" tooltipPlacement="rightBottom" tri-button tri-tooltip>RB</button>
    </div>
    <div style="margin-left:60px;clear: both;">
      <button tooltipTitle="prompt text" tooltipPlacement="bottomLeft" tri-button tri-tooltip>BL</button>
      <button tooltipTitle="prompt text" tooltipPlacement="bottom" tri-button tri-tooltip>Bottom</button>
      <button tooltipTitle="prompt text" tooltipPlacement="bottomRight" tri-button tri-tooltip>BR</button>
    </div>
  `,
  styles: [
    `
      button {
        width: 70px;
        text-align: center;
        padding: 0;
        margin-right: 8px;
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoTooltipPlacementComponent {}
