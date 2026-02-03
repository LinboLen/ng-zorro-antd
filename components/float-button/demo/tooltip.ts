import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriTooltipDirective } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-float-button-tooltip',
  imports: [TriFloatButtonModule, TriTooltipDirective],
  template: `
    <div class="tooltip">
      <tri-float-button
        style="bottom: 108px"
        tri-tooltip
        tooltipTitle="Documents"
        tooltipPlacement="top"
        tooltipColor="blue"
      />
      <tri-float-button tri-tooltip [tooltipTitle]="titleTemplate" />
      <ng-template #titleTemplate>
        <div>Documents</div>
      </ng-template>
    </div>
  `,
  styles: `
    .tooltip {
      height: 300px;
      position: relative;
    }
    nz-float-button {
      position: absolute;
    }
  `
})
export class TriDemoFloatButtonTooltipComponent {}
