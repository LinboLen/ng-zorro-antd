import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-loading',
  imports: [TriButtonModule],
  template: `<button tri-button type="default" (click)="createBasicMessage()">Display a loading indicator</button>`
})
export class TriDemoMessageLoadingComponent {
  constructor(private message: TriMessageService) {}

  createBasicMessage(): void {
    const id = this.message.loading('Action in progress..', { nzDuration: 0 }).messageId;
    setTimeout(() => {
      this.message.remove(id);
    }, 2500);
  }
}
