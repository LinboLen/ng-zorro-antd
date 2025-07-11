import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: 'tri-demo-timeline-pending',
  imports: [TriButtonModule, TriTimelineModule],
  template: `
    <tri-timeline pending="Recording..." [reverse]="reverse">
      <tri-timeline-item>Create a services site 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Solve initial network problems 2015-09-01</tri-timeline-item>
      <tri-timeline-item>Technical testing 2015-09-01</tri-timeline-item>
    </tri-timeline>
    <br />
    <br />
    <button tri-button type="primary" (click)="toggleReverse()">Toggle Reverse</button>
  `
})
export class TriDemoTimelinePendingComponent {
  reverse = false;

  toggleReverse(): void {
    this.reverse = !this.reverse;
  }
}
