import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-size',
  imports: [TriCronExpressionModule],
  template: `
    <div class="example-cron-expression">
      <tri-cron-expression size="small"></tri-cron-expression>
      <tri-cron-expression size="default"></tri-cron-expression>
      <tri-cron-expression size="large"></tri-cron-expression>
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
export class TriDemoCronExpressionSizeComponent {}
