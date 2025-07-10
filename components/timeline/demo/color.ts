import { Component } from '@angular/core';

import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: '',
  imports: [TriTimelineModule],
  template: `
    <tri-timeline>
      <tri-timeline-item color="green">Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item color="green">Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item color="red">
        <p>Solve initial network problems 1</p>
        <p>Solve initial network problems 2</p>
        <p>Solve initial network problems 3 2015-09-01</p>
      </tri-timeline-item>
      <tri-timeline-item>
        <p>Technical testing 1</p>
        <p>Technical testing 2</p>
        <p>Technical testing 3 2015-09-01</p>
      </tri-timeline-item>
      <tri-timeline-item color="gray">
        <p>Technical testing 1</p>
        <p>Technical testing 2</p>
        <p>Technical testing 3 2015-09-01</p>
      </tri-timeline-item>
      <tri-timeline-item color="gray">
        <p>Technical testing 1</p>
        <p>Technical testing 2</p>
        <p>Technical testing 3 2015-09-01</p>
      </tri-timeline-item>
    </tri-timeline>
  `
})
export class TriDemoTimelineColorComponent {}
