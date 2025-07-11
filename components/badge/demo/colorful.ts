import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'tri-demo-badge-colorful',
  imports: [TriBadgeModule],
  template: `
    <h4>Presets:</h4>
    @for (color of presets; track color) {
      <div>
        <tri-badge [color]="color" [text]="color"></tri-badge>
      </div>
    }
    <br />
    <h4>Custom:</h4>
    @for (color of customColors; track color) {
      <div>
        <tri-badge [color]="color" [text]="color"></tri-badge>
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
