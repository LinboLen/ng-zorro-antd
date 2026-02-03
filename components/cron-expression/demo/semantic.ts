import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { parseExpression } from 'cron-parser';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-semantic',
  imports: [FormsModule, TriCronExpressionModule, DatePipe],
  template: `
    <tri-cron-expression [semantic]="semanticTemplate" [ngModel]="value" (ngModelChange)="getValue($event)" />
    <ng-template #semanticTemplate>Next Time: {{ semantic | date: 'yyyy-MM-dd HH:mm:ss' }}</ng-template>
  `
})
export class TriDemoCronExpressionSemanticComponent {
  value: string = '10 * * * *';
  semantic?: Date;

  getValue(value: string): void {
    try {
      const interval = parseExpression(value);
      this.semantic = interval.next().toDate();
    } catch {
      return;
    }
  }
}
