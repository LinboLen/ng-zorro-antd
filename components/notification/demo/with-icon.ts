import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `
    <button tri-button (click)="createNotification('success')">Success</button>
    <button tri-button (click)="createNotification('info')">Info</button>
    <button tri-button (click)="createNotification('warning')">Warning</button>
    <button tri-button (click)="createNotification('error')">Error</button>
  `,
  styles: [
    `
      button {
        margin-right: 1em;
      }
    `
  ]
})
export class TriDemoNotificationWithIconComponent {
  constructor(private notification: TriNotificationService) {}

  createNotification(type: string): void {
    this.notification.create(
      type,
      'Notification Title',
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.'
    );
  }
}
