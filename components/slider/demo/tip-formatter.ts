import { Component } from '@angular/core';

import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-tip-formatter',
  imports: [TriSliderModule],
  template: `
    <tri-slider [tipFormatter]="formatter"></tri-slider>
    <tri-slider [tipFormatter]="null"></tri-slider>
    <tri-slider [tipFormatter]="titleTemplate"></tri-slider>
    <ng-template #titleTemplate let-value>
      <span>Slider value: {{ value }}</span>
    </ng-template>
  `
})
export class TriDemoSliderTipFormatterComponent {
  formatter(value: number): string {
    return `${value}%`;
  }
}
