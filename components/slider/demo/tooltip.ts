import { Component } from '@angular/core';

import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-tooltip',
  imports: [TriSliderModule],
  template: `
    <tri-slider tooltipVisible="always" />
    <tri-slider tooltipVisible="never" />
  `
})
export class TriDemoSliderTooltipComponent {}
