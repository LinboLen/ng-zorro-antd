import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-variant',
  imports: [TriInputModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <input *spaceItem tri-input placeholder="outlined" variant="outlined" />
      <input *spaceItem tri-input placeholder="filled" variant="filled" />
      <input *spaceItem tri-input placeholder="borderless" variant="borderless" />
      <input *spaceItem tri-input placeholder="underlined" variant="underlined" />
    </tri-space>
  `
})
export class TriDemoInputVariantComponent {}
