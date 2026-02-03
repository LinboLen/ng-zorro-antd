import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-basic',
  imports: [TriCronExpressionModule],
  template: `
    <tri-cron-expression />
    <br />
    <br />
    <tri-cron-expression disabled />
  `
})
export class TriDemoCronExpressionBasicComponent {}
