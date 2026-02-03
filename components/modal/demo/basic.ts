import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-basic',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showModal()"><span>Show Modal</span></button>
    <tri-modal [(visibleChange)]="isVisible" title="The first Modal" (onCancel)="handleCancel()" (onOk)="handleOk()">
      <ng-container *modalContent>
        <p>Content one</p>
        <p>Content two</p>
        <p>Content three</p>
      </ng-container>
    </tri-modal>
  `
})
export class TriDemoModalBasicComponent {
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
