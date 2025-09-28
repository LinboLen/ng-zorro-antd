import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'tri-demo-message-custom-style',
  imports: [TriButtonModule],
  template: `<button tri-button type="primary" (click)="createNotification()">Open the notification box</button>`
})
export class TriDemoMessageCustomStyleComponent {
  readonly #messageService = inject(TriMessageService);

  createNotification(): void {
    this.#messageService.success('This is the content of the notification', {
      nzStyle: {
        'margin-top': '20vh'
      },
      nzClass: 'custom-class'
    });
  }
}
