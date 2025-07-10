import { Component, TemplateRef } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { type TriNotificationComponent, TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: '',
  imports: [TriIconModule, TriButtonModule],
  template: `
    <ng-template #template>
      <div class="tri-notification-notice-content">
        <div class="tri-notification-notice-with-icon">
          <span class="tri-notification-notice-icon">
            <tri-icon type="smile" style="color: rgb(16, 142, 233);" />
          </span>
          <div class="tri-notification-notice-message">Notification Title</div>
          <div class="tri-notification-notice-description">
            This is the content of the notification. This is the content of the notification. This is the content of the
            notification.
          </div>
        </div>
      </div>
    </ng-template>
    <button tri-button type="primary" (click)="createNotification(template)">Open the notification box</button>
  `
})
export class TriDemoNotificationCustomIconComponent {
  constructor(private notification: TriNotificationService) {}

  createNotification(template: TemplateRef<{ $implicit: TriNotificationComponent; data: undefined }>): void {
    this.notification.template(template);
  }
}
