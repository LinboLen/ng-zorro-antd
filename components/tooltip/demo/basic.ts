import { Component } from '@angular/core';

import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: '',
  imports: [TriToolTipModule],
  template: `<span tri-tooltip tooltipTitle="prompt text">Tooltip will show when mouse enter.</span>`
})
export class TriDemoTooltipBasicComponent {}
