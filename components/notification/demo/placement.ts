import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriNotificationPlacement, TriNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'tri-demo-notification-placement',
  imports: [TriButtonModule, TriDividerModule, TriIconModule],
  template: `
    <button tri-button (click)="createNotification('top')" type="primary">
      <tri-icon type="border-top" theme="outline" />
      top
    </button>
    <button tri-button (click)="createNotification('bottom')" type="primary">
      <tri-icon type="border-bottom" theme="outline" />
      bottom
    </button>
    <tri-divider></tri-divider>
    <button tri-button (click)="createNotification('topLeft')" type="primary">
      <tri-icon type="radius-upleft" />
      topLeft
    </button>
    <button tri-button (click)="createNotification('topRight')" type="primary">
      <tri-icon type="radius-upright" />
      topRight
    </button>
    <tri-divider></tri-divider>
    <button tri-button (click)="createNotification('bottomLeft')" type="primary">
      <tri-icon type="radius-bottomleft" />
      bottomLeft
    </button>
    <button tri-button (click)="createNotification('bottomRight')" type="primary">
      <tri-icon type="radius-bottomright" />
      bottomRight
    </button>
  `,
  styles: [
    `
      button {
        margin-right: 1em;
      }
    `
  ]
})
export class TriDemoNotificationPlacementComponent {
  placement = 'topRight';

  constructor(private notification: TriNotificationService) {}

  createNotification(position: TriNotificationPlacement): void {
    this.notification.blank(
      'Notification Title',
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      { nzPlacement: position }
    );
  }
}
