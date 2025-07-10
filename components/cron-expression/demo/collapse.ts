import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: '',
  imports: [TriCronExpressionModule],
  template: `<tri-cron-expression [collapseDisable]="true"></tri-cron-expression>`
})
export class TriDemoCronExpressionCollapseComponent {}
