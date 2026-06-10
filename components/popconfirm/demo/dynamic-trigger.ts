import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-popconfirm-dynamic-trigger',
  imports: [FormsModule, TriPopconfirmModule, TriSwitchModule],
  template: `
    <a
      tri-popconfirm
      popconfirmTitle="Are you sure delete this task?"
      [condition]="switchValue()"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
    >
      Delete a task
    </a>
    <br />
    <br />
    Whether directly execute:
    <tri-switch [(ngModel)]="switchValue" />
  `
})
export class TriDemoPopconfirmDynamicTriggerComponent {
  private readonly messageService = inject(TriMessageService);

  readonly switchValue = signal(false);

  cancel(): void {
    this.messageService.info('click cancel');
  }

  confirm(): void {
    this.messageService.info('click confirm');
  }
}
