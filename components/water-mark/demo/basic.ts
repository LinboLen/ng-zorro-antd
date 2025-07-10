import { Component } from '@angular/core';

import { TriWaterMarkModule } from 'ng-zorro-antd/water-mark';

@Component({
  selector: '',
  imports: [TriWaterMarkModule],
  template: `
    <tri-water-mark content="NG Ant Design">
      <div style="height: 500px"></div>
    </tri-water-mark>
  `
})
export class TriDemoWaterMarkBasicComponent {}
