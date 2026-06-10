import { Component } from '@angular/core';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-search',
  imports: [TriSelectModule],
  template: `<tri-select [options]="options" showSearch allowClear placeHolder="Select a person" /> `,
  styles: `
    nz-select {
      width: 120px;
    }
  `
})
export class TriDemoSelectSearchComponent {
  readonly options = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
    { label: 'Tom', value: 'tom' }
  ];
}
