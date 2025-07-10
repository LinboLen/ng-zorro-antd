import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: '',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showModal()">
      <span>Show Modal</span>
    </button>
    <tri-modal
      [(visibleChange)]="isVisible"
      [title]="modalTitle"
      [content]="modalContent"
      [footer]="modalFooter"
      (onCancel)="handleCancel()"
    >
      <ng-template #modalTitle>Custom Modal Title</ng-template>

      <ng-template #modalContent>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
      </ng-template>

      <ng-template #modalFooter>
        <span>Modal Footer:</span>
        <button tri-button type="default" (click)="handleCancel()">Custom Callback</button>
        <button tri-button type="primary" (click)="handleOk()" [loading]="isConfirmLoading">Custom Submit</button>
      </ng-template>
    </tri-modal>
  `
})
export class TriDemoModalFooterComponent {
  isVisible = false;
  isConfirmLoading = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
