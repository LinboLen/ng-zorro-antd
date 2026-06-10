import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'tri-demo-modal-position',
  imports: [TriButtonModule, TriModalModule],
  template: `
    <button tri-button type="primary" (click)="showModalTop()">Display a modal dialog at 20px to Top</button>
    <tri-modal
      [style]="{ top: '20px' }"
      [(visibleChange)]="isVisibleTop"
      title="20px to Top"
      (onCancel)="handleCancelTop()"
      (onOk)="handleOkTop()"
    >
      <ng-container *modalContent>
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </ng-container>
    </tri-modal>

    <br />
    <br />

    <button tri-button type="primary" (click)="showModalMiddle()">Vertically centered modal dialog</button>
    <tri-modal
      [(visibleChange)]="isVisibleMiddle"
      title="Vertically centered modal dialog"
      centered
      (onCancel)="handleCancelMiddle()"
      (onOk)="handleOkMiddle()"
    >
      <ng-container *modalContent>
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </ng-container>
    </tri-modal>
  `
})
export class TriDemoModalPositionComponent {
  readonly isVisibleTop = signal(false);
  readonly isVisibleMiddle = signal(false);

  showModalTop(): void {
    this.isVisibleTop.set(true);
  }

  showModalMiddle(): void {
    this.isVisibleMiddle.set(true);
  }

  handleOkTop(): void {
    console.log('点击了确定');
    this.isVisibleTop.set(false);
  }

  handleCancelTop(): void {
    this.isVisibleTop.set(false);
  }

  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle.set(false);
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle.set(false);
  }
}
