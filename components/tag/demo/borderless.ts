import { Component } from '@angular/core';

import { presetColors } from 'ng-zorro-antd/core/color';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-tag-borderless',
  imports: [TriTagModule],
  template: `
    @for (color of tagColors; track color) {
      <tri-tag [color]="color" [bordered]="false">{{ color }}</tri-tag>
    }
  `
})
export class TriDemoTagBorderlessComponent {
  readonly tagColors = presetColors;
}
