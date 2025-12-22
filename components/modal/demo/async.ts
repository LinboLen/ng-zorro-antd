import { Component, model, signal } from '@angular/core';

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
      [(visibleChange)]="visible"
      title="Modal Title"
      (onCancel)="handleCancel()"
      (onOk)="handleOk()"
      [okLoading]="loading()"
    >
      <p *modalContent>Modal Content</p>
    </tri-modal>
  `
})
export class TriDemoModalAsyncComponent {
  visible = model(false);
  loading = signal(false);

  showModal(): void {
    this.visible.set(true);
  }

  handleOk(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.visible.set(false);
      this.loading.set(false);
    }, 3000);
  }

  handleCancel(): void {
    this.visible.set(false);
  }
}
