import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-status',
  imports: [TriCronExpressionModule],
  template: `
    <div class="example-cron-expression">
      <tri-cron-expression status="error" />
      <tri-cron-expression status="warning" />
    </div>
  `,
  styles: `
    .example-cron-expression nz-cron-expression {
      display: block;
      margin-bottom: 8px;
    }
  `
})
export class TriDemoCronExpressionStatusComponent {}
