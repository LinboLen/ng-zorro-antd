import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: '',
  imports: [TriIconModule, TriTimelineModule],
  template: `
    <tri-timeline mode="alternate">
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item color="green">Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item [dot]="dotTemplate">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </tri-timeline-item>
      <tri-timeline-item color="red">Network problems being solved 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item [dot]="dotTemplate">Technical testing 2015-09-01</tri-timeline-item>
    </tri-timeline>
    <ng-template #dotTemplate>
      <tri-icon type="clock-circle-o" style="font-size: 16px;" />
    </ng-template>
  `
})
export class TriDemoTimelineAlternateComponent {}
