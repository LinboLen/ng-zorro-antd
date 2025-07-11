import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'tri-demo-slider-input-number',
  imports: [FormsModule, TriGridModule, TriInputNumberModule, TriSliderModule],
  template: `
    <tri-row gutter="8">
      <tri-col span="12">
        <tri-slider [min]="1" [max]="20" [(ngModel)]="value1"></tri-slider>
      </tri-col>
      <div tri-col span="4">
        <tri-input-number [min]="1" [max]="20" [(ngModel)]="value1"></tri-input-number>
      </div>
    </tri-row>

    <tri-row gutter="8">
      <tri-col span="12">
        <tri-slider [min]="0" [max]="1" [step]="0.01" [(ngModel)]="value2"></tri-slider>
      </tri-col>
      <tri-col span="4">
        <tri-input-number [min]="0" [max]="1" [step]="0.01" [(ngModel)]="value2"></tri-input-number>
      </tri-col>
    </tri-row>
  `
})
export class TriDemoSliderInputNumberComponent {
  value1 = 1;
  value2 = 0;
}
