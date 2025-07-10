import { Component } from '@angular/core';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: '',
  imports: [TriCronExpressionModule],
  template: `
    <tri-cron-expression></tri-cron-expression>
    <br />
    <br />
    <tri-cron-expression disabled></tri-cron-expression>
  `
})
export class TriDemoCronExpressionBasicComponent {}
