import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-disabled',
  imports: [TriSegmentedModule],
  template: `
    <tri-segmented [options]="['Map', 'Transit', 'Satellite']" disabled />
    <br />
    <tri-segmented [options]="options" />
  `,
  styles: `
    .ant-segmented {
      margin-bottom: 10px;
    }
  `
})
export class TriDemoSegmentedDisabledComponent {
  options = [
    'Daily',
    { label: 'Weekly', value: 'Weekly', disabled: true },
    'Monthly',
    { label: 'Quarterly', value: 'Quarterly', disabled: true },
    'Yearly'
  ];
}
