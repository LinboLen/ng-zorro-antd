import { Component } from '@angular/core';

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
  constructor(private nzMessageService: TriMessageService) {}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }
}
