import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `<button tri-button type="primary" (click)="createNotification()">Open the notification box</button>`
})
export class TriDemoNotificationBasicComponent {
  constructor(private notification: TriNotificationService) {}

  createNotification(): void {
    this.notification
      .blank(
        'Notification Title',
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
      )
      .onClick.subscribe(() => {
        console.log('notification clicked!');
      });
  }
}
