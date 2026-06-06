import { Component, inject } from '@angular/core';

import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-basic',
  imports: [TriPopconfirmModule],
  template: `
    <a
      tri-popconfirm
      popconfirmTitle="Are you sure delete this task?"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
    >
      Delete
    </a>
  `
})
export class TriDemoPopconfirmBasicComponent {
  private readonly messageService = inject(TriMessageService);

  cancel(): void {
    this.messageService.info('click cancel');
  }

  confirm(): void {
    this.messageService.info('click confirm');
  }
}
