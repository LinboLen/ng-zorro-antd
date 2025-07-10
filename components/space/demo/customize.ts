import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSliderModule } from 'ng-zorro-antd/slider';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriSpaceModule, TriSliderModule],
  template: `
    <tri-slider [(ngModel)]="size"></tri-slider>
    <tri-space [size]="size">
      <button *spaceItem tri-button type="primary">Button</button>
      <button *spaceItem tri-button type="default">Default</button>
      <button *spaceItem tri-button type="dashed">Dashed</button>
      <a *spaceItem tri-button type="link">Link</a>
    </tri-space>
  `
})
export class TriDemoSpaceCustomizeComponent {
  size = 8;
}
