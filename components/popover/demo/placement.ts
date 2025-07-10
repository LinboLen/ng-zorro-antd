import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: '',
  imports: [TriButtonModule, TriPopoverModule],
  template: `
    <div style="margin-left: 60px">
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="topLeft"
      >
        TL
      </button>
      <button tri-button tri-popover popoverTitle="Title" [popoverContent]="contentTemplate" popoverPlacement="top">
        Top
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="topRight"
      >
        TR
      </button>
    </div>
    <div style="width: 60px; float: left;">
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="leftTop"
      >
        LT
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="left"
      >
        Left
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="leftBottom"
      >
        LB
      </button>
    </div>
    <div style="width: 60px; margin-left: 252px;">
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="rightTop"
      >
        RT
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="right"
      >
        Right
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="rightBottom"
      >
        RB
      </button>
    </div>
    <div style="margin-left: 60px; clear: both;">
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="bottomLeft"
      >
        BL
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="bottom"
      >
        Bottom
      </button>
      <button
        tri-button
        tri-popover
        popoverTitle="Title"
        [popoverContent]="contentTemplate"
        popoverPlacement="bottomRight"
      >
        BR
      </button>
    </div>
    <ng-template #contentTemplate>
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
        margin-bottom: 8px;
        width: 70px;
        text-align: center;
        padding: 0;
      }
    `
  ]
})
export class TriDemoPopoverPlacementComponent {}
