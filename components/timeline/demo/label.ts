import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTimelineMode, TriTimelineModule } from 'ng-zorro-antd/timeline';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule, TriTimelineModule],
  template: `
    <tri-radio-group [(ngModel)]="mode">
      <label tri-radio value="left">Left</label>
      <label tri-radio value="right">Right</label>
      <label tri-radio value="alternate">Alternative</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-timeline [mode]="mode">
      <tri-timeline-item label="2015-09-01">Create a services</tri-timeline-item>
      <tri-timeline-item label="2015-09-01 09:12:11">Solve initial network problems</tri-timeline-item>
      <tri-timeline-item>Technical testing</tri-timeline-item>
      <tri-timeline-item label="2015-09-01 09:12:11">Network problems being solved</tri-timeline-item>
    </tri-timeline>
  `
})
export class TriDemoTimelineLabelComponent {
  mode: TriTimelineMode = 'left';
}
