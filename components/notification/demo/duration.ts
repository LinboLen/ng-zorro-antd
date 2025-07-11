import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'tri-demo-notification-duration',
  imports: [TriButtonModule],
  template: `<button tri-button type="primary" (click)="createNotification()">Open the notification box</button>`
})
export class TriDemoNotificationDurationComponent {
  constructor(private notification: TriNotificationService) {}

  createNotification(): void {
    this.notification.blank(
      'Notification Title',
      'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      { nzDuration: 0 }
    );
  }
}
