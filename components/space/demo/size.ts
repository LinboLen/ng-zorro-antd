import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSpaceModule, TriSpaceSize } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-space-size',
  imports: [FormsModule, TriButtonModule, TriRadioModule, TriSpaceModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio value="small">Small</label>
      <label tri-radio value="middle">Middle</label>
      <label tri-radio value="large">Large</label>
    </tri-radio-group>
    <tri-space [size]="size">
      <button *spaceItem tri-button type="primary">Button</button>
      <button *spaceItem tri-button type="default">Default</button>
      <button *spaceItem tri-button type="dashed">Dashed</button>
      <a *spaceItem tri-button type="link">Link</a>
    </tri-space>
  `
})
export class TriDemoSpaceSizeComponent {
  size: TriSpaceSize = 'small';
}
