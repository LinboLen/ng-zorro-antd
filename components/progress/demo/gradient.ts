import { Component, ViewEncapsulation } from '@angular/core';

import { TriProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: '',
  imports: [TriProgressModule],
  template: `
    <tri-progress [percent]="99.9" [strokeColor]="{ '0%': '#108ee9', '100%': '#87d068' }"></tri-progress>
    <tri-progress
      [percent]="99.9"
      [strokeColor]="{ '0%': '#108ee9', '100%': '#87d068' }"
      status="active"
    ></tri-progress>
    <tri-progress
      type="circle"
      [percent]="90"
      [strokeColor]="{ '0%': '#108ee9', '50%': '#2db7f5', '100%': '#87d068' }"
    ></tri-progress>
    <tri-progress
      type="dashboard"
      [percent]="100"
      [strokeColor]="{ '0%': '#108ee9', '100%': '#87d068' }"
    ></tri-progress>
  `,
  styles: [
    `
      .ant-progress {
        margin-right: 8px;
        margin-bottom: 8px;
        display: inline-block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class TriDemoProgressGradientComponent {}
