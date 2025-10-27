import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-badge-colorful',
  imports: [TriBadgeModule, TriDividerModule],
  template: `
    <tri-divider orientation="left" text="Presets" />
    @for (color of presets; track color) {
      <div>
        <tri-badge [color]="color" [text]="color" />
      </div>
    }

    <tri-divider orientation="left" text="Custom" />
    @for (color of customColors; track color) {
      <div>
        <tri-badge [color]="color" [text]="color" />
      </div>
    }
  `
})
export class TriDemoBadgeColorfulComponent {
  readonly presets = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime'
  ];
  readonly customColors = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
}
