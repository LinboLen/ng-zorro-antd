import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-text',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate [(ngModel)]="value" [tooltips]="tooltips" />
    @if (value(); as rate) {
      <span class="tri-rate-text">{{ rate ? tooltips[rate - 1] : '' }}</span>
    }
  `
})
export class TriDemoRateTextComponent {
  readonly tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  readonly value = signal(3);
}
