import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'tri-demo-popover-arrow-point-at-center',
  imports: [TriButtonModule, TriPopoverModule, TriNoAnimationDirective],
  template: `
    <button tri-button popoverTitle="Title" popoverContent="Content" popoverPlacement="topLeft" tri-popover>
      Align edge / 边缘对齐
    </button>
    <button
      tri-button
      tri-popover
      popoverTitle="Title"
      popoverContent="Content"
      popoverPlacement="topLeft"
      [popoverArrowPointAtCenter]="true"
      noAnimation
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
export class TriDemoPopoverArrowPointAtCenterComponent {}
