import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-borderless',
  imports: [TriCronExpressionModule],
  template: `<tri-cron-expression borderless></tri-cron-expression>`
})
export class TriDemoCronExpressionBorderlessComponent {}
