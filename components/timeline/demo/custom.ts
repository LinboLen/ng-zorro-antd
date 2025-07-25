import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'tri-demo-timeline-custom',
  imports: [TriIconModule, TriTimelineModule],
  template: `
    <tri-timeline>
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item color="red" [dot]="dotTemplate">Technical testing 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Network problems being solved 2015-09-01</tri-timeline-item>
    </tri-timeline>
    <ng-template #dotTemplate>
      <tri-icon type="clock-circle-o" style="font-size: 16px;" />
    </ng-template>
  `
})
export class TriDemoTimelineCustomComponent {}
