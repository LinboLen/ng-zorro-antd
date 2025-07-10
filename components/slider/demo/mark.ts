import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMarks, TriSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: '',
  imports: [FormsModule, TriButtonModule, TriSliderModule],
  template: `
    <h4>included=true</h4>
    <tri-slider [marks]="marks" [ngModel]="37"></tri-slider>
    <tri-slider [marks]="marks" included range [ngModel]="[26, 37]"></tri-slider>
    <h4>included=false</h4>
    <tri-slider [marks]="marks" [included]="false" [ngModel]="37"></tri-slider>
    <h4>marks & step</h4>
    <tri-slider [marks]="marks" [step]="10" [ngModel]="37"></tri-slider>
    <h4>step=null || dots=true</h4>
    <tri-slider [marks]="marks" [step]="null" [ngModel]="37"></tri-slider>
    <tri-slider [marks]="marks" dots [ngModel]="37"></tri-slider>
    Change nzMarks dynamically:
    <button tri-button (click)="changeMarks()">Change nzMarks</button>
  `,
  styles: [
    `
      h4 {
        margin: 0 0 16px;
      }

      .ant-slider-with-marks {
        margin-bottom: 44px;
      }
    `
  ]
})
export class TriDemoSliderMarkComponent {
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

  changeMarks(): void {
    this.marks = {
      20: '20%',
      99: '99%'
    };
  }
}
