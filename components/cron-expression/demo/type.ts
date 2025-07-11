import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-type',
  imports: [TriCronExpressionModule],
  template: `
    <div class="example-cron-expression">
      <tri-cron-expression type="linux"></tri-cron-expression>
      <tri-cron-expression type="spring"></tri-cron-expression>
    </div>
  `,
  styles: [
    `
      .example-cron-expression nz-cron-expression {
        margin: 0 8px 8px 0;
      }
    `
  ]
})
export class TriDemoCronExpressionTypeComponent {}
