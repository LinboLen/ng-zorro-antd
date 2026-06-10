import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'tri-demo-popover-control',
  imports: [TriButtonModule, TriPopoverModule],
  template: `
    <button
      tri-button
      type="primary"
      tri-popover
      popoverTitle="Title"
      [(popoverVisibleChange)]="visible"
      (popoverVisibleChange)="change($event)"
      popoverTrigger="click"
      [popoverContent]="contentTemplate"
    >
      Click me
    </button>
    <ng-template #contentTemplate>
      <a (click)="clickMe()">Close</a>
    </ng-template>
  `
})
export class TriDemoPopoverControlComponent {
  readonly visible = signal(false);

  clickMe(): void {
    this.visible.set(false);
  }

  change(value: boolean): void {
    console.log(value);
  }
}
