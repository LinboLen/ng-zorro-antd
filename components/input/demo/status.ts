import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-status',
  imports: [TriIconModule, TriInputModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <input *spaceItem tri-input placeholder="Error" status="error" />
      <input *spaceItem tri-input placeholder="Warning" status="warning" />
      <tri-input-wrapper *spaceItem>
        <tri-icon inputPrefix type="clock-circle" />
        <input type="text" tri-input placeholder="Error with prefix" status="error" />
      </tri-input-wrapper>
      <tri-input-wrapper *spaceItem>
        <tri-icon inputPrefix type="clock-circle" />
        <input type="text" tri-input placeholder="Warning with prefix" status="warning" />
      </tri-input-wrapper>
    </tri-space>
  `
})
export class TriDemoInputStatusComponent {}
