import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: '',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="default" (click)="showModal()">
      <span>Open Draggable Modal</span>
    </button>

    <tri-modal
      draggable
      centered
      [(visibleChange)]="isVisible"
      title="Draggable Modal"
      (onCancel)="handleCancel()"
      (onOk)="handleOk()"
    >
      <ng-container *modalContent>
        <p>Just don't learn physics at school and your life will be full of magic and miracles.</p>
        <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
      </ng-container>
    </tri-modal>
  `
})
export class TriDemoModalDraggableComponent {
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
