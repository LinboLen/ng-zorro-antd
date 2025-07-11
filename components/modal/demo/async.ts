import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-async',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showModal()">
      <span>Show Modal</span>
    </button>
    <tri-modal
      [(visibleChange)]="isVisible"
      title="Modal Title"
      (onCancel)="handleCancel()"
      (onOk)="handleOk()"
      [okLoading]="isOkLoading"
    >
      <p *modalContent>Modal Content</p>
    </tri-modal>
  `
})
export class TriDemoModalAsyncComponent {
  isVisible = false;
  isOkLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
