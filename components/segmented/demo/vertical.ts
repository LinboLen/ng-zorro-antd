import { Component } from '@angular/core';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: 'tri-demo-segmented-vertical',
  imports: [TriSegmentedModule],
  template: `<tri-segmented [options]="options" vertical />`
})
export class TriDemoSegmentedVerticalComponent {
  options = [
    { value: 'List', icon: 'bars' },
    { value: 'Kanban', icon: 'appstore' }
  ];
}
