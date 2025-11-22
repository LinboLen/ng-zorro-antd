import { Component } from '@angular/core';

import { TriWatermarkModule } from 'ng-zorro-antd/watermark';

@Component({
  selector: 'tri-demo-watermark-basic',
  imports: [TriWatermarkModule],
  template: `
    <tri-watermark content="NG Ant Design">
      <div style="height: 500px"></div>
    </tri-watermark>
  `
})
export class TriDemoWatermarkBasicComponent {}
