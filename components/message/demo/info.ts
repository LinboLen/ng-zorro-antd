import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-info',
  imports: [TriButtonModule],
  template: `<button tri-button type="primary" (click)="createBasicMessage()">Display normal message</button>`
})
export class TriDemoMessageInfoComponent {
  constructor(private message: TriMessageService) {}

  createBasicMessage(): void {
    this.message.info('This is a normal message');
  }
}
