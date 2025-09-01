import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-with-name',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options" (valueChange)="handleValueChange($event)" name="group" />`
})
export class TriDemoSegmentedWithNameComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  handleValueChange(e: string | number): void {
    console.log(e);
  }
}
