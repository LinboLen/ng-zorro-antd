import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';
import { TriPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'tri-demo-popconfirm-async',
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
      Open Popconfirm with async logic
    </button>
  `
})
export class TriDemoPopconfirmAsyncComponent {
  constructor(private nzMessageService: TriMessageService) {}

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    this.nzMessageService.info('click confirm');
  }

  beforeConfirm(): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 3000);
    });
  }
}
