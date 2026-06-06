import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-confirm-promise',
  imports: [TriButtonModule, TriModalModule],
  template: `<button tri-button type="primary" (click)="showConfirm()">Confirm</button>`
})
export class TriDemoModalConfirmPromiseComponent {
  private readonly modalService = inject(TriModalService);

  showConfirm(): void {
    this.modalService.confirm({
      title: 'Do you Want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
