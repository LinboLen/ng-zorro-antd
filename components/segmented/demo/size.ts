import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-size',
  imports: [TriSegmentedModule],
  template: `
    <tri-segmented [options]="options" size="small" />
    <br />
    <tri-segmented [options]="options" />
    <br />
    <tri-segmented [options]="options" size="large" />
  `,
  styles: `
    .ant-segmented {
      margin-bottom: 10px;
    }
  `
})
export class TriDemoSegmentedSizeComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
}
