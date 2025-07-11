import { Component } from '@angular/core';

import { TriSegmentedModule, TriSegmentedOptions } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-with-icon-only',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options"></tri-segmented>`
})
export class TriDemoSegmentedWithIconOnlyComponent {
  options: TriSegmentedOptions = [
    { value: 'List', icon: 'bars' },
    { value: 'Kanban', icon: 'appstore' }
  ];
}
