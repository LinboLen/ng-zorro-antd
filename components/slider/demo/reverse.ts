import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriMarks, TriSliderModule } from 'ng-zorro-antd/slider';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-slider-reverse',
  imports: [FormsModule, TriSliderModule, TriSwitchModule],
  template: `
    <tri-slider [ngModel]="30" [reverse]="reverse" />
    <tri-slider range [ngModel]="[20, 50]" [reverse]="reverse" />
    <tri-slider [marks]="marks" [ngModel]="30" [reverse]="reverse" />
    Reversed:
    <tri-switch size="small" [(ngModel)]="reverse" />
  `,
  styles: `
    .ant-slider-with-marks {
      margin-bottom: 44px;
    }
  `
})
export class TriDemoSliderReverseComponent {
  reverse = true;

  marks: TriMarks = {
    0: '0°C',
    26: '26°C',
    37: '37°C',
    100: {
      style: {
        color: '#f50'
      },
      label: '<strong>100°C</strong>'
    }
  };
}
