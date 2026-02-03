import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-collapse',
  imports: [TriCronExpressionModule],
  template: `<tri-cron-expression [collapseDisable]="true" />`
})
export class TriDemoCronExpressionCollapseComponent {}
