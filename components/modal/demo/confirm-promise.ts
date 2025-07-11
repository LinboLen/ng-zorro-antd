import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalRef, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-confirm-promise',
  imports: [TriButtonModule, TriModalModule],
  template: `<button tri-button type="primary" (click)="showConfirm()">Confirm</button>`
})
export class TriDemoModalConfirmPromiseComponent {
  confirmModal?: TriModalRef; // For testing by now

  constructor(private modal: TriModalService) {}

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      title: 'Do you Want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
