import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-duration',
  imports: [TriButtonModule],
  template: `<button tri-button type="default" (click)="createBasicMessage()">Customized display duration</button>`
})
export class TriDemoMessageDurationComponent {
  createBasicMessage(): void {
    this.message.success('This is a prompt message for success, and it will disappear in 10 seconds', {
      nzDuration: 10000
    });
  }

  constructor(private message: TriMessageService) {}
}
