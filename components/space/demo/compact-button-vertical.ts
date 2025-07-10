import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [TriSpaceModule, TriButtonModule],
  template: `
    <tri-space>
      <tri-space-compact *spaceItem direction="vertical">
        <button tri-button>Button 1</button>
        <button tri-button>Button 2</button>
        <button tri-button>Button 3</button>
      </tri-space-compact>
      <tri-space-compact *spaceItem direction="vertical">
        <button tri-button type="dashed">Button 1</button>
        <button tri-button type="dashed">Button 2</button>
        <button tri-button type="dashed">Button 3</button>
      </tri-space-compact>
      <tri-space-compact *spaceItem direction="vertical">
        <button tri-button type="primary">Button 1</button>
        <button tri-button type="primary">Button 2</button>
        <button tri-button type="primary">Button 3</button>
      </tri-space-compact>
    </tri-space>
  `
})
export class TriDemoSpaceCompactButtonVerticalComponent {}
