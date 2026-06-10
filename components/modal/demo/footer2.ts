import { Component, inject, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule, TriModalRef, TriModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-footer2',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showModal1()">
      <span>In Template</span>
    </button>
    <br />
    <br />
    <button tri-button type="primary" (click)="showModal2()">
      <span>In Component</span>
    </button>
    <tri-modal [(visibleChange)]="isVisible" title="Custom Modal Title" (onCancel)="handleCancel()">
      <div *modalContent>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
        <p>Modal Content</p>
      </div>
      <div *modalFooter>
        <span>Modal Footer:</span>
        <button tri-button type="default" (click)="handleCancel()">Custom Callback</button>
        <button tri-button type="primary" (click)="handleOk()" [loading]="isConfirmLoading()">Custom Submit</button>
      </div>
    </tri-modal>
  `
})
export class TriDemoModalFooter2Component {
  private readonly modalService = inject(TriModalService);

  readonly isVisible = signal(false);
  readonly isConfirmLoading = signal(false);

  showModal1(): void {
    this.isVisible.set(true);
  }

  showModal2(): void {
    this.modalService.create({
      title: 'Modal Title',
      content: TriModalCustomFooterComponent
    });
  }

  handleOk(): void {
    this.isConfirmLoading.set(true);
    setTimeout(() => {
      this.isVisible.set(false);
      this.isConfirmLoading.set(false);
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible.set(false);
  }
}

@Component({
  selector: 'tri-modal-custom-footer-component',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <div>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
    </div>
    <div *modalFooter>
      <button tri-button type="default" (click)="destroyModal()">Custom Callback</button>
      <button tri-button type="primary" (click)="destroyModal()">Custom Submit</button>
    </div>
  `
})
export class TriModalCustomFooterComponent {
  private readonly modalRef = inject(TriModalRef);

  destroyModal(): void {
    this.modalRef.destroy();
  }
}
