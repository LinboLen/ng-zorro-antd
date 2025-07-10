import { Component } from '@angular/core';

import { presetColors } from 'ng-zorro-antd/core/color';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: '',
  imports: [TriTagModule],
  template: `
    <h4 style="margin-bottom: 16px">Presets:</h4>
    <div>
      @for (color of presetColors; track color) {
        <tri-tag [color]="color">{{ color }}</tri-tag>
      }
    </div>
    <h4 style="margin: 16px 0">Custom:</h4>
    <div>
      @for (color of customColors; track color) {
        <tri-tag [color]="color">{{ color }}</tri-tag>
      }
    </div>
  `,
  styles: [
    `
      .ant-tag {
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoTagColorfulComponent {
  readonly presetColors = presetColors;
  readonly customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
}
