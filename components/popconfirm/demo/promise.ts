import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-promise',
  imports: [TriButtonModule, TriPopconfirmModule],
  template: `
    <button
      tri-button
      type="primary"
      tri-popconfirm
      popconfirmTitle="Title"
      [beforeConfirm]="beforeConfirm"
      (onConfirm)="confirm()"
      (onCancel)="cancel()"
    >
      Open Popconfirm with Promise
    </button>
  `
})
export class TriDemoPopconfirmPromiseComponent {
  constructor(private nzMessageService: TriMessageService) {}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }

  beforeConfirm(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }
}
