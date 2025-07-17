import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-space-wrap',
  imports: [TriButtonModule, TriSpaceModule],
  template: `
    <tri-space [size]="[8, 16]" wrap>
      @for (item of items; track $index) {
        <button *spaceItem tri-button>Button</button>
      }
    </tri-space>
  `
})
export class TriDemoSpaceWrapComponent {
  items = new Array(20).fill(null);
}
