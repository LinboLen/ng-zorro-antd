import { Component } from '@angular/core';

import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'tri-demo-timeline-basic',
  imports: [TriTimelineModule],
  template: `
    <tri-timeline>
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>
  `
})
export class TriDemoTimelineBasicComponent {}
