import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { presetColors } from 'ng-zorro-antd/core/color';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-color',
  imports: [TriButtonModule, TriDividerModule, TriTooltipModule],
  template: `
    <tri-divider text="Preset" orientation="left"></tri-divider>
    @for (color of presetColors; track color) {
      <button tri-button tri-tooltip [tooltipTitle]="color" [tooltipColor]="color">
        {{ color }}
      </button>
    }
    <tri-divider text="Custom" orientation="left"></tri-divider>
    @for (color of customColors; track color) {
      <button tri-button tri-tooltip [tooltipTitle]="color" [tooltipColor]="color">
        {{ color }}
      </button>
    }
  `,
  styles: [
    `
      .ant-btn {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoTooltipColorComponent {
  customColors: string[] = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
  presetColors = presetColors;
}
