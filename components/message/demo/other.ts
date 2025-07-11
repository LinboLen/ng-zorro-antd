import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-other',
  imports: [TriButtonModule],
  template: `
    <button tri-button (click)="createMessage('success')">Success</button>
    <button tri-button (click)="createMessage('error')">Error</button>
    <button tri-button (click)="createMessage('warning')">Warning</button>
  `,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoMessageOtherComponent {
  createMessage(type: string): void {
    this.message.create(type, `This is a message of ${type}`);
  }

  constructor(private message: TriMessageService) {}
}
