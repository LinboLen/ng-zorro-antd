import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options" (valueChange)="handleValueChange($event)"></tri-segmented>`
})
export class TriDemoSegmentedBasicComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  handleValueChange(e: string | number): void {
    console.log(e);
  }
}
