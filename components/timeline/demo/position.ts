import { Component } from '@angular/core';

import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: '',
  imports: [TriTimelineModule],
  template: `
    <tri-timeline mode="custom">
      <tri-timeline-item position="left" [dot]="soccerTemplate">Alice 20'</tri-timeline-item>
      <tri-timeline-item position="left" [dot]="soccerTemplate">Susan 28'</tri-timeline-item>
      <tri-timeline-item position="right" color="red" [dot]="soccerTemplate">Tim 45'</tri-timeline-item>
      <tri-timeline-item position="left" [dot]="soccerTemplate">Bob 79'</tri-timeline-item>
    </tri-timeline>
    <ng-template #soccerTemplate>⚽</ng-template>
  `
})
export class TriDemoTimelinePositionComponent {}
