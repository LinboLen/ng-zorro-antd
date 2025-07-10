import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: '',
  imports: [TriButtonModule, TriPopoverModule],
  template: `
    <button
      tri-button
      tri-popover
      type="primary"
      popoverTitle="Title"
      popoverTrigger="click"
      [popoverContent]="contentTemplate"
      [popoverOverlayClickable]="false"
      [popoverVisible]="visible"
      (popoverVisibleChange)="visibleChange($event)"
      >Click me</button
    >
    <ng-template #contentTemplate>
      <button tri-button size="small" type="primary" (click)="visibleChange(false)"> Close me </button>
    </ng-template>
  `
})
export class TriDemoPopoverOverlayComponent {
  visible = false;

  visibleChange(value: boolean): void {
    this.visible = value;
  }
}
