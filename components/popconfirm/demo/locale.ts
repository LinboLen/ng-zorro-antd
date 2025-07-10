import { Component } from '@angular/core';

import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: '',
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
  constructor(private nzMessageService: TriMessageService) {}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }
}
