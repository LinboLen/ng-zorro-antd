import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CronExpressionParser } from 'cron-parser';

import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';

@Component({
  selector: 'tri-demo-cron-expression-semantic',
  imports: [FormsModule, TriCronExpressionModule, DatePipe],
  template: `
    <tri-cron-expression [semantic]="semanticTemplate" [ngModel]="value()" (ngModelChange)="getValue($event)" />
    <ng-template #semanticTemplate>Next Time: {{ semantic() | date: 'yyyy-MM-dd HH:mm:ss' }}</ng-template>
  `
})
export class TriDemoCronExpressionSemanticComponent {
  readonly value = signal('10 * * * *');
  readonly semantic = signal<Date | undefined>(undefined);

  getValue(value: string): void {
    this.value.set(value);
    try {
      const interval = CronExpressionParser.parse(value);
      this.semantic.set(interval.next().toDate());
    } catch {
      return;
    }
  }
}
