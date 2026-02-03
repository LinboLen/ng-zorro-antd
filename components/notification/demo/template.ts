import { Component, TemplateRef, ViewChild } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { type TriNotificationComponent, TriNotificationService } from 'ng-zorro-antd/notification';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-notification-template',
  imports: [TriButtonModule, TriTagModule],
  template: `
    <button tri-button type="primary" (click)="createNotification()">Open the notification box</button>
    <ng-template let-fruit="data">
      It's a
      <tri-tag [color]="fruit.color">{{ fruit.name }}</tri-tag>
      <button tri-button size="small">Cut It!</button>
    </ng-template>
  `,
  styles: `
    button {
      margin-top: 8px;
    }
  `
})
export class TriDemoNotificationTemplateComponent {
  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{
    $implicit: TriNotificationComponent;
    data: Array<{ name: string; color: string }>;
  }>;

  constructor(private notificationService: TriNotificationService) {}

  createNotification(): void {
    const fruits = [
      { name: 'Apple', color: 'red' },
      { name: 'Orange', color: 'orange' },
      { name: 'Watermelon', color: 'green' }
    ];

    fruits.forEach(fruit => {
      this.notificationService.template(this.template!, { nzData: fruit });
    });
  }
}
