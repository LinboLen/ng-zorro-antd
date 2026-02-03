import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-template',
  imports: [TriIconModule, TriTooltipModule],
  template: `
    <a tri-tooltip [tooltipTitle]="titleTemplate" [tooltipTitleContext]="{ $implicit: 'Icon' }"
      >This Tooltip has an Icon</a
    >
    <ng-template #titleTemplate let-thing>
      <tri-icon type="file" />
      <span>Tooltip With {{ thing }}</span>
    </ng-template>
  `,
  styles: `
    .anticon {
      margin-right: 8px;
      margin-left: 8px;
    }
  `
})
export class TriDemoTooltipTemplateComponent {}
