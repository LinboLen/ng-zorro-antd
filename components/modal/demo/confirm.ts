import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-confirm',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showConfirm()">Confirm</button>
    <button tri-button type="dashed" (click)="showDeleteConfirm()">Delete</button>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoModalConfirmComponent {
  constructor(private modal: TriModalService) {}

  showConfirm(): void {
    this.modal.confirm({
      title: '<i>Do you Want to delete these items?</i>',
      content: '<b>Some descriptions</b>',
      onOk: () => console.log('OK')
    });
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      title: 'Are you sure delete this task?',
      content: '<b style="color: red;">Some descriptions</b>',
      okText: 'Yes',
      okType: 'primary',
      okDanger: true,
      onOk: () => console.log('OK'),
      cancelText: 'No',
      onCancel: () => console.log('Cancel')
    });
  }
}
