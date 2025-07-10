import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriNotificationComponent, TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: '',
  imports: [TriButtonModule],
  template: `
    <ng-template #notificationBtnTpl let-notification>
      <button tri-button type="primary" size="small" (click)="notification.close()">Confirm</button>
    </ng-template>

    <button tri-button type="primary" (click)="createNotification()">Open the notification box</button>
  `
})
export class TriDemoNotificationWithBtnComponent {
  @ViewChild('notificationBtnTpl', { static: true }) btnTemplate!: TemplateRef<{ $implicit: TriNotificationComponent }>;
  constructor(private notification: TriNotificationService) {}

  createNotification(): void {
    this.notification.blank(
      'Notification Title',
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
      {
        nzButton: this.btnTemplate
      }
    );
  }
}
