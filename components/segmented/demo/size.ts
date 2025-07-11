import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-size',
  imports: [TriSegmentedModule],
  template: `
    <tri-segmented [options]="options" size="small"></tri-segmented>
    <br />
    <tri-segmented [options]="options"></tri-segmented>
    <br />
    <tri-segmented [options]="options" size="large"></tri-segmented>
  `,
  styles: [
    `
      .ant-segmented {
        margin-bottom: 10px;
      }
    `
  ]
})
export class TriDemoSegmentedSizeComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
}
