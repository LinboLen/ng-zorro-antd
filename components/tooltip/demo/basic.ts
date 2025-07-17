import { Component } from '@angular/core';

import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-tooltip-basic',
  imports: [TriTooltipModule],
  template: `<span tri-tooltip tooltipTitle="prompt text">Tooltip will show when mouse enter.</span>`
})
export class TriDemoTooltipBasicComponent {}
