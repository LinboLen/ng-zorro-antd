import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'tri-demo-notification-update',
  imports: [TriButtonModule],
  template: `<button tri-button type="primary" (click)="createNotification()"> Open the notification box </button>`
})
export class TriDemoNotificationUpdateComponent {
  constructor(private notification: TriNotificationService) {}

  createNotification(): void {
    this.notification.blank('Notification Title', 'Description.', {
      nzKey: 'key'
    });

    setTimeout(() => {
      this.notification.blank('New Title', 'New description', {
        nzKey: 'key'
      });
    }, 1000);
  }
}
