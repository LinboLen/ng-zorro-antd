import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-basic',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options" (valueChange)="handleValueChange($event)" />`
})
export class TriDemoSegmentedBasicComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  handleValueChange(e: string | number): void {
    console.log(e);
  }
}
