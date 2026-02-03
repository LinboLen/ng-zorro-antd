import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-space-split',
  imports: [TriDividerModule, TriSpaceModule],
  template: `
    <tri-space [split]="spaceSplit">
      <ng-template #spaceSplit>
        <tri-divider type="vertical" />
      </ng-template>

      <a *spaceItem>Link</a>
      <a *spaceItem>Link</a>
      <a *spaceItem>Link</a>
    </tri-space>
  `
})
export class TriDemoSpaceSplitComponent {
  size = 8;
}
