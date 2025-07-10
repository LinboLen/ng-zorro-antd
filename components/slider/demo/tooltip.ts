import { Component } from '@angular/core';

import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: '',
  imports: [TriSliderModule],
  template: `
    <tri-slider tooltipVisible="always"></tri-slider>
    <tri-slider tooltipVisible="never"></tri-slider>
  `
})
export class TriDemoSliderTooltipComponent {}
