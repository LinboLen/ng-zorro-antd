import { Component, inject } from '@angular/core';

import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-locale',
  imports: [TriPopconfirmModule],
  template: `
    <a
      tri-popconfirm
      popconfirmTitle="Are you sure?"
      okText="ok"
      cancelText="cancel"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
    >
      delete
    </a>
  `
})
export class TriDemoPopconfirmLocaleComponent {
  private readonly messageService = inject(TriMessageService);

  cancel(): void {
    this.messageService.info('click cancel');
  }

  confirm(): void {
    this.messageService.info('click confirm');
  }
}
