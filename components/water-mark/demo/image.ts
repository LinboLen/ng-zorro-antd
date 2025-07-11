import { Component } from '@angular/core';

import { TriWaterMarkModule } from 'ng-zorro-antd/water-mark';

@Component({
  selector: 'tri-demo-water-mark-image',
  imports: [TriWaterMarkModule],
  template: `
    <tri-water-mark
      [width]="212"
      [height]="32"
      image="https://img.alicdn.com/imgextra/i3/O1CN01UR3Zkq1va9fnZsZcr_!!6000000006188-55-tps-424-64.svg"
    >
      <div style="height: 500px"></div>
    </tri-water-mark>
  `
})
export class TriDemoWaterMarkImageComponent {}
