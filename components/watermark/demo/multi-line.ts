import { Component } from '@angular/core';

import { TriWatermarkModule } from 'ng-zorro-antd/watermark';

@Component({
  selector: 'tri-demo-watermark-multi-line',
  imports: [TriWatermarkModule],
  template: `
    <tri-watermark [content]="['Angular', 'NG Ant Design']">
      <div style="height: 500px"></div>
    </tri-watermark>
  `
})
export class TriDemoWatermarkMultiLineComponent {}
