import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'tri-demo-rate-customize',
  imports: [FormsModule, TriIconModule, TriRateModule],
  template: `
    <tri-rate [ngModel]="2" [character]="characterNumber" />
    <br />
    <tri-rate [ngModel]="3" [character]="characterIcon" />
    <br />
    <ng-template #characterNumber let-index>
      {{ index + 1 }}
    </ng-template>
    <ng-template #characterIcon let-index>
      @switch (index) {
        @case (0) {
          <tri-icon type="frown" />
        }
        @case (1) {
          <tri-icon type="frown" />
        }
        @case (2) {
          <tri-icon type="meh" />
        }
        @case (3) {
          <tri-icon type="smile" />
        }
        @case (4) {
          <tri-icon type="smile" />
        }
      }
    </ng-template>
  `,
  styles: `
    .large ::ng-deep .ant-rate-star {
      font-size: 36px;
    }
  `
})
export class TriDemoRateCustomizeComponent {}
