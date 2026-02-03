import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-clear',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate [(ngModel)]="value" allowHalf />
    <span class="tri-rate-text">allowClear: true</span>
    <br />
    <tri-rate [(ngModel)]="value" allowHalf [allowClear]="false" />
    <span class="tri-rate-text">allowClear: false</span>
  `
})
export class TriDemoRateClearComponent {
  value = 0;
}
