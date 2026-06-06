import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-locale',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <div>
      <button tri-button type="primary" (click)="showModal()">Modal</button>
      <tri-modal
        [(visibleChange)]="isVisible"
        title="Modal"
        okText="Ok"
        cancelText="Cancel"
        (onOk)="handleOk()"
        (onCancel)="handleCancel()"
      >
        <ng-container *modalContent>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </ng-container>
      </tri-modal>
    </div>
    <br />
    <button tri-button type="primary" (click)="showConfirm()">Confirm</button>
  `
})
export class TriDemoModalLocaleComponent {
  private readonly modalService = inject(TriModalService);

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showConfirm(): void {
    this.modalService.confirm({
      title: 'Confirm',
      content: 'Bla bla ...',
      okText: 'OK',
      cancelText: 'Cancel'
    });
  }
}
