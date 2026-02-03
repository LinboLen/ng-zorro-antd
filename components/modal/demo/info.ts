import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-info',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button (click)="info()">Info</button>
    <button tri-button (click)="success()">Success</button>
    <button tri-button (click)="error()">Error</button>
    <button tri-button (click)="warning()">Warning</button>
  `,
  styles: `
    button {
      margin-right: 8px;
    }
  `
})
export class TriDemoModalInfoComponent {
  constructor(private modal: TriModalService) {}

  info(): void {
    this.modal.info({
      title: 'This is a notification message',
      content: '<p>some messages...some messages...</p><p>some messages...some messages...</p>',
      onOk: () => console.log('Info OK')
    });
  }

  success(): void {
    this.modal.success({
      title: 'This is a success message',
      content: 'some messages...some messages...'
    });
  }

  error(): void {
    this.modal.error({
      title: 'This is an error message',
      content: 'some messages...some messages...'
    });
  }

  warning(): void {
    this.modal.warning({
      title: 'This is an warning message',
      content: 'some messages...some messages...'
    });
  }
}
