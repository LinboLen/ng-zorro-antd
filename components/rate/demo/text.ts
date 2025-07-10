import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: '',
  imports: [FormsModule, TriRateModule],
  template: `
    <tri-rate [(ngModel)]="value" [tooltips]="tooltips"></tri-rate>
    @if (value) {
      <span class="tri-rate-text">{{ value ? tooltips[value - 1] : '' }}</span>
    }
  `
})
export class TriDemoRateTextComponent {
  readonly tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 3;
}
