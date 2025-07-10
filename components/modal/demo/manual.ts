import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: '',
  imports: [TriButtonModule, TriModalModule],
  template: `<button tri-button (click)="success()">Success</button>`
})
export class TriDemoModalManualComponent {
  constructor(private modalService: TriModalService) {}

  success(): void {
    const modal = this.modalService.success({
      title: 'This is a notification message',
      content: 'This modal will be destroyed after 1 second'
    });

    setTimeout(() => modal.destroy(), 1000);
  }
}
