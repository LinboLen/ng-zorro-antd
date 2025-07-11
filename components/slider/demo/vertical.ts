import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-vertical',
  imports: [FormsModule, TriSliderModule],
  template: `
    <div [style]="{ height: '300px' }">
      <div [style]="style">
        <tri-slider vertical [ngModel]="30"></tri-slider>
      </div>
      <div [style]="style">
        <tri-slider vertical range [step]="10" [ngModel]="[20, 50]"></tri-slider>
      </div>
      <div [style]="style">
        <tri-slider vertical range [marks]="marks" [ngModel]="[26, 37]"></tri-slider>
      </div>
    </div>
  `
})
export class TriDemoSliderVerticalComponent {
  style = {
    float: 'left',
    height: '300px',
    marginLeft: '70px'
  };

  marks = {
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
