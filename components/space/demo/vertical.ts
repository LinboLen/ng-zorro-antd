import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [TriCardModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical">
      <tri-card *spaceItem title="Card" style="width: 300px">
        <p>Card content</p>
        <p>Card content</p>
      </tri-card>
      <tri-card *spaceItem title="Card" style="width: 300px">
        <p>Card content</p>
        <p>Card content</p>
      </tri-card>
    </tri-space>
  `
})
export class TriDemoSpaceVerticalComponent {}
