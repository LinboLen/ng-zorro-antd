import { Component, inject } from '@angular/core';

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
  private readonly messageService = inject(TriMessageService);

  cancel(): void {
    this.messageService.info('click cancel');
  }

  confirm(): void {
    this.messageService.info('click confirm');
  }

  beforeConfirm(): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  }
}
