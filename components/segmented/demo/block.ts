import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-block',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options" [block]="true"></tri-segmented>`
})
export class TriDemoSegmentedBlockComponent {
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
}
